# Luxe Ecommerce

A modern, full-stack e-commerce web application built with Next.js, TypeScript, Prisma, and Tailwind CSS. This project serves as a practical demonstration of building a feature-rich online store, suitable for a university course on web development.

## Phase 2 – Implementation & Integration (24 marks)

This project fulfills the requirements for Phase 2, focusing on implementation and integration.

**Deadline:** _To be announced later_

**Deliverables:**

*   **Backend implementation connected to your database (with at least basic CRUD operations). (7 marks)**
    *   The backend is built using Next.js API routes.
    *   Prisma ORM is used to interact with an SQLite database (development) or any Prisma-compatible database.
    *   Full CRUD (Create, Read, Update, Delete) operations are implemented for:
        *   Products
        *   Categories
        *   Users (Admin management)
        *   Orders
*   **A functional frontend that interacts with the backend. (7 marks)**
    *   The frontend is built with Next.js (React) and TypeScript.
    *   User interfaces are styled with Tailwind CSS.
    *   Key frontend components include:
        *   Product listings and detail pages.
        *   Category navigation.
        *   User registration and login.
        *   Shopping cart and checkout process.
        *   Admin dashboard for managing products, categories, users, and orders.
*   **Full integration demonstrating user interaction with dynamic data. (5 marks)**
    *   The application showcases seamless interaction between the frontend and backend.
    *   Data is dynamically fetched and updated without page reloads in many instances (e.g., cart updates, admin table actions).
*   **You should use XML or/and JSON for data transferring from Server to Client. (2 marks)**
    *   JSON is used as the data transfer format for all API communications between the server and client.
*   **Final README or report with setup instructions and explanation of the architecture. (3 marks)**
    *   This README provides setup instructions and an overview of the architecture.
    *   **Architecture Overview:**
        *   **Framework:** Next.js (handles both frontend rendering and backend API routes).
        *   **Language:** TypeScript (for type safety across the stack).
        *   **Database:** SQLite (default for development), managed by Prisma ORM.
        *   **API Layer:** Next.js API routes (`pages/api`) handle requests from the frontend.
        *   **Authentication:** Bearer token-based authentication for securing API endpoints, with admin-only restrictions for management functionalities. NextAuth.js is integrated for user session management on the client-side.
        *   **Frontend:** React components (pages and components directories) render the UI, using Tailwind CSS for styling.
        *   **State Management:** Combination of React Context API (e.g., for theme) and component-level state.
        *   **Dynamic Interactions:** Client-side fetching and form submissions using `fetch` API, enabling AJAX-like behavior.
*   **Source code (submitted via GitHub or similar).**
    *   The complete source code is available in this repository.
*   **Hosting the app on a public server or cloud platform. (Bonus +2)**
    *   The application is ready to be deployed to platforms like Vercel (recommended for Next.js), Netlify, AWS, or Heroku.
*   **Using real-world data (via scraping, APIs, open datasets, etc.) (Bonus +3)**
    *   The project includes a seeding script (`prisma/seed.ts`) to populate the database with sample data. This can be extended to use real-world datasets or APIs for product information.
*   **Using AJAX for dynamic web based system. (Bonus +2)**
    *   The application extensively uses asynchronous JavaScript requests (akin to AJAX) via the `fetch` API to interact with the backend API for operations like adding to cart, placing orders, and managing data in the admin panel, providing a dynamic user experience without full page reloads.

## Features

*   **User Authentication:** Secure registration and login (client-side session via NextAuth.js, API authorization via Bearer Tokens).
*   **Role-Based Access Control:** Distinct functionalities for regular users and administrators (e.g., admin panel).
*   **Product Management (Admin):** Full CRUD operations for products, including details like name, description, price, and images.
*   **Category Management (Admin):** Full CRUD operations for categories.
*   **User Management (Admin):** View and manage user roles.
*   **Order Management (Admin):** View all orders and update their status.
*   **Product Catalog:** Browse products, view detailed information. Filter by category.
*   **Shopping Cart:** Add, remove, and update product quantities.
*   **Checkout Process:** Secure checkout process to place orders.
*   **Order History:** Users can view their past orders.
*   **Responsive Design:** UI built with Tailwind CSS for adaptability across devices.
*   **Dark/Light Mode:** Theme toggling with persistence in local storage.
*   **Dynamic Updates:** Many actions (cart, admin tables) update dynamically using client-side requests (AJAX-like).

## Technology Stack

