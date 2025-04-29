"use client";

import { useState, useEffect } from 'react';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', type: '', brand: '', size: '', description: '', category: '', price: '' });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', type: '', brand: '', size: '', description: '', category: '', price: '' });
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>
      <div className="flex flex-col space-y-2 mb-6">
        {['name', 'type', 'brand', 'size', 'description', 'category', 'price'].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2"
          />
        ))}
        <button onClick={handleAdd} className="bg-blue-600 text-white p-2 rounded">Add Product</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow">
            <h2 className="text-xl">{p.name}</h2>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
