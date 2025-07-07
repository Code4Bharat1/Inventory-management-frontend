"use client";

import React from "react";
import { Loader2, Settings } from "lucide-react";

export default function CategorySidebar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  loading = false,
}) {
  return (
    <aside className="w-64 bg-white/70 backdrop-blur border-r rounded-r-xl h-full flex flex-col shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <button
              onClick={() => onCategoryChange("all")}
              className={`w-full text-left px-4 py-2 rounded-md flex justify-between ${
                selectedCategory === "all" ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`w-full text-left px-4 py-2 rounded-md flex justify-between ${
                  selectedCategory === category.id ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                <span>{category.name}</span>
                <span className="text-xs">{category.count ?? 0}</span>
              </button>
            ))}
          </>
        )}
      </nav>
      <div className="p-4 border-t">
        <button className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 rounded-md">
          <Settings size={16} />
          Manage Categories
        </button>
      </div>
    </aside>
  );
}
