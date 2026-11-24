const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/render', async (req, res) => {
  const { guion, audioUrl, titulo } = req.body;
  
  if (!guion || !titulo) {
    return res.status(400).json({ error: 'Faltan campos: guion, titulo' });
  }

  const slug = titulo.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  const outputPath = path.join(__dirname, 'output', `${slug}.mp4`);
  
  if (!fs.existsSync('output')) fs.mkdirSync('output');

  // Escribir datos para Remotion
  const dataPath = path.join(__dirname, 'src', 'data.json');
  fs.writeFileSync(dataPath, JSON.stringify({ guion, audioUrl, titulo }));

  try {
    execSync(`npx remotion render src/index.jsx EEVideo ${outputPath} --props='${dataPath}'`, {
      timeout: 300000,
      stdio: 'inherit'
    });

    const fileBuffer = fs.readFileSync(outputPath);
    res.set('Content-Type', 'video/mp4');
    res.set('Content-Disposition', `attachment; filename="${slug}.mp4"`);
    res.send(fileBuffer);

    // Limpiar archivo temporal
    fs.unlinkSync(outputPath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al renderizar', detalle: err.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));