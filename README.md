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


## ER Model Used:
![er-model](https://github.com/user-attachments/assets/f06868bb-59d2-49a5-942c-e06bf043ff1a)

ER Model design using [Mermaid](https://mermaid.js.org/) refer to : [mermaid code](https://www.mermaidchart.com/play#pako:eNqdVduOmzAQ_RWU9_xA3hCwKmq2QUBaVYpkObY3mRWxXdtsm03y7zWBJVws0C4v4Jkz9syZ4-GyIIKyxWrBVAj4oPBpxz37BNss3zxHqXe9Lpfi4vlhmEZZ5q28I9ZuSJBGYZyjwE_DKdgmDe1i5ckCEzbEXOp19QA3HtDHWhsF_OBxfGIP40shsPEwIaLkBu1xgTlp3Lcdrz8-Up_f274YMyMzAXN2YLFhI-s7yHF4lZs6D7LqsnUTy-X12uEYay0I2AMo-gvmOI6Yr4VgRREvT3umRj72T4I6I-qqoOIXCY6q-EHKWe4_PX26RY0RU6qY1sPWadsyNWb3VeyRAVMMe5mkm3Ab5B9aapYoSeMg6opugLPqCr5bvzZCWU7BvdtdmSjOo2cLBU6KkjrAX6zfnOXYuFeYO2QI72MoZZookAYEd_TasIMYSazPzkTedSukAtI5t1KH94YLoOhFiZPTYcTgyF9-Gn3bbLNoyDwR3GDgegibZ7MnnI4Wq30noqv1nxJz017eNraeQK6m97N84Ozl7E83iaF7NXvIMFrHP6P0N0rW_o-uKGvURM53ZkHr0srOeTmroVNqVzl1BV_jo5_wfEcoK-CN2QHS13StotbpklPr7Fd39-kjyI790eltkqzjyT9RC_nM3bz1Y2cJbOZVKWUBTHXLa3ba8cXtPziQJk4)

Or 

[View the ER code markdown file](er-model.md)


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
