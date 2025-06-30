'use client';

import { useState } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

const Filters = ({ onFilter }) => {
  const [selectedFilters, setSelectedFilters] = useState({});

  const baseSelectStyles =
    'appearance-none bg-white text-gray-900 px-4 py-2 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm w-full transition-colors duration-200 hover:border-primary cursor-pointer';

  const options = [
    {
      label: 'Category',
      name: 'category',
      items: [
        'Cleaning Supplies',
        'Apparel',
        'Accessories',
        'Personal Care',
        'Stationery',
        'Electronics',
        'Food & Beverage',
        'Pet Supplies',
        'Home Goods',
      ],
    },
    {
      label: 'Availability',
      name: 'stockStatus',
      items: ['in', 'out', 'low'],
    },
  ];

  const handleChange = async (name, value) => {
    const updatedFilters = { ...selectedFilters, [name]: value };
    setSelectedFilters(updatedFilters);
    try {
      const response = await axios.get('http://localhost:8080/api/products/get-products', { params: updatedFilters });
      if (onFilter) onFilter(response.data);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {options.map(({ label, items, name }) => (
        <div className="relative w-48 rounded-2xl" key={label}>
          <select
            className={baseSelectStyles}
            defaultValue=""
            onChange={(e) => handleChange(name, e.target.value)}
          >
            <option disabled value="">
              {label}
            </option>
            {items.map((item) => (
              <option key={item} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
};

export default Filters;