[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-blue)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-~5.3.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-~5.12.1-darkblue)](https://www.prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-~4.24.7-purple)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-~3.4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-~18.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![React Icons](https://img.shields.io/badge/React_Icons-~5.0.1-red)](https://react-icons.github.io/react-icons/)
[![SQLite](https://img.shields.io/badge/SQLite-DB-blue)](https://www.sqlite.org/index.html)
[![bcryptjs](https://img.shields.io/badge/bcryptjs-~2.4.3-red)](https://www.npmjs.com/package/bcryptjs)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-~9.0.2-orange)](https://www.npmjs.com/package/jsonwebtoken)

| Category       | Technology                                                 | Version     | Role                                                      |
| :------------- | :--------------------------------------------------------- | :---------- | :-------------------------------------------------------- |
| **Framework**  | [Next.js](https://nextjs.org/)                             | `14.1.0`    | Full-stack React Framework                                |
| **Language**   | [TypeScript](https://www.typescriptlang.org/)              | `~5.3.3`    | Superset of JavaScript                                    |
| **Database**   | [Prisma](https://www.prisma.io/)                           | `~5.12.1`   | ORM / Database Toolkit (Update version from package.json) |
|                | [SQLite](https://www.sqlite.org/index.html)                | -           | Database Engine (Development)                             |
| **Auth**       | [NextAuth.js](https://next-auth.js.org/)                   | `~4.24.7`   | Authentication (Client Session)                           |
|                | [bcryptjs](https://www.npmjs.com/package/bcryptjs)         | `~2.4.3`    | Password Hashing (Update version from package.json)       |
|                | [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | `~9.0.2`    | JWT Handling (API Auth Tokens)                            |
| **Styling**    | [Tailwind CSS](https://tailwindcss.com/)                   | `~3.4.1`    | Utility-First CSS Framework                               |
| **Frontend**   | [React](https://reactjs.org/)                              | `~18.2.0`   | UI Library                                                |
| **Utilities**  | [React Icons](https://react-icons.github.io/react-icons/)  | `~5.0.1`    | Icon Library                                              |
|                | [react-use](https://github.com/streamich/react-use)        | `~17.4.2`   | React Hooks Collection                                    |
|                | [react-intersection-observer](https://github.com/thebuilder/react-intersection-observer) | `~9.5.3` | Intersection Observer Hook                          |

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 18 or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd luxe-ecommerce
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Update the `.env` file with your specific configuration. Key variables likely include:
        *   `DATABASE_URL`: Already set for SQLite (`file:./dev.db`). Change if using a different DB.
        *   `NEXTAUTH_URL`: Your application's base URL (e.g., `http://localhost:3000` for development). This is crucial for NextAuth.js callbacks.
        *   `NEXTAUTH_SECRET`: A secret key for NextAuth.js to sign cookies and tokens. Generate one using `openssl rand -base64 32` or a similar tool.
        *   `JWT_SECRET`: A secret key for signing Bearer tokens used for API authentication. Generate a strong, unique key.
        *   *(Add any other required variables like API keys if applicable)*

4.  **Set up the database:**
    *   Apply Prisma migrations to create the database schema:
        ```bash
        npx prisma migrate dev --name init
        ```
    *   (Optional) Seed the database with initial data. The seed script creates a default admin user and sample products/categories.
        ```bash
        npx prisma db seed
        ```
        *(Note: The seed script is configured in `package.json` and executed by `prisma/seed.ts`)*

### Default Admin Credentials

After seeding the database, you can log in with the default admin credentials:
*   **Email:** `admin@example.com`
*   **Password:** `adminpassword`

### Running the Application

1.  **Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

2.  **Production Build:**
    ```bash
    npm run build
    ```

3.  **Start Production Server:**
    ```bash
    npm run start
    ```

## Available Scripts

*   `dev`: Starts the development server.
*   `build`: Creates a production build.
*   `start`: Starts the production server.
*   `lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `seed`: Seeds the database using the `prisma/seed.ts` script (requires `ts-node`).

## Project Structure Overview

*   `pages/`: Next.js pages and API routes.
    *   `pages/api/`: Backend API endpoints.
    *   `pages/admin/`: Frontend pages for the admin dashboard.
*   `components/`: Reusable React components.
    *   `components/layout/`: Layout components like Navbar and Footer.
*   `prisma/`: Prisma schema (`schema.prisma`), migrations, and seed script (`seed.ts`).
*   `lib/`: Utility functions, helper modules (e.g., `authMiddleware.ts`).
*   `context/`: React Context API providers (e.g., `ThemeContext.tsx`).
*   `public/`: Static assets like images.
*   `styles/`: Global CSS files.
*   `types/`: TypeScript type definitions.

## Further Development / TODOs

*   Implement comprehensive search functionality for products.
*   Add pagination to admin tables and product listings.
*   Enhance order management features (e.g., detailed order view for users).
*   Implement password reset functionality.
*   Write more unit and integration tests.
*   Refine UI/UX based on user feedback.
