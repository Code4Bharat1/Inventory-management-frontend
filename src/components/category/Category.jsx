"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutList,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";

const API_URL = "http://localhost:8080/categories";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = () => setShowModal(true);

  const handleModalSubmit = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert("Both name and description are required.");
      return;
    }

    try {
      await axios.post(API_URL, newCategory);
      fetchCategories(); // Refresh list
      setNewCategory({ name: "", description: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    try {
      await axios.delete(`${API_URL}/${encodeURIComponent(categoryName)}`);
      fetchCategories(); // Refresh list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEditCategory = (categoryName) => {
    console.log("Edit category:", categoryName);
    // You can later open an edit modal here
  };

  const handleAddProduct = (categoryName) => {
    console.log("Add product to:", categoryName);
  };

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-800">
          <LayoutList className="w-6 h-6 text-blue-600" />
          Category Management
        </h1>
        <button
          onClick={handleAddCategory}
          className="bg-gray-100 text-sm text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Category Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 text-lg font-semibold border-b border-gray-200">
          Category List
        </div>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-gray-600 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3 font-medium">Category Name</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat, idx) => (
              <tr key={idx} className="bg-white hover:bg-gray-50">
                <td className="px-6 py-4">{cat.name}</td>
                <td className="px-6 py-4 text-gray-600">{cat.description}</td>
                <td className="px-6 py-4 text-right text-sm text-blue-600 space-x-2">
                  <button
                    onClick={() => handleAddProduct(cat.name)}
                    className="hover:underline inline-flex"
                  >
                    Add Products
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleEditCategory(cat.name)}
                    className="hover:underline flex items-center gap-1 inline-flex"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={() => handleDeleteCategory(cat.name)}
                    className="hover:underline text-red-600 flex items-center gap-1 inline-flex"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Add New Category
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Category Name"
                className="w-full border border-gray-200 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                rows={4}
                className="w-full border border-gray-200 p-3 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
