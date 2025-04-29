"use client";
import { useState } from 'react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const res = await fetch('/api/auth/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'register', email, password, name }),
    });
    if (res.ok) window.location.href = '/customer/login';
    else alert('Registration failed.');
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="border p-2 block" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input className="border p-2 block" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" className="border p-2 block" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="bg-blue-600 text-white p-2 rounded">Register</button>
    </div>
  );
}
