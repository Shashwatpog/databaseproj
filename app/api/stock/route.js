import pool from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get("detailed");

    if (detailed === "true") {
      // Return stock broken down by product and warehouse
      const result = await pool.query(`
        SELECT 
          s.id,
          s.product_id,
          s.warehouse_id,
          s.quantity,
          p.name AS product_name,
          w.address AS warehouse_address
        FROM STOCK s
        JOIN PRODUCT p ON s.product_id = p.id
        JOIN WAREHOUSE w ON s.warehouse_id = w.id
      `);
      return Response.json(result.rows);
    } else {
      // Return total quantity per product
      const result = await pool.query(`
        SELECT 
          product_id,
          SUM(quantity) AS total_quantity
        FROM STOCK
        GROUP BY product_id
      `);
      return Response.json(result.rows);
    }
  } catch (err) {
    console.error("GET /api/stock error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { product_id, warehouse_id, quantity } = await request.json();
    const qty = parseInt(quantity);

    // Check existing stock for this product+warehouse
    const currentRes = await pool.query(
      `SELECT SUM(quantity) AS total FROM STOCK WHERE product_id = $1 AND warehouse_id = $2`,
      [product_id, warehouse_id]
    );
    const currentTotal = parseInt(currentRes.rows[0]?.total || 0);
    const newTotal = currentTotal + qty;

    // Check warehouse capacity
    const capacityRes = await pool.query(
      `SELECT capacity FROM WAREHOUSE_CAPACITY WHERE product_id = $1 AND warehouse_id = $2`,
      [product_id, warehouse_id]
    );
    const capacity = parseInt(capacityRes.rows[0]?.capacity || 0);

    if (newTotal > capacity) {
      return new Response("Adding this quantity exceeds warehouse capacity.", { status: 400 });
    }

    // Check if a stock row already exists
    const existing = await pool.query(
      `SELECT id FROM STOCK WHERE product_id = $1 AND warehouse_id = $2`,
      [product_id, warehouse_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE STOCK SET quantity = quantity + $1 WHERE id = $2`,
        [qty, existing.rows[0].id]
      );
    } else {
      await pool.query(
        `INSERT INTO STOCK (product_id, warehouse_id, quantity) VALUES ($1, $2, $3)`,
        [product_id, warehouse_id, qty]
      );
    }

    return Response.json({ message: "Stock updated." });
  } catch (err) {
    console.error("POST /api/stock error:", err);
    return new Response("Error adding stock", { status: 500 });
  }
}
