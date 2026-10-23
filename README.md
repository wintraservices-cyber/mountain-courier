# Mountain Courier Service — demo concept

ArrowheadX prospect demo for Mountain Courier Service (Lake Arrowhead, CA).

- `index.html` — redesigned site: pickup request form, 24/7 chat (scripted demo), how it works, hours, FAQ
- `compare.html` — current site vs. demo, plus how the service compares with P.O. Box self-pickup, Uber Courier/Direct, and Arrowhead Express Expedited
- `styles.css`, `app.js` — shared styles and demo behavior

Static site, no build step. Deployed on Vercel. Pages are `noindex` so the demo never competes with the business's real site in search.

## Demo limits

- The form and chat don't send anything. In production they post to GoHighLevel and trigger an SMS confirmation.
- Chat replies are keyword-matched, not AI. Phase 1 replaces them with an assistant trained on the owner's real answers.

## Confirm with the owner before launch

- Towns on the route
- "Local since 2008" (from Dun & Bradstreet listing)
- How prices are quoted
- Facebook and Instagram page URLs
