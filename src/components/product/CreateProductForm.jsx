"use client";

import { useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";

const Tooltip = ({ text }) => (
  <div className="group relative flex items-center">
    <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap w-max max-w-xs overflow-hidden text-ellipsis z-50">
      {text}
    </div>
  </div>
);

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    description: "",
    note: "",
    minimumStock: "",
    sku: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      category: "",
      stock: "",
      price: "",
      description: "",
      note: "",
      minimumStock: "",
      sku: "",
      image: null,
    });
    toast.success("Form reset");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("quantity", formData.stock);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("note", formData.note);
      data.append("minimumStock", formData.minimumStock);
      data.append("sku", formData.sku);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/create-product`,
        data
      );

      toast.success("Product created successfully");

      setFormData({
        name: "",
        category: "",
        stock: "",
        price: "",
        description: "",
        note: "",
        minimumStock: "",
        sku: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating product:", error.response?.data || error.message);
      toast.error(`❌ ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white rounded-2xl shadow space-y-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Product Name */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div className="w-full max-w-lg space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
            Category
            <Tooltip text="Select from existing categories or type to create a new category for this product." />
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select existing category</option>
            <option value="Cleaning Supplies">Cleaning Supplies</option>
            <option value="Apparel">Apparel</option>
            <option value="Accessories">Accessories</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Stationery">Stationery</option>
            <option value="Electronics">Electronics</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Pet Supplies">Pet Supplies</option>
            <option value="Home Goods">Home Goods</option>
          </select>
          <div className="text-center text-gray-500 text-sm">— or —</div>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Create new category (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stock Quantity */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Enter stock quantity"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Price */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Add any additional notes"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Minimum Stock */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
            Minimum Stock
            <Tooltip text="Stock level at which low stock alerts will trigger." />
          </label>
          <input
            type="number"
            name="minimumStock"
            value={formData.minimumStock}
            onChange={handleChange}
            placeholder="Enter minimum stock threshold"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SKU */}
        <div className="w-full max-w-lg">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
            SKU
            <Tooltip text="Optional product identifier. Leave blank to auto-generate." />
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter SKU or leave empty to auto-generate"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-blue-400 transition">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drag and drop an image here, or click to browse</p>
          <p className="text-xs text-gray-400 mb-2">Recommended size: 1024×1024px</p>
          <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition"
          >
            Upload Image
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 flex-wrap">
          <Link
            href="/inventory"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleClearForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Clear All
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;
