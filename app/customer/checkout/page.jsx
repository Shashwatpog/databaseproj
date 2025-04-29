"use client";

import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [deliveryType, setDeliveryType] = useState("standard");

  // New: customer + card + address inputs
  const [customerName, setCustomerName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const getDeliveryPrice = () => (deliveryType === "express" ? 20.0 : 5.0);
  const today = new Date().toISOString().split("T")[0];

  const handleCheckout = async () => {
    const cartItems = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    try {
      // 1. Create customer
      const customerRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName }),
      });
      const customer = await customerRes.json();
      const customerId = customer.id;

      // 2. Create address
      const addressRes = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street,
          city,
          state,
          zip,
          country,
          customer_id: customerId,
        }),
      });
      const address = await addressRes.json();
      const addressId = address.id;

      // 3. Create credit card
      const creditRes = await fetch("/api/credit-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: cardNumber,
          expiry_date: expiryDate,
          name_on_card: nameOnCard,
          customer_id: customerId,
          address_id: addressId,
        }),
      });
      const creditCard = await creditRes.json();
      const creditCardId = creditCard.id;

      // 4. Place order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          creditCardId,
          deliveryType,
          deliveryPrice: getDeliveryPrice(),
          deliveryDate: today,
          shipDate: today,
          cartItems,
        }),
      });

      if (res.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        window.location.href = "/customer";
      } else {
        const text = await res.text();
        console.error("Failed to place order:", text);
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong.");
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + getDeliveryPrice();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div>
        <h2 className="text-lg font-semibold">Customer Info</h2>
        <input className="border p-2 block mb-2" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Address</h2>
        <input className="border p-2 block mb-2" placeholder="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
      </div>

      <div>
        <h2 className="text-lg font-semibold">Payment</h2>
        <input className="border p-2 block mb-2" placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="Expiry Date (YYYY-MM-DD)" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        <input className="border p-2 block mb-2" placeholder="Name on Card" value={nameOnCard} onChange={(e) => setNameOnCard(e.target.value)} />
      </div>

      <div>
        <label>Delivery Type:</label>
        <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)} className="border p-2 ml-2">
          <option value="standard">Standard ($5)</option>
          <option value="express">Express ($20)</option>
        </select>
      </div>

      <div className="mt-4">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Delivery Fee: ${getDeliveryPrice().toFixed(2)}</p>
        <p className="font-bold text-lg">Total: ${total.toFixed(2)}</p>
      </div>

      <button onClick={handleCheckout} className="bg-green-600 text-white p-3 rounded">
        Place Order
      </button>
    </div>
  );
}
