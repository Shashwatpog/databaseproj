"use client";

import { useEffect, useState } from "react";
import { checkCustomer } from "@/lib/checkAuth";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const [newAddress, setNewAddress] = useState({});
  const [newCard, setNewCard] = useState({});

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);

  useEffect(() => {
    checkCustomer();
    const id = localStorage.getItem("customerId");
    setCustomerId(id);
    loadProfile(id);
  }, []);

  const loadProfile = async (id) => {
    const res = await fetch(`/api/customer-profile?id=${id}`);
    const data = await res.json();
    setProfile(data);
  };

  const handleAddAddress = async () => {
    await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAddress, customer_id: customerId }),
    });
    setNewAddress({});
    loadProfile(customerId);
  };

  const handleUpdateAddress = async () => {
    await fetch('/api/addresses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingAddressId),
    });
    setEditingAddressId(null);
    loadProfile(customerId);
  };

  const handleDeleteAddress = async (id) => {
    await fetch(`/api/addresses?id=${id}`, { method: 'DELETE' });
    loadProfile(customerId);
  };

  const handleAddCard = async () => {
    await fetch('/api/credit-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newCard, customer_id: customerId, address_id: profile.addresses[0]?.id }),
    });
    setNewCard({});
    loadProfile(customerId);
  };

  const handleUpdateCard = async () => {
    await fetch('/api/credit-cards', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCardId),
    });
    setEditingCardId(null);
    loadProfile(customerId);
  };

  const handleDeleteCard = async (id) => {
    await fetch(`/api/credit-cards?id=${id}`, { method: 'DELETE' });
    loadProfile(customerId);
  };

  if (!profile) return <div className="p-6">Loading profile...</div>;
  const { customer, addresses, cards } = profile;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Account Balance:</strong> ${Number(customer.account_balance || 0).toFixed(2)}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Addresses</h2>
        {addresses.map(addr => (
          <div key={addr.id} className="border p-2 mb-2 rounded">
            {editingAddressId?.id === addr.id ? (
              <>
                {['street', 'city', 'state', 'zip', 'country'].map(f => (
                  <input key={f} value={editingAddressId[f] || ''} onChange={e => setEditingAddressId({ ...editingAddressId, [f]: e.target.value })} className="block border p-1 mb-1 w-full" placeholder={f} />
                ))}
                <button onClick={handleUpdateAddress} className="bg-green-600 text-white px-2 py-1 mr-2">Save</button>
                <button onClick={() => setEditingAddressId(null)} className="bg-gray-400 text-white px-2 py-1">Cancel</button>
              </>
            ) : (
              <>
                <p>{addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                <button onClick={() => setEditingAddressId(addr)} className="bg-yellow-500 text-white px-2 py-1 mr-2 mt-1">Edit</button>
                <button onClick={() => handleDeleteAddress(addr.id)} className="bg-red-600 text-white px-2 py-1 mt-1">Delete</button>
              </>
            )}
          </div>
        ))}
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-1">Add New Address</h3>
          {['street', 'city', 'state', 'zip', 'country'].map(f => (
            <input key={f} value={newAddress[f] || ''} onChange={e => setNewAddress({ ...newAddress, [f]: e.target.value })} className="block border p-1 mb-1 w-full" placeholder={f} />
          ))}
          <button onClick={handleAddAddress} className="bg-blue-600 text-white px-2 py-1">Add Address</button>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Credit Cards</h2>
        {cards.map(card => (
          <div key={card.id} className="border p-2 mb-2 rounded">
            {editingCardId?.id === card.id ? (
              <>
                {['card_number', 'expiry_date', 'name_on_card'].map(f => (
                  <input key={f} value={editingCardId[f] || ''} onChange={e => setEditingCardId({ ...editingCardId, [f]: e.target.value })} className="block border p-1 mb-1 w-full" placeholder={f} />
                ))}
                <button onClick={handleUpdateCard} className="bg-green-600 text-white px-2 py-1 mr-2">Save</button>
                <button onClick={() => setEditingCardId(null)} className="bg-gray-400 text-white px-2 py-1">Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Card:</strong> **** **** **** {card.card_number.slice(-4)}</p>
                <p><strong>Expires:</strong> {card.expiry_date}</p>
                <p><strong>Name on Card:</strong> {card.name_on_card}</p>
                <button onClick={() => setEditingCardId(card)} className="bg-yellow-500 text-white px-2 py-1 mr-2 mt-1">Edit</button>
                <button onClick={() => handleDeleteCard(card.id)} className="bg-red-600 text-white px-2 py-1 mt-1">Delete</button>
              </>
            )}
          </div>
        ))}
        <div className="mt-2">
          <h3 className="text-sm font-semibold mb-1">Add New Card</h3>
          {['card_number', 'expiry_date', 'name_on_card'].map(f => (
            <input key={f} value={newCard[f] || ''} onChange={e => setNewCard({ ...newCard, [f]: e.target.value })} className="block border p-1 mb-1 w-full" placeholder={f} />
          ))}
          <button onClick={handleAddCard} className="bg-blue-600 text-white px-2 py-1">Add Card</button>
        </div>
      </section>
    </div>
  );
}
