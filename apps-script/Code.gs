/**
 * Halo Sun Energy Systems — lead form backend.
 *
 * What this does:
 *  1. Receives a POST from the website's lead form.
 *  2. Appends the lead as a new row in a Google Sheet.
 *  3. Emails you a notification with the lead details.
 *
 * SETUP — do this once:
 *  1. Create a new Google Sheet. Add a header row in row 1:
 *     Timestamp | Name | Phone | Email | City | Property Type | Monthly Bill | Message
 *  2. In the Sheet, go to Extensions > Apps Script.
 *  3. Delete any starter code and paste in this entire file.
 *  4. Change NOTIFY_EMAIL below to the address that should get lead alerts.
 *  5. Click Deploy > New deployment > select type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  6. Click Deploy, authorize the permissions Google asks for.
 *  7. Copy the Web app URL it gives you.
 *  8. Paste that URL into js/form.js as FORM_CONFIG.endpointUrl.
 *
 * If you ever change the code, you must create a NEW deployment
 * (or use "Manage deployments" > edit > new version) for changes to go live.
 */

const NOTIFY_EMAIL = 'contact.halosunenergy@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.city || '',
      data.propertyType || '',
      data.monthlyBill || '',
      data.message || '',
    ]);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New solar lead: ' + (data.name || 'Unknown'),
      body:
        'New lead from the Halosun Energy Systems website:\n\n' +
        'Name: ' + (data.name || '-') + '\n' +
        'Phone: ' + (data.phone || '-') + '\n' +
        'Email: ' + (data.email || '-') + '\n' +
        'City / Address: ' + (data.city || '-') + '\n' +
        'Property type: ' + (data.propertyType || '-') + '\n' +
        'Average monthly bill: ' + (data.monthlyBill || '-') + '\n' +
        'Message: ' + (data.message || '-') + '\n',
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
