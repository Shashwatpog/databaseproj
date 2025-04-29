"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isCustomer, setIsCustomer] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsCustomer(!!localStorage.getItem('customerId'));
    setIsStaff(!!localStorage.getItem('staffId'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out!');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link href="/" className="font-bold text-xl">Online Store</Link>
      <div className="space-x-4">
        <Link href="/customer">Customer</Link>
        <Link href="/staff">Staff</Link>
        {!isCustomer && !isStaff && (
          <>
            <Link href="/customer/login">Login</Link>
            <Link href="/customer/register">Register</Link>
            <Link href="/staff/login">Staff Login</Link>
          </>
        )}
        {(isCustomer || isStaff) && (
          <button onClick={handleLogout} className="text-red-400 underline">Logout</button>
        )}
      </div>
    </nav>
  );
}
