# 🛒 BazarDor — বাজার দর

### বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে!

BazarDor is a modern, responsive web application that helps users explore daily prices of essential products in Bangladesh, browse product categories, and compare market prices.

## 🔗 Live Demo

- **Live Website:** Add your deployed website URL here
- **Local Development:** [http://localhost:3000](http://localhost:3000)

## ✨ Key Features

- **Daily Price Tracking:** View today's product prices and price changes.
- **Category-Based Browsing:** Explore rice, lentils, oil, vegetables, fish, meat, eggs, and other essential products.
- **Product Details:** View current prices, previous price comparisons, and market-wise price information.
- **User Authentication:** Register and sign in using email/password, Google, or GitHub.
- **Responsive UI:** Browse the application on mobile, tablet, and desktop, with loading skeletons and helpful error/empty states.

## 🧰 Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- React Toastify
- BazarDor REST API

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection string
- OAuth credentials for Google and GitHub, if using social login

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/ProgrammingHero1/B14-A7-Bazar-Dor.git
cd B14-A7-Bazar-Dor
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_DB_URL=your_mongodb_connection_string

BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_SECRET=your_google_client_secret

BETTER_AUTH_GITHUB_CLIENT_ID=your_github_client_id
BETTER_AUTH_GITHUB_SECRET=your_github_client_secret

NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

Replace the example values with your actual credentials.

**Important:** Never commit real secrets, database credentials, or OAuth client secrets to GitHub.

#### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📡 API Integration

BazarDor uses the following API for product and category data.

**Base URL:** `https://api.abcz.workers.dev/api/bazardor`

| Endpoint | Purpose |
|---|---|
| `/categories` | Get all categories |
| `/categories/:id` | Get a category |
| `/products` | Get all products |
| `/products/:id` | Get a product by ID |
| `/products?category=:category` | Filter products by category |

## 📱 Responsive Design

The application uses responsive layouts to adapt product grids, navigation, forms, and product details to different screen sizes, including mobile, tablet, and desktop.

## 🔐 Authentication

Authentication is powered by Better Auth and supports:

- Email and password registration
- Email and password sign-in
- Google social login
- GitHub social login
- Sign-out functionality
- User session management

## 📄 Project Information

- **Project Name:** BazarDor — বাজার দর
- **Purpose:** Explore essential product prices and compare market information.
- **Project Type:** Programming Hero Assignment 7

---

*সকল দাম সম্ভাব্য; বাজারের অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।*
