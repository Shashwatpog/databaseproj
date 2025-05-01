"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
    calculateTotal(stored);
  }, []);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(total);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.product_id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    calculateTotal(updatedCart);
  };

  const proceedToCheckout = () => {
    router.push("/customer/checkout");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y border rounded">
            {cart.map((item, idx) => (
              <li key={idx} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{item.product_name}</div>
                  <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                </div>
                <div className="text-right space-y-1">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-600 text-sm underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-right font-semibold text-lg">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right">
            <button
              onClick={proceedToCheckout}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
