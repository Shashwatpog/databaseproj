"use client";
import { useState, useEffect } from 'react';

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const handleRemove = (id) => {
    const updated = cart.filter(item => item.product_id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.product_id} className="border p-4 mb-4">
          <h2>{item.product_name}</h2>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => handleRemove(item.product_id)} className="text-red-600">Remove</button>
        </div>
      ))}
      <h2>Total: ${total.toFixed(2)}</h2>
      <a href="/customer/checkout" className="block mt-4 bg-blue-600 text-white p-2 rounded">Checkout</a>
    </div>
  );
}
