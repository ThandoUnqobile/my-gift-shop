
# Floressence – Static Online Shop

This is a **fully functional static shop** ready to host on **GitHub Pages**. It includes:
- Product catalog grouped by categories
- Add‑to‑cart with localStorage persistence
- Checkout with **PayPal Smart Buttons** (Sandbox by default)
- Responsive pink theme and placeholder images
- Pages: `index.html`, `shop.html`, `checkout.html`, `thank-you.html`

## Quick start (GitHub Pages)

1. Create a new GitHub repo and upload these files.
2. In repo settings → **Pages** → set source to `main`/`root`.
3. Visit your Pages URL to see the shop.

## Enable real payments

The checkout uses PayPal in **sandbox** mode with `client-id=sb`.
To accept real payments:
1. Create a PayPal Business account and an app to get your **Client ID**.
2. Edit `checkout.html` and replace:
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=ZAR"></script>
   ```
   with
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=YOUR_LIVE_CLIENT_ID&currency=ZAR"></script>
   ```
3. Commit and deploy. You're live.

## Customize
- Update `data.js` to change products, prices or categories.
- Replace images in `/assets` (logo, placeholders per product if desired).
- Colors and layout live in `styles.css`.

---
WhatsApp: 0718008231 • Instagram: @floressence_gift_shop
