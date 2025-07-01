'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`, { params: { search: value } });
      if (onResults) {
        onResults(response.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div className="relative w-full max-w-full mx-auto mb-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search"
        className="w-full py-3 pl-12 pr-4 rounded-full bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
      />
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
};

export default SearchBar;