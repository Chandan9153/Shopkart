# ShopKart — Full-Stack E-Commerce Project

A complete e-commerce app for your resume: Spring Boot + React + MySQL + JWT login,
with products, cart, Cash on Delivery orders, order tracking, and an admin dashboard.

**What it does**
- Shop: product list, search, category filter
- Accounts: register, login, logout (JWT token, lasts 24 hours)
- Cart: add items, change quantity, server-calculated totals
- Orders: checkout with Cash on Delivery, status Placed → Confirmed → Shipped → Delivered, My Orders page
- Admin: add/edit/delete products, move orders forward one step at a time, cancel orders (stock comes back), dashboard totals, customer list

**Stack:** Java 17, Spring Boot 3.3.5, Spring Security + JWT, MySQL 8, React (Vite)

---

## Before you start — install these

Check each one in a terminal (in VS Code: **Terminal → New Terminal**):

```bash
java -version   # must say 17 or higher
node -v         # must say 18 or higher
npm -v
git --version
mysql --version # MySQL 8
```

## Step 1 — Create the database

Open MySQL (terminal or MySQL Workbench) and run:

```sql
CREATE DATABASE shopkart;
```

## Step 2 — Put YOUR MySQL password in the backend settings

Open `backend/src/main/resources/application.properties`.

It has placeholders, not real secrets. For running on your own laptop, change
only the local fallback values — for example:

```properties
spring.datasource.password=${DB_PASSWORD:your_mysql_password}
```

Replace `your_mysql_password` (after the colon) with your own MySQL password.
Do the same for `jwt.secret` — replace the placeholder with your own long
random text, at least 32 characters, used nowhere else.

**Never commit a real password or secret to GitHub.** When you deploy later,
these values come from the hosting site's environment variables instead
(see `shopkart-run-deploy-guide.md` in the original files).

## Step 3 — Start the backend (terminal 1)

```bash
cd backend
mvn spring-boot:run
```

(If you have the Maven wrapper files, use `./mvnw spring-boot:run` on
Mac/Linux or `mvnw.cmd spring-boot:run` on Windows instead.)

Leave this terminal running. It is ready when you see:

```text
Started ShopKartApplication
Tomcat started on port 8080
```

Hibernate creates the tables automatically (`products`, `users`, `cart_items`,
`orders`, `order_items`) and `data.sql` loads 3 sample products.

Quick check in a second terminal:

```bash
curl http://localhost:8080/api/products
```

You should see the products as JSON.

## Step 4 — Start the frontend (terminal 2)

Open a second terminal (click **+** in the VS Code terminal panel). Do not stop the backend.

```bash
cd frontend
npm install
npm run dev
```

`npm install` is only needed the first time. Open the address Vite prints,
normally **http://localhost:5173**.

`frontend/.env` already says `VITE_API_BASE_URL=http://localhost:8080/api`.
Restart `npm run dev` after changing `.env` — Vite reads it only at start-up.

## Step 5 — Make yourself an admin

There is **no admin password in the code**, by design. You make an admin by
promoting a normal account:

1. In the running app, click **Register** and create an account with your own email and password.
2. In MySQL, run this one command with that same email:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-own-email@example.com';
```

3. Log out of the app and log in again. The Admin link appears in the navbar.

## Test it

- Search a product, filter by category
- Register, log out, log back in
- Add to cart, change quantity, checkout with Cash on Delivery — order shows as `PLACED` in My Orders, cart is empty
- As admin: add a product (it appears in the shop), move an order `PLACED → CONFIRMED → SHIPPED → DELIVERED` one step at a time
- Admin check: `GET /api/admin/dashboard` gives `401` with no token, `403` with a normal customer token, `200` with an admin token

## Project layout

```text
shopkart/
├── README.md
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── resources/application.properties
│       ├── resources/data.sql
│       └── java/com/shopkart/   (ShopKartApplication, controller, service,
│                                  repository, model, dto, security)
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env
    ├── vercel.json
    └── src/                     (App.jsx, main.jsx, pages, components,
                                  services, context)
```

## Files that were added for you

`frontend/package.json`, `frontend/vite.config.js` and `frontend/index.html`
are standard Vite scaffold files — the original code files said they are
"created by the Vite template", so they were not in the source documents.
`backend/Dockerfile`, `backend/.dockerignore`, `frontend/vercel.json` and
`.gitignore` come from the run/deploy guide, for deployment later.

## Deploying it live

Follow the steps in the original `shopkart-run-deploy-guide.md`:
GitHub → free MySQL (Aiven/Railway) → backend on Render → frontend on Vercel.
The code is already set up for it: database, JWT secret and frontend address
are read from environment variables in `application.properties`, with local
fallbacks after the colon.
