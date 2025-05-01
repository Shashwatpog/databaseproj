import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const brand = searchParams.get("brand") || "";
  const category = searchParams.get("category") || "";

  try {
    const result = await pool.query(
      `
      SELECT 
        p.*, 
        pp.price
      FROM PRODUCT p
      LEFT JOIN LATERAL (
        SELECT price 
        FROM PRODUCT_PRICE 
        WHERE product_id = p.id 
        ORDER BY valid_from DESC 
        LIMIT 1
      ) pp ON true
      WHERE
        ($1 = '' OR (
          p.name ILIKE '%' || $1 || '%' OR
          p.description ILIKE '%' || $1 || '%' OR
          p.type ILIKE '%' || $1 || '%' OR
          p.brand ILIKE '%' || $1 || '%' OR
          p.category ILIKE '%' || $1 || '%'
        )) AND
        ($2 = '' OR p.type = $2) AND
        ($3 = '' OR p.brand = $3) AND
        ($4 = '' OR p.category = $4)
      `,
      [search, type, brand, category]
    );

    return Response.json(result.rows);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return new Response("Error fetching products", { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, type, brand, size, description, category, price } = await request.json();

    const productResult = await pool.query(
      `INSERT INTO PRODUCT (name, type, brand, size, description, category)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, type, brand, size, description, category]
    );

    const productId = productResult.rows[0].id;

    await pool.query(
      `INSERT INTO PRODUCT_PRICE (price, valid_from, product_id)
       VALUES ($1, CURRENT_DATE, $2)`,
      [price, productId]
    );

    return Response.json({ message: "Product created" });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return new Response("Error creating product", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, name, type, brand, size, description, category, price } = await request.json();

    // 1. Update product info
    await pool.query(
      `UPDATE PRODUCT
       SET name = $1, type = $2, brand = $3, size = $4, description = $5, category = $6
       WHERE id = $7`,
      [name, type, brand, size, description, category, id]
    );

    // 2. Check last price
    const existingPrice = await pool.query(
      `SELECT price FROM PRODUCT_PRICE WHERE product_id = $1 ORDER BY valid_from DESC LIMIT 1`,
      [id]
    );

    const lastPrice = existingPrice.rows[0]?.price;
    const newPrice = parseFloat(price);

    if (!lastPrice || parseFloat(lastPrice) !== newPrice) {
      await pool.query(
        `INSERT INTO PRODUCT_PRICE (price, valid_from, product_id)
         VALUES ($1, CURRENT_DATE, $2)`,
        [newPrice, id]
      );
    }

    return Response.json({ message: "Product updated" });
  } catch (error) {
    console.error("PUT /api/products error:", error);
    return new Response("Error updating product", { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return new Response("Missing ID", { status: 400 });

  try {
    await pool.query(`DELETE FROM PRODUCT WHERE id = $1`, [id]);
    return Response.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return new Response("Error deleting product", { status: 500 });
  }
}
