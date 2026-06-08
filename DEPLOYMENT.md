# Deploy WearWise AI

This project is a Next.js static-export site. It builds to the `out/` directory.

## Deploy to GitHub Pages

Current production URL:

```text
https://huichuan23.github.io/wearwise-ai/
```

GitHub Pages deployment is handled by:

```text
.github/workflows/pages.yml
```

The workflow runs:

```text
npm ci
npm run build
```

With:

```text
GITHUB_PAGES=true
```

This enables the `/wearwise-ai` base path in `next.config.mjs`.

After building, the workflow publishes the generated `out/` directory to the `gh-pages` branch, which is the current GitHub Pages source for the live site.

The `public/.nojekyll` file is copied into `out/.nojekyll` during the Next.js static export so GitHub Pages serves the `_next/` asset directory correctly.

## Deploy to Vercel

1. Go to [Vercel](https://vercel.com/).
2. Click `Add New` -> `Project`.
3. Import `huichuan23/wearwise-ai`.
4. Use these settings:
   - Framework Preset: `Next.js`
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `out`
5. Click `Deploy`.

Vercel will give you a URL like:

```text
https://wearwise-ai.vercel.app
```

## Add a custom domain

1. Open the project in Vercel.
2. Go to `Settings` -> `Domains`.
3. Add your domain, for example:

```text
wearwiseai.com
```

4. Follow Vercel's DNS instructions at your domain registrar.

## Important MVP limitation

The app currently stores product data, formulas, profile data, and feedback in the visitor's browser using `localStorage`.

That is fine for early demos, but production needs:

- database storage
- admin login
- backend AI tagging
- Amazon Associates or approved Amazon API integration
