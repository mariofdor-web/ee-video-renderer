const express = require('express');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));

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
  const { guion, audioUrl, titulo } = req.body;

  if (!guion || !titulo) {
    return res.status(400).json({ error: 'Faltan campos: guion, titulo' });
  }

  const slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  const outputPath = path.join(__dirname, 'output', `${slug}.mp4`);

  if (!fs.existsSync('output')) fs.mkdirSync('output');

  try {
    const bundleLocation = await getBundled();

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'EEVideo',
      inputProps: { guion, audioUrl: audioUrl || '', titulo },
      browserExecutable: '/usr/bin/chromium',
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: { guion, audioUrl: audioUrl || '', titulo },
      browserExecutable: '/usr/bin/chromium',
    });

    const fileBuffer = fs.readFileSync(outputPath);
    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${slug}.mp4"`);
    res.send(fileBuffer);

    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al renderizar', detalle: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));