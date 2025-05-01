import pool from "@/lib/db";

export async function POST(request) {
  const client = await pool.connect();

  try {
    const { customer_id, credit_card_id, delivery_type, cart } = await request.json();

    if (!cart || cart.length === 0) {
      return new Response("Cart is empty.", { status: 400 });
    }

    // ✅ Check availability BEFORE transaction
    for (const item of cart) {
      const { product_id, quantity } = item;

      const stockCheck = await pool.query(
        `SELECT 
           p.name AS product_name,
           COALESCE(SUM(s.quantity), 0) AS total
         FROM PRODUCT p
         LEFT JOIN STOCK s ON p.id = s.product_id
         WHERE p.id = $1
         GROUP BY p.name`,
        [product_id]
      );
      
      const availableQty = parseInt(stockCheck.rows[0]?.total || 0);
      const productName = stockCheck.rows[0]?.product_name || "Unknown Product";
      
      if (availableQty < quantity) {
        return new Response(
          `Not enough stock for "${productName}". Only ${availableQty} units available.`,
          { status: 400 }
        );
      }
    }

    await client.query("BEGIN");

    // 1. Insert delivery plan
    const delivery_price = delivery_type === "express" ? 15 : 0;
    const deliveryRes = await client.query(
      `INSERT INTO DELIVERY_PLAN (delivery_type, delivery_price, delivery_date, ship_date)
       VALUES ($1, $2, CURRENT_DATE + INTERVAL '5 days', CURRENT_DATE + INTERVAL '2 days')
       RETURNING id`,
      [delivery_type, delivery_price]
    );
    const delivery_plan_id = deliveryRes.rows[0].id;

    // 2. Insert order
    const orderRes = await client.query(
      `INSERT INTO "ORDER" (issued_date, status, customer_id, credit_card_id, delivery_plan_id)
       VALUES (CURRENT_DATE, 'issued', $1, $2, $3)
       RETURNING id`,
      [customer_id, credit_card_id, delivery_plan_id]
    );
    const order_id = orderRes.rows[0].id;

    let total_cost = 0;

    for (const item of cart) {
      const { product_id, quantity, price } = item;
      const itemCost = parseFloat(price) * quantity;
      total_cost += itemCost;

      // Insert into ORDER_ITEM
      await client.query(
        `INSERT INTO ORDER_ITEM (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [order_id, product_id, quantity]
      );

      // Deduct from warehouse with most stock
      const stockRes = await client.query(
        `SELECT id, quantity
         FROM STOCK
         WHERE product_id = $1 AND quantity >= $2
         ORDER BY quantity DESC
         LIMIT 1`,
        [product_id, quantity]
      );

      if (stockRes.rows.length === 0) {
        throw new Error(`Unexpected: stock unavailable for product ID ${product_id}`);
      }

      const stockId = stockRes.rows[0].id;

      await client.query(
        `UPDATE STOCK SET quantity = quantity - $1 WHERE id = $2`,
        [quantity, stockId]
      );
    }

    // Update customer balance
    await client.query(
      `UPDATE CUSTOMER SET account_balance = account_balance + $1 WHERE id = $2`,
      [total_cost + delivery_price, customer_id]
    );

    await client.query("COMMIT");
    return Response.json({ message: "Order placed successfully." });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order error:", error);
    return new Response("Error placing order: " + error.message, { status: 500 });
  } finally {
    client.release();
  }
}
