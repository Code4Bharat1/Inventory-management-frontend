'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './SearchBar';
import Filters from './Filter';

const Table = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});

  const fetchProducts = async (filterParams = {}) => {
    try {
      const response = await axios.get('http://localhost:8080/api/products/get-products', { params: filterParams });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Inventory</h1>
      <p className="text-gray-600">View, filter, and manage your product inventory with ease.</p>
      <SearchBar onResults={setProducts} />
      <Filters onFilter={handleFilterChange} />
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm p-4 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Product Name', 'Category', 'SKU', 'Price (₹)', 'Stock', 'Status', 'Actions'].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 text-sm text-blue-600 whitespace-nowrap cursor-pointer hover:underline">{product.category}</td>
                <td className="px-6 py-4 text-sm text-blue-600 whitespace-nowrap cursor-pointer hover:underline">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">₹{product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">{product.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${product.status === 'Low Stock' ? 'bg-red-200 text-red-800 border border-red-400' : 'bg-green-200 text-green-800 border border-green-400'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                  <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;