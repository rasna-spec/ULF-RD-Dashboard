import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Serve static files from root directory
app.use(express.static(__dirname));

// Route for root dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for survey
app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'prosthetic-user-survey.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
