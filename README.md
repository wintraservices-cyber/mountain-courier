# Mountain Courier Service — demo concept

ArrowheadX prospect demo for Mountain Courier Service (Lake Arrowhead, CA).

- `index.html` — animated redesign: mountain-scene hero (van drives P.O. → cabin, parallax ridges, snowfall toggle), live Pacific-time status badge, scroll-driven "how it works" route, pickup request form with send animation, live weekly schedule, FAQ, 24/7 chat (scripted demo) with typing indicator. Respects reduced-motion.
- `compare.html` — current site (general contact form, phone, email) vs. demo, plus how the service compares with P.O. Box self-pickup, Uber Courier/Direct, and Arrowhead Express Expedited
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
