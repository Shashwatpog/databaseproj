-- CUSTOMER
CREATE INDEX idx_customer_name ON customer(name);
CREATE INDEX idx_customer_account_balance ON customer(account_balance);

-- SUPPLIER
CREATE INDEX idx_supplier_name ON supplier(name);

-- ADDRESS
CREATE INDEX idx_address_customer_id ON address(customer_id);
CREATE INDEX idx_address_supplier_id ON address(supplier_id);
CREATE INDEX idx_address_location ON address(city, state, zip);  

-- CREDIT_CARD
CREATE INDEX idx_credit_card_customer_id ON credit_card(customer_id);
CREATE INDEX idx_credit_card_address_id ON credit_card(address_id);

-- STAFF
CREATE INDEX idx_staff_job_title ON staff(job_title);

-- PRODUCT
CREATE INDEX idx_product_name ON product(name);
CREATE INDEX idx_product_type ON product(type);
CREATE INDEX idx_product_brand ON product(brand);
CREATE INDEX idx_product_category ON product(category);

-- PRODUCT_PRICE
CREATE INDEX idx_product_price_product_id ON product_price(product_id);
CREATE INDEX idx_product_price_validity ON product_price(valid_from, valid_to);

-- DELIVERY_PLAN
CREATE INDEX idx_delivery_plan_dates ON delivery_plan(delivery_date, ship_date);

-- WAREHOUSE
CREATE INDEX idx_warehouse_address ON warehouse(address);

-- STOCK
CREATE INDEX idx_stock_product_id ON stock(product_id);
CREATE INDEX idx_stock_warehouse_id ON stock(warehouse_id);
CREATE INDEX idx_stock_product_warehouse ON stock(product_id, warehouse_id); -- Composite for stock lookup

-- ORDER
CREATE INDEX idx_order_customer_id ON "ORDER"(customer_id);
CREATE INDEX idx_order_credit_card_id ON "ORDER"(credit_card_id);
CREATE INDEX idx_order_delivery_plan_id ON "ORDER"(delivery_plan_id);
CREATE INDEX idx_order_status ON "ORDER"(status);

-- ORDER_ITEM
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
CREATE INDEX idx_order_item_product_id ON order_item(product_id);

-- SUPPLIER_PRICE
CREATE INDEX idx_supplier_price_supplier_id ON supplier_price(supplier_id);
CREATE INDEX idx_supplier_price_product_id ON supplier_price(product_id);

-- WAREHOUSE_CAPACITY
CREATE INDEX idx_warehouse_capacity_warehouse_id ON warehouse_capacity(warehouse_id);
CREATE INDEX idx_warehouse_capacity_product_id ON warehouse_capacity(product_id);
CREATE INDEX idx_warehouse_capacity_combo ON warehouse_capacity(product_id, warehouse_id); 
