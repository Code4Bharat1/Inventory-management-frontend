"use client";

import React, { useState } from "react";
import { ShoppingCart, CreditCard, Star, Heart, Loader2, Package } from "lucide-react";

export default function ProductCard({ product, onAddToCart, onBuyNow }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await onAddToCart(product);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    try {
      await onBuyNow(product);
    } finally {
      setBuyingNow(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  const getStockStatus = () => {
    if (product.stock === 0) return { text: "Out of stock", color: "text-red-600" };
    if (product.stock <= 5) return { text: `Only ${product.stock} left`, color: "text-orange-600" };
    return { text: `${product.stock} in stock`, color: "text-green-600" };
  };

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl border shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col overflow-hidden">
      <div className="relative aspect-square bg-gray-50">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Package className="w-12 h-12 text-gray-300" />
          </div>
        )}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow hover:shadow-md transition"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
        </button>
        {product.stock <= 5 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {product.stock === 0 ? "Out of Stock" : "Low Stock"}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col space-y-2">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        {product.rating && (
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                className={`w-4 h-4 ${idx < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className={`text-xs ${getStockStatus().color}`}>{getStockStatus().text}</span>
        </div>
        {product.category && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{product.category}</span>
        )}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition ${
              addingToCart || product.stock === 0 ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {addingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingCart className="w-4 h-4" /> Add</>}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={buyingNow || product.stock === 0}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition ${
              buyingNow || product.stock === 0 ? "bg-gray-300 text-gray-500" : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {buyingNow ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CreditCard className="w-4 h-4" /> Buy</>}
          </button>
        </div>
      </div>
    </div>
  );
}
