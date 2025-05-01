import pool from '@/lib/db';

export async function POST(request) {
  const { street, city, state, zip, country, customer_id } = await request.json();

  try {
    const result = await pool.query(
      `INSERT INTO ADDRESS (street, city, state, zip, country, customer_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [street, city, state, zip, country, customer_id]
    );
    return Response.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding address:', error);
    return new Response('Error adding address', { status: 500 });
  }
}

export async function PUT(request) {
  const { id, street, city, state, zip, country } = await request.json();

  try {
    await pool.query(
      `UPDATE ADDRESS
       SET street=$1, city=$2, state=$3, zip=$4, country=$5
       WHERE id=$6`,
      [street, city, state, zip, country, id]
    );
    return new Response('Address updated', { status: 200 });
  } catch (error) {
    console.error('Error updating address:', error);
    return new Response('Error updating address', { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    await pool.query(`DELETE FROM ADDRESS WHERE id = $1`, [id]);
    return new Response('Address deleted', { status: 200 });
  } catch (error) {
    console.error('Error deleting address:', error);
    return new Response('Error deleting address', { status: 500 });
  }
}
