
"use client";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(false);

  const handleAddToBasket = () => {
    // Optionally add API integration here
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    alert(`Proceeding to buy: ${product.name}`);
  };

  return (
    <div className="border rounded shadow hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded mb-2"
      />
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description}</p>
      <div className="mt-auto flex space-x-2 pt-4">
        <button
          onClick={handleAddToBasket}
          className="flex-1 bg-blue-500 text-white py-1 rounded hover:bg-blue-600 text-sm"
        >
          {added ? "Added!" : "Add to Basket"}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600 text-sm"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
