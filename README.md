# Online Store application using NextJS and PostgreSQL 

This is a full-stack online store built using the latest Next.js App Router, PostgreSQL (via pgAdmin), and custom RESTful APIs. It supports customer and staff roles, product management, cart/checkout flows, stock control, warehouse logic, and more.

## To Run this follow the steps:

### 1. Clone the repository
```bash
git clone [your-repo-url]
cd [your-project-folder]
```
### 2. Install the Dependencies
```bash
npm install
```
### 3. Set up the database

- Open pgAdmin or use psql CLI.

- Run the SQL files:

    - createTable.sql — creates all tables (PRODUCT, STOCK, ORDER, etc.)

    - createIndex.sql — optional: adds indexes to improve search

- Seed data manually such as product info, staff data and login, warehouse info, etc.


### 4. Add environment variables

Create a file called `.env.local` in the root directory:

``` bash
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_database_name
```

Replace this with your actual PostgreSQL credentials

### 5. Run the application
``` bash
npm run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

## Roles & Features

### Customer
- Register, login, and manage credit cards and addresses
- Browse and search products using product name, category, type, description
- Filter by category, brand, or type
- Add/remove items from cart
- Checkout using saved credit cards and addresses
- See total cost including express delivery
- Order stock only if available

### Staff
- Login as admin
- Add, update, delete products & prices
- Add stock to warehouses with capacity validation
- View product quantity across all warehouses



## 🛠 Technologies Used

- Next.js (App Router)
- PostgreSQL via pgAdmin
- TailwindCSS
- Custom REST APIs (under `/app/api`)
- Auth split between customer & staff roles
- Bcrypt to hash customer and staff passwords

---

## ✅ Status

All core features are implemented:
- [x] Role-based access
- [x] Product search/filter/sort
- [x] Checkout logic with validation
- [x] Warehouse stock & capacity checks
- [x] Admin/staff dashboard
