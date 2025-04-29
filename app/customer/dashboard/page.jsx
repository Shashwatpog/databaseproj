"use client";
import { useEffect } from 'react';
import { checkCustomer } from '@/lib/checkAuth';

export default function CustomerDashboard() {
  useEffect(() => { checkCustomer(); }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, Customer</h1>
    </div>
  );
}
