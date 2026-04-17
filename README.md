# ACA APTC Repayment Calculator

A lightweight, GitHub Pages ready calculator for estimating Premium Tax Credit reconciliation and potential excess APTC repayment for **Plan Year 2026**.

## What it does

This app estimates:

- household income as a percent of FPL
- applicable percentage under 2026 IRS rules
- expected household contribution
- allowed annual Premium Tax Credit
- excess APTC and estimated repayment amount

## Important 2026 rule changes baked into the app

- For **Plan Year 2026**, the temporary enhanced PTC rules expired, so standard PTC eligibility generally ends above **400% of FPL**.
- For **Plan Year 2026 reconciliation**, CMS states there is **no limitation** on excess APTC repayment. In plain English, if advance subsidies exceed the allowed credit, the full excess is potentially repayable.

## Inputs you need

- region used for the poverty guideline
- household size
- filing status
- actual household MAGI
- total APTC received for the year
- annual benchmark premium total
- months covered

## Best source for the annual benchmark premium

Use the annual total for the benchmark second-lowest-cost silver plan from Form 1095-A data. If you only have monthly values, add them up for the covered months.

## Run locally

Because this is a plain static site, you can open `index.html` directly in a browser.

Or serve it locally:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md`.
3. In GitHub, go to **Settings -> Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Pick the `main` branch and `/root` folder.
6. Save.

GitHub will publish the calculator as a static website.

## Limitations

This tool is intentionally simple. It does **not** yet handle:

- shared policy allocation rules
- self-employed health insurance deduction circular calculations
- household composition changes mid-year
- lawfully present immigrant edge cases
- QSEHRA / ICHRA interactions
- separate monthly PTC calculations when benchmark values vary month to month

## Next version ideas

- monthly 1095-A mode
- client save and export
- scenario comparison mode
- warning banners when income is close to a cliff
- support for historical years with older repayment cap tables
