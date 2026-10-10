# Bazar Dor — বাজার দর

A Bengali-language market price tracking web application for exploring everyday product prices, browsing categories, and checking products with rising or falling prices.

## 🔗 Live Demo

- **Live Website:** Add your deployed website URL here
- **Local Development:** [http://localhost:3000](http://localhost:3000)

## ✨ Features

- Browse products and current prices
- Explore product categories
- View product details
- Identify products with rising or falling prices
- Bengali product names and price information
- Email and password authentication
- Google and GitHub sign-in
- Profile and sign-out functionality
- Responsive interface

## 🛠️ Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Better Auth
- MongoDB
- React Toastify

## 📡 API

**Base URL:** `https://api.abcz.workers.dev/api/bazardor`

| Endpoint | Description |
|---|---|
| `/categories` | Get all categories |
| `/products` | Get all products |
| `/products/1` | Get a product by ID |
| `/products?category=chal` | Filter products by category |

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd bazar-dor


📁 Project Structure

src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts
│   ├── auth/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── product/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── components/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── assets/
├── lib/
│   ├── auth-client.ts
│   └── auth.ts
└── types/
    └── index.ts


    ## 🔐 Security

- Keep `.env` out of version control.
- Never publish database passwords, OAuth secrets, or authentication secrets.
- Configure OAuth callback URLs for the correct local or deployed domain.

## 📄 License

No license has been specified yet.