"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryType, setDeliveryType] = useState("standard");

  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);

    const subtotal = stored.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = deliveryType === "express" ? 9.99 : 0;
    setTotal(subtotal + deliveryFee);

    const customerId = localStorage.getItem("customerId");
    if (customerId) {
      fetch(`/api/customer-profile?id=${customerId}`)
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data.addresses || []);
          setCards(data.cards || []);
        });
    }
  }, [deliveryType]);

  const handleCheckout = async () => {
    const customerId = localStorage.getItem("customerId");

    if (!customerId) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedAddressId || !selectedCardId) {
      alert("Please select both an address and a credit card.");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: customerId,
        credit_card_id: selectedCardId,
        delivery_type: deliveryType,
        cart,
      }),
    });

    if (res.ok) {
      alert("Order placed!");
      localStorage.removeItem("cart");
      window.location.href = "/customer";
    } else {
      const text = await res.text();
      alert(text);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div>
        <h2 className="font-semibold">Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y border rounded mb-4">
              {cart.map((item, idx) => (
                <li key={idx} className="p-4 flex justify-between">
                  <span>{item.product_name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="text-right">
              Subtotal: ${(total - (deliveryType === "express" ? 9.99 : 0)).toFixed(2)}
            </p>
            {deliveryType === "express" && (
              <p className="text-right">Express Delivery: $9.99</p>
            )}
            <p className="text-right font-bold">Total: ${total.toFixed(2)}</p>
          </>
        )}
      </div>

      <div>
        <h2 className="font-semibold">Shipping Address</h2>
        {addresses.length > 0 ? (
          <select
            className="border p-2 w-full bg-gray-800 text-white rounded"
            value={selectedAddressId || ""}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            <option value="">Select an address</option>
            {addresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.street}, {addr.city}, {addr.state}, {addr.zip}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-600 italic">
            No addresses found. Please{" "}
            <button onClick={() => setShowAuthModal(true)} className="underline text-blue-600">
              add one in your profile
            </button>.
          </p>
        )}
      </div>

      <div>
        <h2 className="font-semibold">Credit Card</h2>
        {cards.length > 0 ? (
          <select
            className="border p-2 w-full bg-gray-800 text-white rounded"
            value={selectedCardId || ""}
            onChange={(e) => setSelectedCardId(e.target.value)}
          >
            <option value="">Select a credit card</option>
            {cards.map((card) => (
              <option key={card.id} value={card.id}>
                **** **** **** {card.card_number.slice(-4)} — {card.name_on_card}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-gray-600 italic">
            No credit cards found. Please{" "}
            <button onClick={() => setShowAuthModal(true)} className="underline text-blue-600">
              add one in your profile
            </button>.
          </p>
        )}
      </div>

      <div>
        <h2 className="font-semibold">Delivery Plan</h2>
        <select
          className="border p-2 w-full bg-gray-800 text-white rounded"
          value={deliveryType}
          onChange={(e) => setDeliveryType(e.target.value)}
        >
          <option value="standard">Standard (Free)</option>
          <option value="express">Express ($9.99)</option>
        </select>
      </div>

      <button
        onClick={handleCheckout}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold">Sign In Required</h2>
            <p className="text-sm text-gray-700">
              Please log in or register to place your order.
            </p>
            <div className="flex justify-between">
              <Link
                href="/customer/login"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Log In
              </Link>
              <Link
                href="/customer/register"
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Register
              </Link>
            </div>
            <button
              onClick={() => setShowAuthModal(false)}
              className="text-sm text-gray-500 underline block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
