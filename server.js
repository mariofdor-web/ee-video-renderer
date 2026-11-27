import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createRequire } from 'module';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
app.use(express.json({ limit: '20mb' }));

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = 'ee-videos-audio';

// ── Estado en memoria de los jobs ──────────────────────────────────────────────
// { [jobId]: { status: 'pending'|'done'|'error', mp4Key, error, createdAt } }
const jobs = {};

// Limpiar jobs viejos cada hora (> 2h)
setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const id of Object.keys(jobs)) {
    if (jobs[id].createdAt < cutoff) delete jobs[id];
  }
}, 60 * 60 * 1000);

let bundled = null;
async function getBundled() {
  if (!bundled) {
    console.log('Bundling Remotion...');
    bundled = await bundle({
      entryPoint: path.join(__dirname, 'src/index.jsx'),
      webpackOverride: (config) => config,
    });
    console.log('Bundle listo.');
  }
  return bundled;
}

// ── Función de render en background ───────────────────────────────────────────
async function renderJob(jobId, body) {
  const { guion, audioUrl, audioBase64, titulo, duracionSeg, escenas, tiempos } = body;
  const slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  if (!fs.existsSync('output')) fs.mkdirSync('output');
  const outputPath = path.join(__dirname, 'output', `${slug}-${jobId}.mp4`);

  let audioSrc = audioUrl || '';
  let audioKey = null;

  try {
    if (audioBase64) {
      const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      const audioBuffer = Buffer.from(base64Data, 'base64');
      audioKey = `${slug}-${Date.now()}.mp3`;
      console.log(`[${jobId}] Subiendo audio a R2...`);
      await r2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: audioKey,
        Body: audioBuffer,
        ContentType: 'audio/mpeg',
      }));
      audioSrc = `https://pub-23f19a61958d4d0f9b21dfbf21caf071.r2.dev/${audioKey}`;
      console.log(`[${jobId}] Audio en R2: ${audioSrc}`);
    }

    const props = {
      guion,
      audioUrl: audioSrc,
      titulo,
      duracionSeg: Number(duracionSeg) || 0,
      escenas: escenas && typeof escenas === 'object' ? escenas : null,
      tiempos: Array.isArray(tiempos) ? tiempos.map(Number) : [],
    };

    const bundleLocation = await getBundled();
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'EEVideo',
      inputProps: props,
      browserExecutable: '/usr/bin/chromium',
    });

    console.log(`[${jobId}] Renderizando...`);
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props,
      browserExecutable: '/usr/bin/chromium',
    });

    // Subir MP4 a R2
    const mp4Key = `mp4/${slug}-${jobId}.mp4`;
    const fileBuffer = fs.readFileSync(outputPath);
    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: mp4Key,
      Body: fileBuffer,
      ContentType: 'video/mp4',
    }));
    console.log(`[${jobId}] MP4 subido a R2: ${mp4Key}`);

    // Limpiar local
    fs.unlinkSync(outputPath);
    if (audioKey) {
      await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: audioKey })).catch(() => {});
    }

    jobs[jobId].status = 'done';
    jobs[jobId].mp4Key = mp4Key;
    jobs[jobId].mp4Url = `https://pub-23f19a61958d4d0f9b21dfbf21caf071.r2.dev/${mp4Key}`;
    console.log(`[${jobId}] Listo.`);

  } catch (err) {
    console.error(`[${jobId}] Error:`, err.message);
    if (audioKey) {
      await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: audioKey })).catch(() => {});
    }
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    jobs[jobId].status = 'error';
    jobs[jobId].error = err.message;
  }
}

// ── POST /render — recibe el job, responde inmediato ──────────────────────────
app.post('/render', (req, res) => {
  const { guion, titulo, audioUrl, audioBase64 } = req.body;

  if (!guion || !titulo) {
    return res.status(400).json({ error: 'Faltan campos: guion, titulo' });
  }
  if (!audioUrl && !audioBase64) {
    return res.status(400).json({ error: 'Falta audio: envía audioUrl o audioBase64' });
  }

  const jobId = crypto.randomUUID();
  jobs[jobId] = { status: 'pending', createdAt: Date.now() };

  // Render en background — NO await
  renderJob(jobId, req.body);

  // Respuesta inmediata
  res.status(202).json({ jobId });
});

// ── GET /status/:jobId — n8n hace polling aquí ────────────────────────────────
app.get('/status/:jobId', (req, res) => {
  const job = jobs[req.params.jobId];
  if (!job) return res.status(404).json({ error: 'Job no encontrado' });

  if (job.status === 'pending') {
    return res.json({ status: 'pending' });
  }
  if (job.status === 'error') {
    return res.json({ status: 'error', error: job.error });
  }
  // done
  res.json({ status: 'done', mp4Url: job.mp4Url, mp4Key: job.mp4Key });
});

// ── GET /download/:jobId — devuelve el MP4 y lo borra de R2 ──────────────────
// (alternativa: n8n descarga directo desde la URL de R2)

app.get('/health', (req, res) => res.json({ status: 'ok', jobs: Object.keys(jobs).length }));

app.get('/chrome-path', (req, res) => {
  const { execSync } = require('child_process');
  try {
    const path1 = execSync('which chromium 2>/dev/null || echo "no"').toString().trim();
    res.json({ chromium: path1 });
  } catch(e) {
    res.json({ error: e.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log('R2_ACCESS_KEY_ID presente:', !!process.env.R2_ACCESS_KEY_ID);
  console.log('R2_SECRET_ACCESS_KEY presente:', !!process.env.R2_SECRET_ACCESS_KEY);
  console.log('R2_ENDPOINT presente:', !!process.env.R2_ENDPOINT);
});
