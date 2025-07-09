# MpDecals USA - Custom Dirtbike Graphics Website

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build and run locally:
   ```bash
   npm run dev
   ```

3. Visit http://localhost:3000

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set the following environment variables in Vercel:
   - `GMAIL_USER`: Your Gmail address (e.g., mpdecalsusa@gmail.com)
   - `GMAIL_APP_PASSWORD`: Your Gmail app password (not your regular password)
   - `FROM_EMAIL`: Email address to send from (should match GMAIL_USER)
   - `TO_EMAIL`: Email address to receive form submissions
   - `DEV_EMAIL`: Developer email for notifications
   - `ACCESS_KEY_ID`: AWS S3 access key
   - `SECRET_ACCESS_KEY`: AWS S3 secret key
   - `S3_REGION`: AWS S3 region

4. Deploy! Vercel will automatically build and deploy your app.

## Build Commands for Vercel

- Build Command: `npm run build && npm run transpile`
- Output Directory: `dist`

The vercel.json file is configured to handle routing and static file serving.