# ACA Agent Scenario Planner

A GitHub-ready React + TypeScript app for comparing 2 Marketplace income scenarios before quoting.

## What it does

- compares 2 projected income scenarios
- estimates FPL percentage
- shows CSR tier changes
- estimates monthly and annual APTC
- estimates net premium
- estimates repayment exposure if actual year-end income is entered

## Important scope note

This is a planning and quoting tool, not an exact Form 8962 reconciliation calculator. It uses a benchmark premium estimate entered by the user.

## 2026 rules embedded in this MVP

- Uses the 2025 poverty guidelines for 2026 Marketplace planning
- Uses the 2026 applicable percentage table from IRS Rev. Proc. 2025-25
- Assumes no repayment cap on excess APTC for tax years after 2025
- Assumes households above 400% FPL are generally not eligible for PTC in 2026

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

You can deploy this with any static host. For GitHub Pages, the easiest path is:

1. Push the repo to GitHub
2. Add a Pages workflow or use a standard Vite Pages deploy action
3. Serve the `dist` folder

## Files to update later

- `src/lib/constants.ts` for poverty guidelines and applicable percentage tables
- `src/lib/calculations.ts` for future rule changes

## Compliance reminder

This tool should be used for good-faith income planning only. Final subsidy reconciliation is determined by IRS Form 8962 and official Marketplace data.
