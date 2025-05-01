"use client";

import { useState, useEffect } from "react";
import { checkStaff } from "@/lib/checkAuth";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    brand: "",
    size: "",
    description: "",
    category: "",
    price: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    checkStaff();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const productsData = await res.json();

    const stockRes = await fetch("/api/stock");
    const stockData = await stockRes.json();

    const enriched = productsData.map((p) => {
      const stockMatch = stockData.find((s) => s.product_id === p.id);
      return {
        ...p,
        stock_quantity: stockMatch?.total_quantity || 0,
      };
    });

    setProducts(enriched);
    setFilteredProducts(enriched);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleSubmit = async () => {
    const method = editingId ? "PUT" : "POST";
    const url = "/api/products";

    const payload = editingId ? { ...form, id: editingId } : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      resetForm();
      fetchProducts();
    } else {
      alert("Failed to save product.");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      type: p.type,
      brand: p.brand,
      size: p.size,
      description: p.description,
      category: p.category,
      price: p.price || "",
    });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      type: "",
      brand: "",
      size: "",
      description: "",
      category: "",
      price: "",
    });
  };

  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-2xl font-bold">Manage Products</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search product by name..."
        className="border p-2 w-full md:w-1/2"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />

      {/* Add/edit form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["name", "type", "brand", "size", "description", "category", "price"].map((field) => (
          <input
            key={field}
            name={field}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            placeholder={field}
            className="border p-2"
            type={field === "price" ? "number" : "text"}
          />
        ))}
      </div>

      <div className="space-x-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear
          </button>
        )}
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
        {filteredProducts.map((p) => (
          <div key={p.id} className="border p-4 rounded shadow bg-black/30 h-full">
            <h2 className="text-xl font-semibold min-h-[3rem]">{p.name}</h2>
            <p className="text-gray-300">{p.description}</p>
            <p className="text-green-500 font-bold">Price: ${p.price}</p>
            <p className="text-blue-400 text-sm">Stock: {p.stock_quantity}</p>
            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
