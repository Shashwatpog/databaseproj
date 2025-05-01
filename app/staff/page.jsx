"use client";

import { useState } from "react";
import ManageProducts from "@/components/ManageProducts";
import ManageStock from "@/components/ManageStock";

export default function StaffDashboard() {
  const [tab, setTab] = useState("products");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-2">Staff Dashboard</h1>

      <div className="flex space-x-4 bg-slate p-2 rounded shadow mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded font-medium transition 
            ${tab === "products"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
          `}
        >
          Manage Products
        </button>
        <button
          onClick={() => setTab("stock")}
          className={`px-4 py-2 rounded font-medium transition 
            ${tab === "stock"
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
          `}
        >
          Manage Stock
        </button>
      </div>

      {tab === "products" && <ManageProducts />}
      {tab === "stock" && <ManageStock />}
    </div>
  );
}
