"use client";

import { useEffect, useState } from 'react';
import { checkCustomer } from '@/lib/checkAuth';

export default function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState([]);
  const [filterCategory, setFilterCategory] = useState([]);
  const [filterBrand, setFilterBrand] = useState([]);

  const [allTypes, setAllTypes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);

  useEffect(() => {
    checkCustomer();
    fetchProducts();
  }, [search, filterType, filterCategory, filterBrand]);

  const fetchProducts = async () => {
    const params = new URLSearchParams({ search });
    filterType.forEach(t => params.append('type', t));
    filterCategory.forEach(c => params.append('category', c));
    filterBrand.forEach(b => params.append('brand', b));

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data);

    // update available filter values based on fetched data
    setAllTypes([...new Set(data.map(p => p.type).filter(Boolean))]);
    setAllCategories([...new Set(data.map(p => p.category))]);
    setAllBrands([...new Set(data.map(p => p.brand))]);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.product_id === product.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ product_id: product.id, quantity: 1, price: product.price, product_name: product.name });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Added to cart!');
  };

  const grouped = products.reduce((acc, p) => {
    acc[p.type] = acc[p.type] || [];
    acc[p.type].push(p);
    return acc;
  }, {});

  return (
    <div className="p-6 flex flex-col md:flex-row-reverse gap-6">
      {/* Sidebar Filters */}
      <div className="md:w-1/4 space-y-4 sticky top-6 self-start h-fit">
        {[
          { label: 'Category', key: 'category', options: allCategories, selected: filterCategory, setSelected: setFilterCategory },
          { label: 'Type', key: 'type', options: allTypes, selected: filterType, setSelected: setFilterType },
          { label: 'Brand', key: 'brand', options: allBrands, selected: filterBrand, setSelected: setFilterBrand },
        ].map(section => (
          <details key={section.key} open className="bg-slate border rounded p-3">
            <summary className="cursor-pointer font-semibold">{section.label}</summary>
            <div className="mt-2 space-y-1">
              {section.options.map(opt => (
                <label key={opt} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={section.selected.includes(opt)}
                    onChange={e => {
                      const checked = e.target.checked;
                      const newValues = checked
                        ? [...section.selected, opt]
                        : section.selected.filter(v => v !== opt);
                      section.setSelected(newValues);
                    }}
                  />{' '}
                  {opt}
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>

      {/* Product Results */}
      <div className="w-full px-6 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Search by name, description, brand..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {Object.entries(grouped).length === 0 && (
          <p className="text-gray-500 mt-4">No products found.</p>
        )}

        {Object.entries(grouped).map(([type, group]) => (
          <div key={type}>
            <h2 className="text-xl font-semibold mt-4 mb-2">{type}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.map(p => (
                <div key={p.id} className="border p-4 rounded shadow">
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{p.description}</p>
                  <p className="text-green-600 font-semibold mb-2">${p.price}</p>
                  <button
                    onClick={() => addToCart(p)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
