"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutList } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = `http://localhost:8080/api/store/category`;

export default function CategoryManagementDashboard() {
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <LayoutList className="w-8 h-8 text-blue-600" /> Category Management
        </h1>
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
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{cat.name}</td>
                    <td className="px-4 py-3">{cat.description}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => router.push(`/store/${cat.id}/add-product`)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Add Products
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
      </div>
    </div>
  );
}
