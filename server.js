import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createRequire } from 'module';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
app.use(express.json({ limit: '20mb' }));

// Cliente R2
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = 'ee-videos-audio';
// URL de R2 hardcodeada

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

app.post('/render', async (req, res) => {
  const { guion, audioUrl, audioBase64, titulo, duracionSeg, escenas, tiempos } = req.body;

  if (!guion || !titulo) {
    return res.status(400).json({ error: 'Faltan campos: guion, titulo' });
  }

  if (!audioUrl && !audioBase64) {
    return res.status(400).json({ error: 'Falta audio: envía audioUrl o audioBase64' });
  }

  const slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  if (!fs.existsSync('output')) fs.mkdirSync('output');
  const outputPath = path.join(__dirname, 'output', `${slug}.mp4`);

  let audioSrc = audioUrl || '';
  let audioKey = null;

  if (audioBase64) {
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    const audioBuffer = Buffer.from(base64Data, 'base64');
    audioKey = `${slug}-${Date.now()}.mp3`;

    console.log('Subiendo audio a R2...');
    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: audioKey,
      Body: audioBuffer,
      ContentType: 'audio/mpeg',
    }));

    // URL pública del objeto en R2
    audioSrc = `https://pub-23f19a61958d4d0f9b21dfbf21caf071.r2.dev/${audioKey}`;
    console.log('Audio en R2:', audioSrc);
  }

  const props = {
    guion,
    audioUrl: audioSrc,
    titulo,
    duracionSeg: Number(duracionSeg) || 0,
    escenas: escenas && typeof escenas === 'object' ? escenas : null,
    tiempos: Array.isArray(tiempos) ? tiempos.map(Number) : [],
  };

  try {
    const bundleLocation = await getBundled();

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'EEVideo',
      inputProps: props,
      browserExecutable: '/usr/bin/chromium',
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: props,
      browserExecutable: '/usr/bin/chromium',
    });

    const fileBuffer = fs.readFileSync(outputPath);
    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${slug}.mp4"`);
    res.send(fileBuffer);

    // Limpiar
    fs.unlinkSync(outputPath);
    if (audioKey) {
      await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: audioKey }));
      console.log('Audio eliminado de R2');
    }
  } catch (err) {
    console.error(err);
    if (audioKey) {
      await r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: audioKey })).catch(() => {});
    }
    res.status(500).json({ error: 'Error al renderizar', detalle: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

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
  console.log('R2_ACCESS_KEY_ID longitud:', (process.env.R2_ACCESS_KEY_ID || '').length);
});
