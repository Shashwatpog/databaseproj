import pool from '@/lib/db';

export async function POST(request) {
  const { street, city, state, zip, country, customer_id } = await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO ADDRESS (street, city, state, zip, country, customer_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [street, city, state, zip, country, customer_id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating address:', error);
    return new Response('Error creating address', { status: 500 });
  }
}
