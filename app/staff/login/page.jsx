"use client";
import { useState } from 'react';

export default function StaffLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const { staffId } = await res.json();
      localStorage.setItem('staffId', staffId);
      window.location.href = '/staff';
    } else alert('Login failed.');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Staff Login</h1>
      <input className="border p-2 block" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 block" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="bg-green-600 text-white p-2 rounded">Login</button>
    </div>
  );
}
