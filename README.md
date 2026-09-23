# Tastify: Georgian food delivery in Batumi

[![CI](https://github.com/Davitxxdavit/tastify-front/actions/workflows/ci.yml/badge.svg)](https://github.com/Davitxxdavit/tastify-front/actions/workflows/ci.yml)

React web client for **Tastify**, a restaurant ordering app. Customers browse the menu, build a cart with extras, check out, then follow their order live and chat with the kitchen. It runs against the NestJS **[Tastify API (testify-back)](https://github.com/Davitxxdavit/testify-back)** over REST and Socket.IO.

![Demo: choose a dish with extras, check out, then watch the kitchen's chat reply and the status timeline update live](docs/demo.png)

*Recorded against the local backend: the kitchen's replies and status changes arrive over Socket.IO, with no page reloads.*

| Order tracking with live chat | Checkout |
| --- | --- |
| ![Order tracking with live status timeline and chat](docs/screenshots/desktop-order-tracking.png) | ![Checkout form with saved addresses](docs/screenshots/desktop-checkout.png) |

![Home page with Georgian typography](docs/screenshots/desktop-home.png)

| Menu | Mobile: menu | Mobile: tracking | Mobile: chat |
| --- | --- | --- | --- |
| ![Menu with category filter and search](docs/screenshots/desktop-menu.png) | ![Mobile menu](docs/screenshots/mobile-menu.png) | ![Mobile order tracking](docs/screenshots/mobile-order-tracking.png) | ![Mobile chat](docs/screenshots/mobile-chat.png) |

## Features

- **Menu from the API**: categories, dishes and modifiers from `GET /menu/categories`, validated with Zod. Search and category filters live in the URL (`/menu?q=khachapuri&category=pastry-dough`), with loading skeletons, an error state with retry, and empty states.
- **Cart**: dishes with different extras are separate lines, and the cart persists in `localStorage`. At checkout it is re-checked against the live menu, so stale prices update and removed dishes block the order.
- **Auth**: JWT access token on every request. Refresh-token rotation runs through `POST /auth/refresh` with a single in-flight refresh shared by concurrent 401s. A failed refresh logs the user out. Protected routes redirect to sign-in and back.
- **Checkout** (React Hook Form + Zod): saved addresses or a new one (saved on submit), Georgian mobile validation (`555 12 34 56` becomes `+995555123456`), delivery instructions, ASAP or scheduled delivery (30 min to 30 days ahead), and cash on delivery. API validation errors appear next to the matching field, double submits send one order, and the cart is cleared only after the order succeeds.
- **Live order tracking**: a status timeline driven by Socket.IO `order_updated` events. Events patch the TanStack Query cache immediately and then refetch. After a reconnect the client rejoins the room and refetches whatever it missed. A Live / Reconnecting / Offline indicator and an offline banner show connection state.
- **Order chat**: history over REST, live messages over the `/chat` socket, optimistic sending with a failed state and retry, an unread badge, and auto-scroll.
- **Accessibility**: labelled inputs, error messages linked with `aria-describedby`, focus-trapped cart drawer and options dialog, chat focus management, Escape to close, skip link, focus moved to the page on navigation, and live regions.
- **Performance**: route-level code splitting plus long-lived vendor chunks. The app entry chunk is about 45 kB.

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 19, TypeScript, Tailwind CSS 4, Framer Motion, lucide-react |
| Data | TanStack Query 5, Axios, Zod |
| Forms | React Hook Form + Zod resolver |
| Real time | socket.io-client |
| Routing | React Router 7 (lazy routes) |
| Testing | Vitest, React Testing Library, user-event, MSW |
| Tooling | Vite 7, ESLint, GitHub Actions |

## Run locally

Everything runs on your machine. Requirements: **Node.js 22** (see `.nvmrc`), **Docker Desktop**, Git. The commands below are for PowerShell on Windows; they work the same in bash.

### 1. Backend: testify-back (API on :3000)

```powershell
git clone https://github.com/Davitxxdavit/testify-back.git
cd testify-back
Copy-Item .env.example .env
```

Edit `.env`:

- `DATABASE_URL=postgresql://user:password@localhost:5432/cafeteria_burger?schema=public` (matches `docker-compose.yml`)
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: two different random strings of at least 32 characters. You can generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

```powershell
docker compose up -d      # PostgreSQL + Redis
npm install
npm run start:dev         # syncs the schema and seeds the menu + demo accounts on first start
```

The API runs at http://localhost:3000/api/v1, with Swagger at http://localhost:3000/api/docs.

### 2. Frontend: tastify-front (app on :5173)

In a second terminal:

```powershell
git clone https://github.com/Davitxxdavit/tastify-front.git
cd tastify-front
Copy-Item .env.example .env.local   # VITE_API_ORIGIN=http://localhost:3000
npm install
npm run dev
```

Open http://localhost:5173.

### Demo accounts (seeded in development)

| Role | Sign in with | Password | Used for |
| --- | --- | --- | --- |
| Customer | `demo@tastify.ge` | `demo1234` | The web app; has a saved Batumi address |
| Kitchen staff | phone `555000002` | `kitchen123` | `npm run demo:kitchen`, Swagger (`POST /auth/staff/login`) |
| Admin | phone `555000001` | `admin123` | Swagger |

### See live tracking and chat

This web app is the customer side and has no staff UI. To act as the restaurant, place an order, stay on its tracking page, and run this in another terminal:

```powershell
npm run demo:kitchen                                   # latest active order: greet in chat, then Ready -> On the way -> Delivered
npm run demo:kitchen -- --say "Your khinkali are coming!"   # just send a chat message
```

The timeline and chat update live without reloading. You can also change status in Swagger with the kitchen account: `PATCH /orders/{id}/status`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm test` / `npm run test:watch` | Vitest (jsdom, MSW) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` |
| `npm run demo:kitchen` | Play the restaurant side (see above) |

CI runs lint, typecheck, tests and build on every push to `main` and on pull requests.

## Testing

69 tests. The API is mocked at the network level with MSW, using payloads shaped like the real backend responses. Sockets are replaced with a controllable fake.

- **Cart logic**: line merging by modifiers, totals, limits, mapping to `CreateOrderDto`.
- **Checkout**: schema rules, and the page end to end: validation, request body, redirect and cart clearing on success, API field errors, double submit, and stale cart items.
- **Menu**: filtering, URL state, empty and error-with-retry states, the options dialog.
- **Token refresh interceptor**: one refresh for concurrent 401s, rotation, logout on failure.
- **Socket events to UI**: status timeline updates, ignoring other orders, reconnect refetch, chat send, failure and unread states.
- **Keyboard**: focus trap, Escape, focus restore, offline banner.

## Project structure

```text
src/
├── lib/
│   ├── http/          Axios client (envelope unwrap, token refresh), ApiError, Zod response parsing
│   ├── realtime/      shared Socket.IO connections, connection status hooks
│   ├── a11y/          focus trap
│   └── forms.ts       maps API validation errors onto React Hook Form fields
├── features/
│   ├── auth/          session, login/register API, RequireAuth
│   ├── menu/          types, API, query hooks, URL filters, cards, options dialog
│   ├── cart/          pure cart logic + provider
│   ├── checkout/      schema, cart reconciliation, form sections
│   ├── orders/        types, API, hooks, live updates, timeline
│   ├── chat/          chat API, socket hook, widget
│   └── account/       profile and saved addresses
├── components/        layout, cart drawer, shared UI
├── pages/             route components (lazy-loaded)
└── test/              MSW server, fixtures, render helper, fake socket
```

## What's mocked or not implemented

- **Card payments**: the backend's Stripe/Adyen endpoints are placeholders, so checkout shows card as "coming soon" and only sends cash-on-delivery orders.
- **Staff side**: there is no staff UI; `npm run demo:kitchen` or Swagger stand in for the kitchen.
- **Language switcher (GE/RU)** and the **contact form** are visual only.
- **Delivery fee** is shown as free; the backend has no delivery pricing.
