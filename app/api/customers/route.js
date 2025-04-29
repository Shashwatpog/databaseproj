import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('customerId');

  try {
    const result = await pool.query(
      `SELECT id, name, account_balance FROM CUSTOMER WHERE id = $1`,
      [customerId]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return new Response('Error fetching customer', { status: 500 });
  }
}

export async function POST(request) {
  const { name } = await request.json();
  try {
    const result = await pool.query(
      `INSERT INTO CUSTOMER (name, account_balance) VALUES ($1, 0.00) RETURNING *`,
      [name]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return new Response('Error creating customer', { status: 500 });
  }
}
