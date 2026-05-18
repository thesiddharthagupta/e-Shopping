# Luxe E-Commerce Monorepo (`e-Shopping`)

A premium, state-of-the-art responsive e-commerce monorepo containing a customer-facing storefront and a secure merchant controller, unified by a shared relational database. Built using **Next.js 15+ (App Router)**, **Prisma ORM**, **Tailwind CSS**, and **Lucide Icons**.

---

## 🏗️ Monorepo Architecture

This project is organized as a clean monorepo:
1. **`storefront` (Port 3000):** The main customer-facing catalog. Features fluid global state cart drawers, advanced search matching, item categorization, and multi-step simulated card checkouts.
2. **`admin` (Port 3001):** The merchant controller panel. Features administrative cookie auth, dynamic analytics counters, full product CRUD management, and a live invoice status adjuster.
3. **`prisma` (Shared):** Relational database configuration and schemas. Both applications connect to the exact same local SQLite database singleton (`prisma/dev.db`).

---

## 💾 Database Schema & Seed Data

The relational model (`prisma/schema.prisma`) comprises five main structures:
- **`User`**: Merchant accounts tagged by roles (e.g. `ADMIN` or `USER`).
- **`Category`**: Parent categories (Men, Women, Accessories) holding specific slug definitions.
- **`Product`**: Store items with descriptions, ratings, stock toggles, and JSON-serialized sizes/colors arrays.
- **`Order`**: Client checkout invoices containing totals, taxes, shipping locations, and statuses.
- **`OrderItem`**: Specific line-items linked directly to parent products and orders.

### Administrative Credentials
The default administrator account created during seeding:
- **Email:** `admin@luxe.com`
- **Password:** `adminpassword123`
- **Security Role:** `ADMIN`

---

## 🚀 Local Setup & Launch Guide

Follow these steps to run the monorepo locally on your laptop:

### 1. Install Dependencies
Run from the monorepo root:
```bash
npm install
```

### 2. Database Migration & Seeding
Prepare and populate your local SQLite database:
```bash
# Generate Prisma Client & sync schema
npx prisma db push

# Seed categories, default admin, and initial catalog products
node prisma/seed.js
```

### 3. Launch Development Servers
Launch both workspaces in parallel:
```bash
# Launch both servers (Storefront on 3000, Admin on 3001)
npm run dev
```

---

## 🧪 E-2-E Sync Test Workflow

To verify complete end-to-end relational database synchronization:
1. Visit the storefront at **`http://localhost:3000`** and add the *Premium White T-Shirt* to your cart.
2. Complete the checkout payment simulator (submitting mock card details).
3. Open the Admin Panel at **`http://localhost:3001`** and sign in using the administrator credentials.
4. Verify that your new order immediately propagates inside the dashboard's **Recent Orders** table and shifts total financial counters!
5. Open the order in the **Orders** section to transition its status from `PROCESSING` to `SHIPPED` inside the database.
