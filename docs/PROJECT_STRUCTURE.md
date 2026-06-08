# WearWise AI Project Structure

This document describes the current MVP structure and the recommended future architecture for long-term maintenance.

## Product Scope

WearWise AI is an Amazon-first AI personal stylist for the North American market.

The current MVP focuses on:

- collecting a shopper profile
- recommending outfits from a small product pool
- AI-assisted Amazon product tagging
- local admin management for products and outfit formulas
- collecting feedback memory

The product should grow from a Next.js static-export MVP into a full web app with persistent data, authenticated admin workflows, AI APIs, and Amazon affiliate integrations.

## Current Next.js Static Export Architecture

The current version has been migrated to Next.js while preserving the static MVP behavior. It has no backend and no database yet.

```text
User Browser
  |
  |-- app/page.jsx
  |     Main page state and workflow wiring
  |
  |-- components/
  |     StyleQuiz
  |     RecommendationCard
  |     ProductTagger
  |     ProductPool
  |     FormulaManager
  |     FeedbackMemory
  |
  |-- lib/
  |     data/seedData
  |     recommendation/engine
  |     ai/productTagger
  |     storage/localStorage
  |     utils/tags
  |
  |-- styles.css
  |     Shared visual system
  |
  `-- localStorage
        wearwise.products
        wearwise.formulas
        wearwise.feedback
        wearwise.profile
```

## Current File Structure

```text
.
|-- package.json
|-- next.config.mjs
|-- jsconfig.json
|-- app/
|   |-- layout.jsx
|   |-- page.jsx
|   `-- globals.css
|-- components/
|   |-- AdminPanels.jsx
|   |-- ProductTagger.jsx
|   |-- RecommendationCard.jsx
|   `-- StyleQuiz.jsx
|-- lib/
|   |-- ai/
|   |   `-- productTagger.js
|   |-- data/
|   |   `-- seedData.js
|   |-- recommendation/
|   |   `-- engine.js
|   |-- storage/
|   |   `-- localStorage.js
|   `-- utils/
|       `-- tags.js
|-- index.html
|-- styles.css
|-- app.js
|-- README.md
|-- DEPLOYMENT.md
|-- vercel.json
|-- .nojekyll
|-- .gitignore
|-- docs/
|   `-- PROJECT_STRUCTURE.md
`-- .github/
    `-- workflows/
        `-- pages.yml
```

`index.html` and `app.js` are legacy static rollback files. New feature work should happen in the Next.js folders.

## Current Runtime Flow

```text
1. User opens the site
2. `app/page.jsx` loads seed data or saved localStorage data
3. User fills the style quiz
4. Profile is saved to localStorage
5. Recommendation engine scores outfit formulas
6. For each formula, the engine picks products by category:
   - Top
   - Bottom
   - Shoes
   - Outerwear
7. Recommendation cards render with structured reasons
8. User feedback is saved to localStorage
9. Next recommendation uses feedback memory to adjust ranking
```

## Current Data Model

### Product

```text
id
name
category
price
style[]
occasion[]
fit[]
avoid[]
asin
amazonUrl
status
```

Purpose:

- Used by the recommendation engine
- Managed through the product pool admin panel
- Generated through the AI product tagger

### Outfit Formula

```text
id
name
occasion
style
bodyFit[]
note
image
```

Purpose:

- Defines outfit composition intent
- Helps keep recommendations stable and explainable
- Used as the first ranking layer before product selection

### User Profile

```text
height
bodyType
sizeRange
fitPreference
occasion
style
budget
dressCode
climate
goal
shoePreference
colors[]
avoid[]
photoName
```

Purpose:

- Captures user needs for a single recommendation session
- Currently persisted locally
- Future versions should persist this per authenticated user

### Feedback

```text
type
formula
style
productIds[]
time
```

Purpose:

- Records user preference signals
- Influences product and formula scoring
- Future versions should become a persistent preference model

## Current Recommendation Engine

The MVP engine uses rules rather than machine learning.

```text
scoreFormula(formula, profile, memory)
  |
  |-- score occasion match
  |-- score style match
  |-- score body fit match
  |-- score feedback memory
  |-- pickProductsForFormula()
  |-- score total budget fit
  `-- return ranked outfit
```

Product scoring considers:

- occasion match
- style match
- body/height/size fit
- avoid tags
- budget fit
- shoe preference
- user avoid terms
- liked/disliked product memory
- liked/disliked style memory

## Current AI Product Tagger

The current tagger is a local keyword-based heuristic.

Input:

```text
product title
ASIN
estimated price
Amazon URL
product description
```

Output:

```text
category
style[]
occasion[]
fit[]
avoid[]
confidence
aiNotes
```

Future replacement:

```text
Frontend form
  -> Backend API route
  -> LLM product tagging prompt
  -> JSON validation
  -> Admin review
  -> Database save
```

