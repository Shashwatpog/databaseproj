import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { type, email, password, name } = await request.json();

  if (type === 'register') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO CUSTOMER (name, email, password, account_balance)
       VALUES ($1, $2, $3, 0.00)
       RETURNING id, email`,
      [name, email, hashedPassword]
    );
    return Response.json({ success: true, customer: result.rows[0] });
  }

  if (type === 'login') {
    const result = await pool.query(
      `SELECT id, password FROM CUSTOMER WHERE email = $1`,
      [email]
    );
    if (result.rowCount === 0) return new Response('Invalid login', { status: 401 });
    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) return new Response('Invalid login', { status: 401 });
    return Response.json({ success: true, customerId: result.rows[0].id });
  }

  return new Response('Bad request', { status: 400 });
}
