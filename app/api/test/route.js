import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT 1');
    return Response.json({ success: true, result: result.rows });
  } catch (error) {
    console.error('Database connection failed:', error);
    return new Response('Database error', { status: 500 });
  }
}
