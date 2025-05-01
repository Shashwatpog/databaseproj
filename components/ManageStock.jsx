"use client";

import { useEffect, useState } from "react";

export default function ManageStock() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stock, setStock] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
    fetchStock();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchWarehouses = async () => {
    const res = await fetch("/api/warehouses");
    const data = await res.json();
    setWarehouses(data);
  };

  const fetchStock = async () => {
    const res = await fetch("/api/stock?detailed=true"); 
    const data = await res.json();
    setStock(data);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ product_id: "", warehouse_id: "", quantity: "" });
      fetchStock();
    } else {
      const text = await res.text();
      alert("Error: " + text);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add Stock to Warehouse</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          className="border p-2 bg-gray-800 text-white"
          value={form.product_id}
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 bg-gray-800 text-white"
          value={form.warehouse_id}
          onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.address}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 bg-gray-800 text-white"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Stock
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Current Stock</h3>
        <ul className="divide-y border rounded">
          {stock.map((s) => (
            <li
              key={`${s.product_id}-${s.warehouse_id}`} 
              className="p-4"
            >
              {s.product_name} — {s.quantity} units at {s.warehouse_address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
