'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import CategorySidebar from './categorsidebar.jsx';
import ProductCard from './productcard.jsx';
import { useParams } from 'next/navigation.js';

export default function StorePage({storeName}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores/${storeName}`);
        setCategories(res.data);
        setSelectedCategory(res.data[0]);  // Automatically select the first category
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [storeName]);

  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/stores/${storeName}/products?category=${selectedCategory}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory, storeName]);

  return (
    <div className="flex min-h-screen">
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedCategory ? `${selectedCategory} - ${storeName}` : storeName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
