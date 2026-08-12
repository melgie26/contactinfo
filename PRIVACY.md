# Privacy notes

This site collects information only when a visitor chooses to submit the contact exchange form.

## Information collected

- Required: name and mobile phone number
- Optional: email, organization, position or title, and a note
- Context: event/source URL parameters, page URL, and referrer when available
- Operational: submission timestamp

## How it is used

Submissions are stored in Matt's private Google Sheet. A private vCard is generated in the same Google Drive folder. Matt receives an email containing the submitted information and vCard. When the visitor provides an email, the system sends one brief acknowledgment and does not enroll the visitor in a mailing list.

## Public-repository boundary

No visitor records, generated vCards, private email addresses, or credentials should be stored in this GitHub repository. The notification address belongs in Google Apps Script Properties under `NOTIFICATION_EMAIL`.

Before public launch, Matt should review this notice and adapt it to any applicable organizational policies or legal requirements.
