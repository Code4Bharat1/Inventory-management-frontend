"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { LayoutList, PlusCircle, Edit, Trash2 } from "lucide-react";

import { useRouter } from "next/navigation";
const API_URL = `http://localhost:8080/api/store/category`;

export default function CategoryManagementDashboard() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", imageUrl: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    if (!newCategory.name.trim() || !newCategory.description.trim()) {
      alert("Name and description are required.");
      return;
    }
    try {
      if (isEditMode) {
        await axios.put(API_URL, { categoryId: editCategoryId, ...newCategory });
      } else {
        await axios.post(API_URL, newCategory);
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setNewCategory({ name: "", description: "", imageUrl: "" });
    setEditCategoryId(null);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Category Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gray-100 border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm"
          >
            Add Category
          </button>
        </div>

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Category List</h2>

        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Category Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer max-w-xs truncate">
                      {cat.description}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button className="text-blue-600 text-sm hover:underline" onClick={() => router.push(`/store/${cat.id}/add-product`)} >Add Products</button>
                      <button
                        onClick={() => {
                          setIsEditMode(true);
                          setNewCategory({ name: cat.name, description: cat.description, imageUrl: cat.imageUrl });
                          setEditCategoryId(cat.id);
                          setShowModal(true);
                        }}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm("Are you sure you want to delete this category?")) {
                            await axios.delete(`${API_URL}/${cat.id}`);
                            fetchCategories();
                          }
                        }}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className="mt-4 text-bold bg-gray-100 text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition text-sm">
          Shop Preview
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">{isEditMode ? "Edit Category" : "Add Category"}</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <textarea
                  placeholder="Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={newCategory.imageUrl}
                  onChange={(e) => setNewCategory({ ...newCategory, imageUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
              </div>
              <div className="flex justify-end gap-2 mt-5">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 rounded hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
