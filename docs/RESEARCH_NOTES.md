# Research Notes: Skills, GitHub Projects, and External Services

Last updated: 2026-06-08

This document tracks reusable skills, open-source projects, and external services that may help WearWise AI.

## How To Use This Document

Use this as a rolling research backlog.

Each item should be classified as:

- `Use now`: useful for the current MVP or next production step
- `Evaluate`: promising, but needs a small spike before adoption
- `Later`: useful after the product has backend, database, and user traction
- `Caution`: useful only with legal, license, cost, or infrastructure review

## Available Codex Skills

These are already available in the current Codex environment and should be used when relevant.

### GitHub

Status: `Use now`

Use for:

- repository inspection
- pull request work
- issue tracking
- CI debugging
- publishing code
- researching GitHub projects

Project use:

- Continue using this for repo maintenance, pushes, and future PR workflows.

### Browser / In-App Browser

Status: `Use now`

Use for:

- checking local pages
- verifying deployed pages
- inspecting visual layout
- testing simple user flows

Project use:

- Use after frontend changes to verify the public site and local server.

### OpenAI Docs

Status: `Evaluate`

Use for:

- current OpenAI API guidance
- model selection
- prompt design
- Codex workflows

Project use:

- Use when replacing the local product tagger with a real LLM endpoint.

### Skill Creator

Status: `Evaluate`

Use for:

- creating a project-specific Codex skill

Project use:

- Consider creating a `wearwise-product-manager` or `wearwise-architecture` skill after the workflow stabilizes.

Recommended custom skill ideas:

```text
wearwise-research
  Keeps searching for useful fashion AI projects, Amazon docs, and implementation patterns.

wearwise-product-tagger
  Maintains prompt/schema rules for AI product tagging.

wearwise-review
  Reviews code changes against README, architecture docs, Amazon compliance, and MVP scope.
```

## GitHub Projects: Product Search and Fashion Embeddings

### marqo-ai/marqo-FashionCLIP

Status: `Use now / Evaluate`

URL:

```text
https://github.com/marqo-ai/marqo-FashionCLIP
```

Why it matters:

- Fashion-specific image/text embedding model.
- Useful for product retrieval, text-to-image matching, and category-to-product matching.
- The README states that Marqo-FashionCLIP and Marqo-FashionSigLIP were evaluated across public benchmark datasets and released on Hugging Face.

How WearWise can use it:

- Generate embeddings for Amazon product images and titles.
- Match user text needs such as `business casual, petite, black trouser`.
- Improve product recall before recommendation reranking.

Adoption path:

```text
Product image/title
  -> FashionCLIP embedding
  -> pgvector / vector database
  -> candidate product recall
  -> recommendation reranking
```

Risk:

- Needs Python/ML runtime.
- Image retrieval is a later backend capability, not a static MVP capability.

### patrickjohncyh/fashion-clip

Status: `Evaluate`

URL:

```text
https://github.com/patrickjohncyh/fashion-clip
```

Why it matters:

- FashionCLIP implementation and model reference.
- Useful as a comparison point against Marqo-FashionCLIP.

How WearWise can use it:

- Evaluate product classification and semantic retrieval.
- Compare embedding quality before choosing a production model.

Risk:

- Older than Marqo-FashionCLIP.
- Needs licensing and deployment review before production use.

## GitHub Projects: Body / Clothing Understanding

### TannedCung/SCHP

Status: `Later / Evaluate`

URL:

```text
https://github.com/TannedCung/SCHP
```

Why it matters:

- Human parsing model for segmenting body/clothing regions.
- README describes pretrained models for datasets including LIP and ATR, with clothing/body labels such as upper clothes, pants, dress, coat, shoes, arms, legs, and face.

How WearWise can use it:

- Analyze user-uploaded outfit photos.
- Extract clothing regions and dominant colors.
- Support future body profile or wardrobe recognition features.

Adoption path:

```text
User photo
  -> SCHP segmentation
  -> body/clothing region labels
  -> color and garment extraction
  -> body profile confirmation
```

Risk:

