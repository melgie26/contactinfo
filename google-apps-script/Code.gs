/**
 * Google Apps Script backend for Matt's digital contact exchange.
 * Store NOTIFICATION_EMAIL in Script Properties; never put it in this file.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (!data.fullName || !data.phone) throw new Error("Name and phone are required.");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Contacts") ||
      SpreadsheetApp.getActiveSpreadsheet().insertSheet("Contacts");
    const headers = ["Timestamp", "Name", "Phone", "Email", "Organization", "Title", "Notes", "Event", "Source", "Page URL", "Referrer", "vCard"];
    if (sheet.getLastRow() === 0) sheet.appendRow(headers);

    const vcardFile = createVCardFile_(data);
    sheet.appendRow([new Date(), data.fullName, data.phone, data.email || "", data.organization || "", data.title || "", data.notes || "", data.event || "", data.source || "direct", data.pageUrl || "", data.referrer || "", vcardFile.getUrl()]);

    const notify = PropertiesService.getScriptProperties().getProperty("NOTIFICATION_EMAIL");
    if (notify) {
      const where = data.event ? data.event.replace(/[-_]+/g, " ") : (data.source || "Direct visit");
      const text = [
        `New connection: ${data.fullName}`,
        "",
        `Phone: ${data.phone}`,
        `Email: ${data.email || "—"}`,
        `Organization: ${data.organization || "—"}`,
        `Title: ${data.title || "—"}`,
        `Note: ${data.notes || "—"}`,
        `Where you connected: ${where}`,
        `Submitted: ${new Date().toLocaleString()}`,
        "",
        `Open vCard in Google Drive: ${vcardFile.getUrl()}`,
        "The vCard is also attached to this email for one-tap importing on your phone.",
      ].join("\n");
      MailApp.sendEmail({
        to: notify,
        subject: `New connection — ${data.fullName}`,
        body: text,
        replyTo: data.email || undefined,
        attachments: [vcardFile.getBlob()],
      });

      // Send a brief acknowledgment only when the visitor supplied an email.
      if (data.email) {
        MailApp.sendEmail({
          to: data.email,
          cc: notify,
          replyTo: notify,
          name: "Matt Elgie",
          subject: "Thanks for connecting",
          body: "Thanks for making the connection.\n\nMatt",
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(error) })).setMimeType(ContentService.MimeType.JSON);
  }
}

/** Creates a private .vcf file in the spreadsheet's current Drive folder. */
function createVCardFile_(data) {
  const spreadsheetFile = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  const parents = spreadsheetFile.getParents();
  const folder = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const fullName = String(data.fullName || "New Contact").trim();
  const parts = fullName.split(/\s+/);
  const familyName = parts.length > 1 ? parts.pop() : "";
  const givenName = parts.join(" ") || fullName;
  const escapeVCard = value => String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(familyName)};${escapeVCard(givenName)};;;`,
    `FN:${escapeVCard(fullName)}`,
    `TEL;TYPE=CELL:${escapeVCard(data.phone)}`,
  ];
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(data.email)}`);
  if (data.organization) lines.push(`ORG:${escapeVCard(data.organization)}`);
  if (data.title) lines.push(`TITLE:${escapeVCard(data.title)}`);
  if (data.notes) lines.push(`NOTE:${escapeVCard(data.notes)}`);
  lines.push("END:VCARD");

  const safeName = fullName.replace(/[^a-z0-9 _-]/gi, "").replace(/\s+/g, "-") || "New-Contact";
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd-HHmmss");
  const blob = Utilities.newBlob(lines.join("\r\n"), "text/vcard", `${safeName}-${stamp}.vcf`);
  return folder.createFile(blob);
}
