-- CUSTOMER table
CREATE TABLE CUSTOMER (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    account_balance NUMERIC(10, 2)
);
-- SUPPLIER table
CREATE TABLE SUPPLIER (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
-- ADDRESS table
CREATE TABLE ADDRESS (
    id SERIAL PRIMARY KEY,
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    zip VARCHAR(20),
    country VARCHAR(50),
    customer_id INTEGER REFERENCES CUSTOMER(id),
    supplier_id INTEGER REFERENCES SUPPLIER(id)
);

-- CREDIT_CARD table
CREATE TABLE CREDIT_CARD (
    id SERIAL PRIMARY KEY,
    card_number VARCHAR(20),
    expiry_date DATE,
    name_on_card VARCHAR(100),
    customer_id INTEGER REFERENCES CUSTOMER(id),
    address_id INTEGER REFERENCES ADDRESS(id)
);

-- STAFF table
CREATE TABLE STAFF (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    address VARCHAR(200),
    salary NUMERIC(10, 2),
    job_title VARCHAR(50)
);

-- PRODUCT table
CREATE TABLE PRODUCT (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50),
    brand VARCHAR(50),
    size VARCHAR(50),
    description TEXT,
    category VARCHAR(50)
);

-- PRODUCT_PRICE table
CREATE TABLE PRODUCT_PRICE (
    id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2),
    valid_from DATE,
    valid_to DATE,
    product_id INTEGER REFERENCES PRODUCT(id)
);

-- DELIVERY_PLAN table
CREATE TABLE DELIVERY_PLAN (
    id SERIAL PRIMARY KEY,
    delivery_type VARCHAR(50),
    delivery_price NUMERIC(10, 2),
    delivery_date DATE,
    ship_date DATE
);

-- WAREHOUSE table
CREATE TABLE WAREHOUSE (
    id SERIAL PRIMARY KEY,
    address VARCHAR(200)
);

-- STOCK table
CREATE TABLE STOCK (
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    product_id INTEGER REFERENCES PRODUCT(id),
    warehouse_id INTEGER REFERENCES WAREHOUSE(id)
);

-- ORDER table
CREATE TABLE "ORDER" (
    id SERIAL PRIMARY KEY,
    issued_date DATE,
    status VARCHAR(50),
    customer_id INTEGER REFERENCES CUSTOMER(id),
    credit_card_id INTEGER REFERENCES CREDIT_CARD(id),
    delivery_plan_id INTEGER REFERENCES DELIVERY_PLAN(id)
);

-- ORDER_ITEM table
CREATE TABLE ORDER_ITEM (
    id SERIAL PRIMARY KEY,
    quantity INTEGER,
    order_id INTEGER REFERENCES "ORDER"(id),
    product_id INTEGER REFERENCES PRODUCT(id)
);


-- SUPPLIER_PRICE table
CREATE TABLE SUPPLIER_PRICE (
    id SERIAL PRIMARY KEY,
    supplier_price NUMERIC(10, 2),
    supplier_id INTEGER REFERENCES SUPPLIER(id),
    product_id INTEGER REFERENCES PRODUCT(id)
);

-- WAREHOUSE_CAPACITY table
CREATE TABLE WAREHOUSE_CAPACITY (
    id SERIAL PRIMARY KEY,
    capacity INTEGER,
    product_id INTEGER REFERENCES PRODUCT(id),
    warehouse_id INTEGER REFERENCES WAREHOUSE(id)
);