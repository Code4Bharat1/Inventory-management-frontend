"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Loader2, Package } from "lucide-react";
import ProductCard from "./ProductCard";

export default function OnlineStore({
  products = [], // ✅ Defensive default
  selectedCategory = "all", // ✅ Defensive default
  onAddToCart = () => {}, // ✅ Defensive default
  onBuyNow = () => {}, // ✅ Defensive default
  loading = false, // ✅ Defensive default
  error = null, // ✅ Defensive default
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // useEffect(() => {
  //   if (!Array.isArray(products)) return; // ✅ Prevents crashing if products is undefined

  //   let filtered = [...products]; // Avoids mutating props

  //   // Filter by category
  //   if (selectedCategory !== "all") {
  //     filtered = filtered.filter(
  //       (product) => product?.category === selectedCategory
  //     );
  //   }

  //   // Filter by search term
  //   if (searchTerm) {
  //     const search = searchTerm.toLowerCase();
  //     filtered = filtered.filter(
  //       (product) =>
  //         product?.name?.toLowerCase().includes(search) ||
  //         product?.description?.toLowerCase().includes(search)
  //     );
  //   }

  //   // Sort products
  //   filtered.sort((a, b) => {
  //     let aValue = a?.[sortBy] ?? "";
  //     let bValue = b?.[sortBy] ?? "";

  //     if (typeof aValue === "string") aValue = aValue.toLowerCase();
  //     if (typeof bValue === "string") bValue = bValue.toLowerCase();

  //     if (sortOrder === "asc") {
  //       return aValue > bValue ? 1 : -1;
  //     } else {
  //       return aValue < bValue ? 1 : -1;
  //     }
  //   });

  //   setFilteredProducts(filtered);
  // }, []);

  return (
    <div className="flex-1 p-6">
      {/* Search and Sort Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-md w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="border rounded-md px-3 py-2"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="stock-desc">Stock (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-semibold">No products found</h3>
        </div>
      )}
    </div>
  );
}
