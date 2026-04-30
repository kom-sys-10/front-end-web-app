# Bamazone — Drone Delivery Web App

Frontend for the TTM4115 drone delivery project. A React web application where users can browse products, add them to a cart, and place orders for autonomous drone delivery.

## Project structure

```
src/
├── pages/            # Full-page views (login, shopping, orders, payment, status)
├── componments/      # Reusable UI components (header, inputs, route guards)
├── models/           # Data classes and the cart context (User, Product, Order, Cart)
├── styling/          # CSS files, organized by page and component
├── App.tsx           # Route definitions
├── Layout.tsx        # Shell that renders the header above every page
└── config.ts         # API base URL
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

## Installation

```bash
npm install
```

## Running the app

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Other commands

| Command | Description |
|---|---|
| `npm run build` | Type-check and build for production (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Backend

The app connects to a REST API defined in [src/config.ts](src/config.ts). Update `API_URL` there if the backend address changes.
