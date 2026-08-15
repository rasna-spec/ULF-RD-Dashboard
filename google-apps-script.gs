const SHEET_IDS = {
  survey: 'REPLACE_WITH_SURVEY_SHEET_ID',
  deliverable: 'REPLACE_WITH_DELIVERABLE_SHEET_ID'
};

const DELIVERABLE_FOLDER_ID = 'REPLACE_WITH_DELIVERABLE_DRIVE_FOLDER_ID';

const SUBMISSION_SECRET = 'REPLACE_WITH_THE_SAME_SECRET_AS_THE_SERVER';

function doPost(event) {
  const request = JSON.parse(event.postData.contents);
  if (request.secret !== SUBMISSION_SECRET) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  }

  if (request.type === 'survey') {
    appendObjectRow(SHEET_IDS.survey, request.payload);
  } else if (request.type === 'deliverable') {
    request.payload.fileUrl = saveDeliverableFile(request.payload);
    delete request.payload.fileBase64;
    sendDeliverableEmail(request.payload);
    appendObjectRow(SHEET_IDS.deliverable, request.payload);
  } else {
    return jsonResponse({ ok: false, error: 'Unsupported submission type' }, 400);
  }

  return jsonResponse({ ok: true }, 200);
}

function saveDeliverableFile(payload) {
  const bytes = Utilities.base64Decode(payload.fileBase64);
  const blob = Utilities.newBlob(bytes, payload.fileType, payload.fileName);
  const file = DriveApp.getFolderById(DELIVERABLE_FOLDER_ID).createFile(blob);
  return file.getUrl();
}

function appendObjectRow(sheetId, payload) {
  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  const keys = Object.keys(payload);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Submitted at'].concat(keys));
  sheet.appendRow([new Date()].concat(keys.map(key => formatValue(payload[key]))));
}

function sendDeliverableEmail(payload) {
  const subject = `New deliverable: ${payload.title}`;
  const body = [
    `Submitter: ${payload.submitterName}`,
    `Organization: ${payload.organization}`,
    `Task: ${payload.taskName}`,
    `Submission: ${payload.submissionType} (${payload.version})`,
    `File: ${payload.fileUrl}`,
    `Expected next step: ${payload.nextSteps}`,
    '',
    `Changes: ${payload.changes}`,
    '',
    `Notes: ${payload.notes || '(none)'}`
  ].join('\n');
  MailApp.sendEmail(payload.recipientEmail, subject, body);
}

function formatValue(value) {
  return typeof value === 'object' ? JSON.stringify(value) : value;
}

function jsonResponse(payload, status) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}