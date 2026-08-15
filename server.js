import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';
const submissionEndpoint = process.env.GOOGLE_APPS_SCRIPT_URL;
const submissionSecret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
const reviewerEmails = JSON.parse(process.env.REVIEWER_EMAILS_JSON || '{}');

app.use(express.json({ limit: '15mb' }));
app.use(express.static(__dirname));

async function forwardSubmission(type, payload) {
  if (!submissionEndpoint || !submissionSecret) {
    throw new Error('Submission integration is not configured');
  }

  const response = await fetch(submissionEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, payload, secret: submissionSecret })
  });

  if (!response.ok) throw new Error(`Submission endpoint returned ${response.status}`);
}

app.post('/api/survey', async (req, res) => {
  try {
    if (req.body.consent !== true) return res.status(400).json({ error: 'Consent is required.' });
    await forwardSubmission('survey', req.body);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Survey submission failed:', error.message);
    res.status(503).json({ error: 'Survey submission is unavailable.' });
  }
});

app.post('/api/deliverables', async (req, res) => {
  try {
    const { submitterName, organization, taskName, submissionType, version, changes, recipientEmail, otherReviewerEmail, nextSteps, fileName, fileBase64 } = req.body;
    if (![submitterName, organization, taskName, submissionType, version, changes, recipientEmail, nextSteps, fileName, fileBase64].every(Boolean)) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }
    const resolvedRecipient = recipientEmail === 'other' ? otherReviewerEmail : reviewerEmails[recipientEmail];
    if (!resolvedRecipient || !/^[^\s@]+@universallimbs\.com$/i.test(resolvedRecipient)) {
      return res.status(400).json({ error: 'Invalid reviewer.' });
    }
    req.body.recipientEmail = resolvedRecipient;
    await forwardSubmission('deliverable', req.body);
    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Deliverable submission failed:', error.message);
    res.status(503).json({ error: 'Deliverable submission is unavailable.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/survey', (req, res) => {
  res.sendFile(path.join(__dirname, 'prosthetic-user-survey.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
