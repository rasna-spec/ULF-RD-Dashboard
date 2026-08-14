import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';
const distDirectory = path.join(__dirname, 'dist');

if (!fs.existsSync(distDirectory)) {
  console.error('Missing production build. Run "npm run build" before starting the server.');
  process.exit(1);
}

app.use(express.static(distDirectory));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(distDirectory, 'index.html'));
});

app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'prosthetic-user-survey.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
