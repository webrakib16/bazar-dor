Bazar Dor — বাজার দর

A Bengali-language market price tracking web application for exploring everyday product prices, browsing categories, and checking which products have rising or falling prices.

Live Demo

- Live Website: "Add deployed website URL here" (#)
- Local Website: http://localhost:3000

Features

- Browse products and current prices
- Explore products by category
- View product details
- Identify products with rising or falling prices
- Bengali-language product and price information
- Email and password authentication
- Google and GitHub sign-in
- Profile and sign-out functionality
- Responsive interface

Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- DaisyUI
- Better Auth
- MongoDB
- React Toastify

API

Product and category data are provided by the Bazar Dor API.

Base URL: "https://api.abcz.workers.dev/api/bazardor"

Endpoint| Purpose
"/categories"| Get categories
"/products"| Get products
"/products/1"| Get a product by ID (example)
"/products?category=chal"| Filter products by category (example)

Run Locally

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd bazar-dor

2. Install Dependencies

npm install

3. Configure Environment Variables

Create a ".env" file in the project root, in the same folder as "package.json".

BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

BETTER_AUTH_DB_URL=your_mongodb_connection_string

BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_SECRET=your_google_client_secret

BETTER_AUTH_GITHUB_CLIENT_ID=your_github_client_id
BETTER_AUTH_GITHUB_SECRET=your_github_client_secret

Replace the example values with your own credentials. Never upload ".env" or private secrets to GitHub.

4. Start the Development Server

npm run dev

Open "http://localhost:3000" (http://localhost:3000) in your browser.

Production Build

npm run build
npm run start

Project Structure

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

License

No license has been specified yet.