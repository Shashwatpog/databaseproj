"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isCustomer, setIsCustomer] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    setIsCustomer(!!localStorage.getItem('customerId'));
    setIsStaff(!!localStorage.getItem('staffId'));
    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 500);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out!');
    window.location.href = '/';
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl">Online Store</Link>

      <div className="flex space-x-4 items-center">
        {/* Only for customers or guests */}
        {!isStaff && (
          <>
            <Link href="/" className="hover:underline">Home</Link>
            <Link href="/customer/cart" className="hover:underline relative">
              Cart
              {cartCount > 0 && (
                <span className="ml-1 inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {/* Customer-only options */}
        {isCustomer && (
          <>
            <Link href="/customer/profile" className="hover:underline">Profile</Link>
            <button onClick={handleLogout} className="text-red-400 underline">Logout</button>
          </>
        )}

        {/* Staff-only options */}
        {isStaff && (
          <>
            <Link href="/staff" className="hover:underline">Staff Dashboard</Link>
            <button onClick={handleLogout} className="text-red-400 underline">Logout</button>
          </>
        )}

        {/* Guests (not logged in) */}
        {!isCustomer && !isStaff && (
          <>
            <Link href="/customer/login" className="hover:underline">Login</Link>
            <Link href="/customer/register" className="hover:underline">Register</Link>
            <Link href="/staff/login" className="hover:underline">Staff Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}
