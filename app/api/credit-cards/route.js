import pool from '@/lib/db';

export async function POST(request) {
  const { card_number, expiry_date, name_on_card, customer_id, address_id } = await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO CREDIT_CARD (card_number, expiry_date, name_on_card, customer_id, address_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [card_number, expiry_date, name_on_card, customer_id, address_id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating credit card:', error);
    return new Response('Error creating credit card', { status: 500 });
  }
}
