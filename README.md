# WearWise AI MVP

Static North America prototype for an Amazon-first AI personal stylist.

## Included

- North America-facing brand and copy
- Expanded style quiz with body type, size range, fit preference, dress code, climate, shoe preference, colors, and avoid list
- Optional photo upload placeholder for future body analysis
- Dynamic outfit recommendation from product pool and outfit formulas
- Structured recommendation explanation: why it works, body fit logic, occasion fit, budget, avoid checks, and swap option
- AI product tagger for Amazon title, description, ASIN, price, and URL intake
- Local admin tools for adding/deleting products and outfit formulas
- Local feedback memory that persists and influences the next recommendation
- Amazon compliance note for estimated prices and availability

## How to open

Use the local server:

```text
http://127.0.0.1:5173/
```

The app is static and has no build step.

## Deploy

This project is ready for static deployment on Vercel.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full deployment guide.

Vercel settings:

```text
Framework Preset: Other
Build Command: empty
Output Directory: empty
Install Command: empty
```

## Next production steps

1. Replace local AI tagging rules with a backend LLM endpoint.
2. Replace Amazon search links with Amazon Associates affiliate links or PA API data.
3. Move localStorage data to PostgreSQL.
4. Add real authentication and user profiles.
5. Add image-based body analysis after the manual body profile flow proves useful.
