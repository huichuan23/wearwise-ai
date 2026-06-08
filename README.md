# WearWise AI MVP

WearWise AI is a static North America-focused prototype for an Amazon-first AI personal stylist. It helps users build a basic shopper profile, generates outfit recommendations, supports AI-assisted product tagging, and stores early feedback locally.

Live site:

```text
https://huichuan23.github.io/wearwise-ai/
```

## Current Architecture

This version is a static frontend MVP with no backend, no build step, and no database.

```text
Browser
  |
  |-- index.html      Page structure and product workflow surfaces
  |-- styles.css      Layout, responsive design, and visual styling
  |-- app.js          Recommendation logic, AI tagging heuristic, admin tools, local memory
  |
  `-- localStorage    Products, outfit formulas, user profile, and feedback memory
```

## File Structure

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- README.md
|-- DEPLOYMENT.md
|-- vercel.json
|-- .nojekyll
|-- .gitignore
`-- .github/workflows/pages.yml
```

## Core Features

- North America-facing brand and copy
- Style quiz with body type, size range, fit preference, dress code, climate, shoe preference, colors, and avoid list
- Optional photo upload placeholder for future body analysis
- Dynamic outfit recommendation from product pool and outfit formulas
- Structured recommendation explanation:
  - why it works
  - body fit logic
  - occasion fit
  - budget
  - avoid checks
  - swap option
- AI product tagger for Amazon title, description, ASIN, estimated price, and URL intake
- Local admin tools for adding/deleting products and outfit formulas
- Local feedback memory that persists and influences the next recommendation
- Amazon compliance note for estimated prices and availability

## How To Run Locally

Start a static server in the project folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173/
```

The app is static and has no build step.

## How To Use

1. Fill out the style quiz.
2. Click `Generate 3 outfits`.
3. Review the outfit cards and structured recommendation reasons.
4. Click `View on Amazon` to search or open the product source.
5. Use `Like`, `Not my style`, or `Too expensive` to train local feedback memory.
6. Use `AI product tagger` to add new Amazon products from a title, description, ASIN, price, and URL.
7. Use the admin panels to manage products and outfit formulas.

## Deployment

Current public deployment uses GitHub Pages:

```text
https://huichuan23.github.io/wearwise-ai/
```

The repository also includes `vercel.json`, so it can be deployed to Vercel as a static site.

Vercel settings:

```text
Framework Preset: Other
Build Command: empty
Output Directory: empty
Install Command: empty
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Current Limitations

- Product data is stored in each visitor's browser with `localStorage`.
- AI product tagging is currently a local keyword-based heuristic.
- Amazon prices are estimated and should not be treated as live prices.
- Amazon links are search/direct URL placeholders, not full Product Advertising API data.
- There is no user login, shared database, or protected admin area yet.

## Future Optimization Plan

1. Migrate to Next.js for component structure and API routes.
2. Add PostgreSQL and Prisma for shared product, formula, user, and feedback storage.
3. Replace local product tagging rules with a backend LLM endpoint.
4. Add admin login and product review workflow.
5. Add Amazon Associates links or PA API integration.
6. Add real image upload storage.
7. Add AI-assisted body profile analysis after the manual body profile flow is validated.
8. Improve recommendation ranking with user-level preference memory.
9. Add analytics for conversion, feedback quality, and product click-through.

## Maintenance Rule

When code changes affect product behavior, architecture, deployment, data flow, or usage, update this README in the same change.
