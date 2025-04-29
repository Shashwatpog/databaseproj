import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { email, password } = await request.json();

  const result = await pool.query(`SELECT id, password FROM STAFF WHERE email = $1`, [email]);
  if (result.rowCount === 0) return new Response('Invalid login', { status: 401 });
  const valid = await bcrypt.compare(password, result.rows[0].password);
  if (!valid) return new Response('Invalid login', { status: 401 });

  return Response.json({ success: true, staffId: result.rows[0].id });
}
