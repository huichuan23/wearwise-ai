# WearWise AI MVP

WearWise AI is a static North America-focused prototype for an Amazon-first AI personal stylist. It helps users build a basic shopper profile, generates outfit recommendations, supports AI-assisted product tagging, and stores early feedback locally.

Live site:

```text
https://huichuan23.github.io/wearwise-ai/
```

## Current Architecture

This version is a Next.js static-export MVP with no backend and no database. It keeps the previous static prototype behavior, but the code is now organized into React components and reusable logic modules.

For the full maintenance-oriented architecture and future project structure, see [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md).

For reusable skills, GitHub projects, and external service research, see [docs/RESEARCH_NOTES.md](./docs/RESEARCH_NOTES.md).

```text
Browser
  |
  |-- app/page.jsx    Main React page and state wiring
  |-- components/     Style quiz, recommendations, product tagger, admin panels
  |-- lib/            Seed data, recommendation logic, AI tagger, storage helpers
  |-- styles.css      Shared visual styling
  |
  `-- localStorage    Products, outfit formulas, user profile, and feedback memory
```

## File Structure

```text
.
|-- index.html
|-- styles.css
|-- app.js
|-- package.json
|-- next.config.mjs
|-- app/
|-- components/
|-- lib/
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

Install dependencies and start the Next.js dev server:

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000/
```

Legacy static files are still present for rollback, but active development should happen in `app/`, `components/`, and `lib/`.

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

The repository also includes `vercel.json`, so it can be deployed to Vercel as a Next.js static-export site.

Vercel settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Output Directory: out
Install Command: npm install
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Current Limitations

- Product data is stored in each visitor's browser with `localStorage`.
- AI product tagging is currently a local keyword-based heuristic.
- Amazon prices are estimated and should not be treated as live prices.
- Amazon links are search/direct URL placeholders, not full Product Advertising API data.
- There is no user login, shared database, or protected admin area yet.

## Future Optimization Plan

1. Add PostgreSQL and Prisma for shared product, formula, user, and feedback storage.
2. Replace local product tagging rules with a backend LLM endpoint.
3. Add admin login and product review workflow.
4. Add Amazon Associates links or approved Amazon API integration.
5. Add real image upload storage.
6. Add AI-assisted body profile analysis after the manual body profile flow is validated.
7. Improve recommendation ranking with user-level preference memory.
8. Add analytics for conversion, feedback quality, and product click-through.

## Maintenance Rule

When code changes affect product behavior, architecture, deployment, data flow, or usage, update this README in the same change.
