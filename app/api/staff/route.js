import pool from '@/lib/db';

export async function PUT(request) {
  const { id, name, price } = await request.json();
  try {
    const result = await pool.query(
      `UPDATE product SET product_name = $1, price = $2 WHERE product_id = $3 RETURNING *`,
      [name, price, id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return new Response('Product update failed', { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    await pool.query(`DELETE FROM product WHERE product_id = $1`, [id]);
    return new Response('Product deleted', { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Product delete failed', { status: 500 });
  }
}
