import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.type,
        p.brand,
        p.size,
        p.description,
        p.category,
        pp.price
      FROM PRODUCT p
      LEFT JOIN PRODUCT_PRICE pp ON p.id = pp.product_id
    `);
    return Response.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export async function POST(request) {
  const { name, type, brand, size, description, category, price } = await request.json();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const productResult = await client.query(
      `INSERT INTO PRODUCT (name, type, brand, size, description, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, type, brand, size, description, category]
    );

    const productId = productResult.rows[0].id;

    await client.query(
      `INSERT INTO PRODUCT_PRICE (price, valid_from, valid_to, product_id)
       VALUES ($1, CURRENT_DATE, NULL, $2)`,
      [price, productId]
    );

    await client.query('COMMIT');

    return Response.json({ message: 'Product and price created successfully', productId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating product and price:', error);
    return new Response('Error creating product', { status: 500 });
  } finally {
    client.release();
  }
}
