import express from 'express';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const app = express();
app.use(express.json({ limit: '20mb' }));

// Servir archivos de audio temporales por HTTP
app.use('/audio', express.static(path.join(__dirname, 'output')));

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
  const outputPath = path.join(__dirname, 'output', `${slug}.mp4`);
  if (!fs.existsSync('output')) fs.mkdirSync('output');

  // Si llega base64, escribirlo a disco y servirlo por HTTP local
  let audioSrc = audioUrl || '';
  let tempAudioPath = null;
  const audioFileName = `${slug}-audio.mp3`;

  if (audioBase64) {
    tempAudioPath = path.join(__dirname, 'output', audioFileName);
    const base64Data = audioBase64.replace(/^data:audio\/\w+;base64,/, '');
    fs.writeFileSync(tempAudioPath, Buffer.from(base64Data, 'base64'));
    audioSrc = `http://localhost:${process.env.PORT || 8080}/audio/${audioFileName}`;
    console.log('Audio escrito a disco, sirviendo en:', audioSrc);
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

    // Limpiar archivos temporales
    fs.unlinkSync(outputPath);
    if (tempAudioPath && fs.existsSync(tempAudioPath)) {
      fs.unlinkSync(tempAudioPath);
    }
  } catch (err) {
    console.error(err);
    if (tempAudioPath && fs.existsSync(tempAudioPath)) {
      fs.unlinkSync(tempAudioPath);
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
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