- Requires ML backend and model hosting.
- Body analysis needs careful UX language to avoid harsh or sensitive judgments.

## GitHub Projects: Virtual Try-On

### yisol/IDM-VTON

Status: `Later / Caution`

URL:

```text
https://github.com/yisol/IDM-VTON
```

Why it matters:

- Official implementation of IDM-VTON.
- Diffusion-based virtual try-on can become a high-impact feature after recommendation quality is proven.

How WearWise can use it:

- Generate try-on previews for selected garments.
- Build a visual premium feature later.

Adoption path:

```text
User image + product garment image
  -> preprocessing / dense pose / masks
  -> IDM-VTON inference
  -> try-on output
```

Risk:

- GPU-heavy.
- Requires model hosting and image preprocessing.
- Not recommended for the first commercial MVP.

## GitHub Projects: AI Stylist Reference Architectures

### blu-geek/AI-Stylist-Fashion-Assistant-with-Stable-Diffusion-Amazon-SagemakerAI-and-Amazon-Bedrock

Status: `Evaluate`

URL:

```text
https://github.com/blu-geek/AI-Stylist-Fashion-Assistant-with-Stable-Diffusion-Amazon-SagemakerAI-and-Amazon-Bedrock
```

Why it matters:

- Reference architecture around Amazon Bedrock, SageMaker, and Stable Diffusion.
- Useful for understanding an AWS-heavy AI stylist pipeline.

How WearWise can use it:

- Study prompt-to-outfit workflows.
- Study AWS deployment patterns if the project later moves to AWS.

Risk:

- More infrastructure-heavy than the current product needs.
- Better as a reference than as code to directly adopt.

## Amazon and Affiliate Services

### Amazon Associates Program Policies

Status: `Use now / Caution`

URL:

```text
https://affiliate-program.amazon.com/help/operating/policies
```

Why it matters:

- Official operating rules for affiliate links, qualifying purchases, and program restrictions.
- The policy page is updated and should be treated as the source of truth for compliance.

Important implications:

- Use properly formatted Amazon special links.
- Avoid unsupported scraping or misleading price/availability claims.
- Keep price language conservative unless using approved live data.

### Product Advertising API / Creators API

Status: `Evaluate / Caution`

PA-API URL:

```text
https://webservices.amazon.com/paapi5/documentation/
```

Creators API URL referenced by Amazon:

```text
https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction
```

Important finding:

- The PA-API documentation says PA-API will be deprecated on May 15, 2026 and tells developers to migrate to Creators API.
- Because the current date is after that deprecation date, WearWise should not treat PA-API as the only future integration path.

Recommended direction:

```text
Short term:
  manually curated Amazon URLs / affiliate links

Medium term:
  evaluate Creators API access and requirements

Long term:
  backend product sync service using approved Amazon data source
```

## Recommended Adoption Roadmap

### Phase 1: Current MVP

Use:

- current local product tagger
- manually curated Amazon URLs
- GitHub Pages deployment

Do not use yet:

- virtual try-on
- ML-hosted body parsing
- live Amazon product data sync

### Phase 2: Backend MVP

Use:

- Next.js API routes
- PostgreSQL + Prisma
- LLM product tagging endpoint
- reviewed product tagging workflow

Evaluate:

- Marqo-FashionCLIP for product retrieval
- Creators API for Amazon product data

### Phase 3: Personalization

Use:

- persistent user profiles
- feedback memory
- recommendation analytics
- product click tracking

Evaluate:

- FashionCLIP retrieval
- SCHP for photo/clothing understanding

### Phase 4: Advanced Visual Features

Evaluate:

- IDM-VTON
- Stable Diffusion outfit visualization
- AWS Bedrock/SageMaker if infrastructure needs justify it

## Current Recommendation

The best next technical adoption is:

```text
1. Next.js migration
2. PostgreSQL + Prisma
3. Backend LLM product tagging
4. Admin review workflow
5. Creators API / approved Amazon affiliate data path
6. FashionCLIP retrieval
7. SCHP / IDM-VTON later
```

Do not start with virtual try-on. Recommendation quality and Amazon product operations are more important for the first commercial version.
