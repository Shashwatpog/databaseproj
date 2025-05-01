import pool from '@/lib/db';

export async function POST(request) {
  const { card_number, expiry_date, name_on_card, customer_id, address_id } = await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO CREDIT_CARD (card_number, expiry_date, name_on_card, customer_id, address_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [card_number, expiry_date, name_on_card, customer_id, address_id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating credit card:', error);
    return new Response('Error creating credit card', { status: 500 });
  }
}

export async function PUT(request) {
  const { id, card_number, expiry_date, name_on_card } = await request.json();

  try {
    await pool.query(
      `UPDATE CREDIT_CARD
       SET card_number=$1, expiry_date=$2, name_on_card=$3
       WHERE id=$4`,
      [card_number, expiry_date, name_on_card, id]
    );
    return new Response('Card updated', { status: 200 });
  } catch (error) {
    console.error('Error updating credit card:', error);
    return new Response('Error updating credit card', { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await pool.query(`DELETE FROM CREDIT_CARD WHERE id = $1`, [id]);
    return new Response('Card deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting credit card:', error);
    return new Response('Error deleting credit card', { status: 500 });
  }
}
