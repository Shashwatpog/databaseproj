import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, address FROM WAREHOUSE
    `);
    return Response.json(result.rows);
  } catch (err) {
    console.error("GET /api/warehouses error:", err);
    return new Response("Error fetching warehouses", { status: 500 });
  }
}
