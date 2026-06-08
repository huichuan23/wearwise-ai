# Deploy WearWise AI

This project is a static website. It can be deployed without a build step.

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload these files to the repository:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
   - `vercel.json`
   - `.gitignore`
   - `.nojekyll`
3. Go to [Vercel](https://vercel.com/).
4. Click `Add New` -> `Project`.
5. Import the GitHub repository.
6. Use these settings:
   - Framework Preset: `Other`
   - Build Command: leave empty
   - Output Directory: leave empty
   - Install Command: leave empty
7. Click `Deploy`.

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
- Amazon Associates or Product Advertising API integration
