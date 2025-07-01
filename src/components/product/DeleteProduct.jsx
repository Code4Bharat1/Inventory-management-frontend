"use client";

import React from "react";

const DeleteProduct = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  productName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Delete Product
        </h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
