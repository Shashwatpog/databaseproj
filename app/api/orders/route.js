import pool from '@/lib/db';

export async function POST(request) {
  const { customerId, cartItems, creditCardId, deliveryType, deliveryPrice, deliveryDate, shipDate } = await request.json();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const deliveryPlanResult = await client.query(
      `INSERT INTO DELIVERY_PLAN (delivery_type, delivery_price, delivery_date, ship_date)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [deliveryType, deliveryPrice, deliveryDate, shipDate]
    );

    const deliveryPlanId = deliveryPlanResult.rows[0].id;

    const orderResult = await client.query(
      `INSERT INTO "ORDER" (issued_date, status, customer_id, credit_card_id, delivery_plan_id)
       VALUES (CURRENT_DATE, 'issued', $1, $2, $3)
       RETURNING id`,
      [customerId, creditCardId, deliveryPlanId]
    );

    const orderId = orderResult.rows[0].id;

    for (const item of cartItems) {
      await client.query(
        `INSERT INTO ORDER_ITEM (quantity, order_id, product_id)
         VALUES ($1, $2, $3)`,
        [item.quantity, orderId, item.product_id]
      );
    }

    await client.query('COMMIT');

    return Response.json({ message: 'Order placed successfully', orderId });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error placing order:', error);
    return new Response('Error placing order', { status: 500 });
  } finally {
    client.release();
  }
}
