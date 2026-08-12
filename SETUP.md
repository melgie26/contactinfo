# Matt's digital networking card

## Personalize the page

Edit `app/profile.ts` to adjust the public profile. The current phone, email, website, title, and organization match `public/matt-elgie.vcf`. Review the LinkedIn URL and bio before launch. To replace the headshot, update `public/matt-headshot.png`.

## Connect the private contact collector

1. Create a Google Sheet, then open **Extensions → Apps Script**.
2. Paste in `google-apps-script/Code.gs` and save.
3. In Apps Script, open **Project Settings → Script Properties**. Add `NOTIFICATION_EMAIL` with the email address that should receive alerts.
4. Choose **Deploy → New deployment → Web app**. Run as yourself and allow access to anyone.
5. Copy the web app URL into `formEndpoint` in `app/profile.ts`.

The notification address stays in Google's private Script Properties and is never committed to GitHub.
Each submission also creates a private `.vcf` contact file in the same Drive folder as the Sheet. Its link is saved in the Sheet's **vCard** column. The notification email includes both a Drive link and the `.vcf` as an attachment, so it can be opened and added to Contacts directly from a phone.

When a visitor includes an email address, the script automatically sends them a brief **Thanks for connecting** acknowledgment and CCs the private `NOTIFICATION_EMAIL`. No acknowledgment is sent when the email field is blank.

## Event and source links

Add optional parameters to any NFC or QR link:

- `?source=NFC`
- `?event=IAFF-Convention-2026&source=NFC`

They are captured automatically with each submission.

## Publish with GitHub Pages

The project is ready to keep in GitHub. For the simplest static GitHub Pages deployment, connect the repository to a Pages-compatible build workflow. If you prefer automatic preview deployments, Vercel or Cloudflare Pages can also build directly from the same GitHub repository.
