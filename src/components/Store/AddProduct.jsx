"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutList, CheckCircle, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const PRODUCT_API_URL = `http://localhost:8080/api/products/get-products`;
const CATEGORY_PRODUCTS_API_URL = `http://localhost:8080/api/store/category/products`;
const ADD_PRODUCT_API_URL = `http://localhost:8080/api/store/category/add-product`;
const REMOVE_PRODUCT_API_URL = `http://localhost:8080/api/store/category/remove-product`;

export default function AddRemoveProductsToCategory() {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");

  useEffect(() => {
    if (categoryId) {
      fetchInventoryProducts();
      fetchCategoryProducts();
    }
  }, [categoryId]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchInventoryProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_API_URL, {
        headers: getAuthHeader(),
      });
      setInventoryProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      const res = await axios.get(`${CATEGORY_PRODUCTS_API_URL}/${categoryId}`, {
        headers: getAuthHeader(),
      });
      setCategoryProducts(res.data.products || []);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleAddProduct = async (productId) => {
    setLoading(true);
    try {
      await axios.post(
        ADD_PRODUCT_API_URL,
        { categoryId, productId },
        { headers: getAuthHeader() }
      );
      fetchCategoryProducts();
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setLoading(true);
    try {
      await axios.post(
        REMOVE_PRODUCT_API_URL,
        { categoryId, productId },
        { headers: getAuthHeader() }
      );
      fetchCategoryProducts();
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const isProductInCategory = (productId) => {
    return categoryProducts.some((product) => product.id === productId);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutList className="w-6 h-6 text-blue-600" /> Manage Products in Category
        </h1>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryProducts.length > 0 ? (
                inventoryProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{product.description}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3 text-right">
                      {isProductInCategory(product.id) ? (
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddProduct(product.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" /> Add
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No products in inventory.
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
