# Matt Elgie — Digital Networking Card

A mobile-first digital business card for NFC cards and QR codes. Visitors can save Matt's contact, return their own details with native phone AutoFill, or open a prewritten text message.

## What it does

- Downloads Matt's contact as a standard vCard (`.vcf`)
- Captures a visitor's name and mobile number, with optional professional details
- Records event and source context from the URL
- Stores submissions in a private Google Sheet
- Creates a vCard for each new connection in Google Drive
- Emails Matt the vCard as a one-tap attachment and Drive link
- Optionally sends the visitor one brief acknowledgment when they provide email
- Supports responsive layouts, dark mode, reduced motion, and accessible labels

## Configure

Public profile values live in [`app/profile.ts`](app/profile.ts). The downloadable contact is the concise source vCard at `public/matt-elgie.vcf`. Review the remaining LinkedIn link, biography, and Apps Script endpoint before publishing.

Private values do not belong in this repository. The notification email is stored in Google Apps Script Properties as `NOTIFICATION_EMAIL`.

See [`SETUP.md`](SETUP.md) for the complete Google Sheet, Apps Script, event-link, and publishing instructions.

## Local preview

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

Then open the local address shown in the terminal.

## Verify a production build

```bash
npm run build
```

GitHub Actions runs the same check for pushes and pull requests.

## GitHub Pages

The public static edition lives in `docs/` and deploys through `.github/workflows/pages.yml`. In repository **Settings → Pages**, set **Source** to **GitHub Actions** once. The published address will be `https://melgie26.github.io/contactinfo/`.

## Repository safety

- Never commit notification email addresses, credentials, access tokens, or Apps Script deployment secrets.
- Visitor submissions and generated vCards remain in Google Drive, not GitHub.
- Review [`PRIVACY.md`](PRIVACY.md) before making the final site public.

## URL context examples

```text
https://your-domain.example/?source=NFC
https://your-domain.example/?event=IAFF-Convention-2026&source=NFC
```

These values are recorded with the submission without adding fields for the visitor.
