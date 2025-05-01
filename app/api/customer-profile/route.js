import pool from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('id');

  try {
    const customerRes = await pool.query(`SELECT id, name, email, account_balance FROM CUSTOMER WHERE id = $1`, [customerId]);
    const addressRes = await pool.query(`SELECT * FROM ADDRESS WHERE customer_id = $1`, [customerId]);
    const cardRes = await pool.query(`SELECT * FROM CREDIT_CARD WHERE customer_id = $1`, [customerId]);

    return Response.json({
      customer: customerRes.rows[0],
      addresses: addressRes.rows,
      cards: cardRes.rows
    });
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    return new Response('Failed to load profile', { status: 500 });
  }
}