## Deployment Architecture

Current:

```text
GitHub repository
  |
  |-- main branch
  |     source of truth
  |
  |-- GitHub Actions
  |     npm install
  |     npm run build
  |     upload out/
  |
  `-- GitHub Pages
        public deployment
```

Live URL:

```text
https://huichuan23.github.io/wearwise-ai/
```

Vercel-ready Next.js static-export config is also present through `vercel.json`.

## Recommended Future Architecture

When the MVP is ready for production, keep the Next.js app and add backend services, database storage, and authenticated admin workflows.

```text
Browser
  |
  v
Next.js App
  |
  |-- Public user pages
  |-- Admin dashboard
  |-- API routes
  |
  v
Backend Services
  |
  |-- Product tagging service
  |-- Recommendation service
  |-- Feedback service
  |-- Amazon integration service
  |
  v
PostgreSQL + Prisma
  |
  |-- users
  |-- user_profiles
  |-- products
  |-- outfit_formulas
  |-- recommendations
  |-- recommendation_items
  |-- feedback
  |-- preference_memory
```

## Recommended Future Folder Structure

```text
.
|-- app/
|   |-- layout.tsx
|   |-- page.tsx
|   |-- admin/
|   |   |-- page.tsx
|   |   |-- products/
|   |   `-- formulas/
|   |-- api/
|   |   |-- products/
|   |   |-- formulas/
|   |   |-- recommendations/
|   |   |-- feedback/
|   |   `-- ai/
|   |       `-- tag-product/
|   `-- globals.css
|
|-- components/
|   |-- StyleQuiz.tsx
|   |-- RecommendationCard.tsx
|   |-- ProductTagger.tsx
|   |-- ProductPool.tsx
|   |-- FormulaManager.tsx
|   `-- FeedbackMemory.tsx
|
|-- lib/
|   |-- recommendation/
|   |   |-- scoreFormula.ts
|   |   |-- scoreProduct.ts
|   |   `-- buildReasons.ts
|   |-- ai/
|   |   |-- tagProduct.ts
|   |   `-- prompts.ts
|   |-- amazon/
|   |   |-- links.ts
|   |   `-- paapi.ts
|   |-- db.ts
|   `-- storage.ts
|
|-- prisma/
|   |-- schema.prisma
|   `-- migrations/
|
|-- docs/
|   |-- PROJECT_STRUCTURE.md
|   |-- DATA_MODEL.md
|   |-- PRODUCT_ROADMAP.md
|   `-- AMAZON_COMPLIANCE.md
|
|-- public/
|   `-- assets/
|
|-- package.json
|-- README.md
`-- DEPLOYMENT.md
```

## Future Database Tables

### users

Stores authenticated users.

```text
id
email
name
created_at
updated_at
```

### user_profiles

Stores body and style preferences.

```text
id
user_id
height
body_type
size_range
fit_preference
dress_code
climate
shoe_preference
favorite_colors
avoid_terms
created_at
updated_at
```

### products

Stores Amazon product records.

```text
id
asin
name
category
estimated_price
amazon_url
affiliate_url
image_url
style_tags
occasion_tags
fit_tags
avoid_tags
status
ai_confidence
created_at
updated_at
```

### outfit_formulas

Stores outfit templates.

```text
id
name
occasion
style
body_fit_tags
avoid_tags
note
image_url
status
created_at
updated_at
```

### recommendations

Stores generated recommendation sessions.

```text
id
user_id
profile_snapshot
occasion
style
budget
created_at
```

### recommendation_items

Stores each outfit result.

```text
id
recommendation_id
formula_id
product_ids
score
reason
created_at
```

### feedback

Stores user reactions.

```text
id
user_id
recommendation_item_id
feedback_type
product_ids
style
created_at
```

### preference_memory

Stores summarized user preference signals.

```text
id
user_id
liked_styles
disliked_styles
liked_colors
disliked_colors
liked_product_ids
disliked_product_ids
preferred_budget_min
preferred_budget_max
updated_at
```

## Maintenance Guidelines

When changing code, update documentation in the same change if the edit affects:

- architecture
- file structure
- product behavior
- data flow
- deployment
- external integrations
- admin workflow
- user workflow

Recommended documentation targets:

- Update `README.md` for user-facing usage and high-level architecture.
- Update `docs/PROJECT_STRUCTURE.md` for structural or technical changes.
- Add new docs under `docs/` for deeper topics such as data model, Amazon compliance, AI prompts, or roadmap.

## Refactor Rules

- Keep product logic separate from rendering when migrating to Next.js.
- Keep recommendation scoring deterministic before adding AI reranking.
- Store AI outputs as reviewed data, not unquestioned truth.
- Keep Amazon price and availability language conservative unless using approved live data.
- Keep admin workflows simple before adding automation.
- Preserve a working static or staging deployment after each major change.
