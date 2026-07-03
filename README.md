# YasatikaStyles Frontend

React + Vite e-commerce frontend for YasatikaStyles, connected to the Spring Boot backend in the sibling `yasatika-backend` project.

## Tech Stack
- **React 18**
- **Vite** (build tool)
- Plain CSS-in-JS (no Tailwind needed — styles are inline in `App.jsx`)
- Connects to a Spring Boot + MySQL backend via REST API
- Razorpay Checkout for payments

---

## 1. Local Setup

### Prerequisites
- Node.js 18+ (`node -v`)
- The backend running locally on `http://localhost:8080` (see `yasatika-backend/README.md`)

### Install & Run
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

By default, `.env` points to `http://localhost:8080/api` — make sure your backend is running there.

---

## 2. Project Structure
```
yasatika-frontend/
├── public/              → static assets (favicon, etc.)
├── src/
│   ├── App.jsx          → the entire app (home, shop, cart, checkout, all components)
│   └── main.jsx         → React entry point
├── index.html           → Vite HTML entry
├── vite.config.js
├── package.json
├── .env                 → local API URL (gitignored values can go in .env.local)
└── .env.example         → template for production env vars
```

All product images are currently embedded as base64 strings directly in `App.jsx` (no external `/public/images` needed) — this keeps the file self-contained but makes it large. If you want to optimize later, move them to `public/images/` and reference by path instead.

---

## 3. Connecting to Your Deployed Backend

Once your backend is live (e.g. on Railway), update the environment variable:

**Option A — Local `.env` file:**
```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

**Option B — Set in your hosting platform (Netlify/Vercel):**
Add an environment variable named `VITE_API_URL` with your backend URL in the site's dashboard. Vite automatically picks this up at build time.

---

## 4. Building for Production
```bash
npm run build
```
This outputs a `dist/` folder — that's your complete static site, ready to deploy.

---

## 5. Deploying to Netlify (Free)

### Option A — Netlify Drop (no account setup needed)
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder onto the page
4. Get a live link instantly

### Option B — Connect GitHub repo (recommended for updates)
1. Push this project to GitHub
2. Go to https://netlify.com → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable `VITE_API_URL` in Site Settings → Environment Variables
6. Deploy

---

## 6. Deploying to Vercel (Alternative — Free)
1. Push to GitHub
2. Go to https://vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — no config needed
4. Add `VITE_API_URL` under Project Settings → Environment Variables
5. Deploy

---

## 7. Razorpay Checkout

The Razorpay script is loaded dynamically at checkout time (see `loadRazorpayScript()` in `App.jsx`) — no need to add it to `index.html` manually.

Make sure your backend's `RAZORPAY_KEY_ID` is set to a **test key** while developing (`rzp_test_...`), then switch to live keys once you're ready to accept real payments.

---

## 8. Connecting to Your Custom Domain

Once deployed on Netlify/Vercel:
1. Buy a domain (e.g. `yasatikastyles.com`) from Namecheap or GoDaddy
2. In Netlify/Vercel dashboard → Domain Settings → Add custom domain
3. Update your domain's DNS records as instructed
4. Your site goes live at `www.yasatikastyles.com`

Don't forget to also update the CORS allowed origins in your backend's `SecurityConfig.java` with your final domain.

---

Built with care for **YasatikaStyles** — Modest Luxury, Premium Fashion. 🌸
