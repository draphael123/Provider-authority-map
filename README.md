# Fountain · Provider Authority Map

React dashboard for Fountain telehealth provider licensing by state. Built with React, D3 (geo), and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. Click **Add New** → **Project** and import **draphael123/Provider-authority-map**.
3. Vercel will detect Vite; use:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your app will be live at `https://provider-authority-map-*.vercel.app`.

Or use the Vercel CLI from this folder:

```bash
npx vercel
```

Follow the prompts and deploy.
