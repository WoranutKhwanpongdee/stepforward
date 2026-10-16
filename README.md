# StepForward

A small learner progress and support tracker for a six-week program. The demo is seeded with ten fictional learners and stores updates in the current browser using localStorage.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js (usually http://localhost:3000).

## What it includes

- Check-in form for learning goal, progress, confidence, obstacles, and support requests.
- Support dashboard with search, status filters, rule-based follow-up priority, and learner profiles.
- Follow-up action records, status changes, and an activity history per learner.
- Browser localStorage persistence, with a restore demo data control.
- English and Thai UI translations, a persistent TH / EN switch, and locale-aware date/number formatting.
- Required-field validation, duplicate-submit protection per check-in form, plus visible success/error messages.
- Responsive layout, semantic form labels, keyboard-operable learner rows and controls, and screen-reader status announcements.

## Prioritization

Priority is intentionally explainable: urgent status adds 5 points; needs-support adds 3; confidence 1–2 adds 3; a support request adds 2; an obstacle adds 1; and an unanswered check-in adds 1. Completed learners score zero. Scores of 7+ are marked Today, 4–6 This week, and 1–3 When available. The team can still manually update a learner's status.

## Tests

```bash
npm test
```

The tests cover check-in field validation and the priority scoring rules. `npm run build` checks the production build.

The UI language is stored separately from learner data under `stepforward-language-v1`, so switching languages does not rewrite check-ins, follow-ups, or learner statuses. User-entered learner content is shown as entered; only interface text is translated.

## Decisions and limitations

- This is a local-first demo: browser data is not shared across devices or team members, and there is no account or server backup.
- The dashboard includes cohort-level sample metrics to make the demo useful at a glance. In particular, check-in rate is illustrative rather than calculated from real attendance records.
- The program is seeded with 10 learners for a 60-person pilot; add or replace demo records in `lib/demo-data.ts` when adapting it.
- localStorage is best-effort. If it is blocked or full, the UI shows an alert and keeps working for the current page session. Restoring demo data replaces the locally saved learner list.
- A learner may have multiple check-ins per day. Re-submitting the same form session is ignored through its unique check-in ID; opening a new form creates a new ID.
