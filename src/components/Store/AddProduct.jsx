"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutList, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";

const base_url = process.env.NEXT_PUBLIC_API_URL;
const PRODUCT_API_URL = `${base_url}/api/products/get-products`;
const ADD_PRODUCT_API_URL = `${base_url}/api/store/category/product`;
const GET_ASSIGNED_PRODUCTS_API_URL = `${base_url}/api/store/category/product`;

export default function AddProductsToCategory() {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [assignedProductIds, setAssignedProductIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const categoryId = params.categoryId;

  useEffect(() => {
    if (categoryId) {
      fetchInventoryProducts();
      fetchAssignedProducts();
    }
  }, [categoryId]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchInventoryProducts = async () => {
    try {
      const res = await axios.get(
        PRODUCT_API_URL,
        { headers: getAuthHeader() }
      );
      if (Array.isArray(res.data)) {
        setInventoryProducts(res.data);
      } else if (res.data.products) {
        setInventoryProducts(res.data.products);
      } else {
        console.error("Unexpected API response structure:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const fetchAssignedProducts = async () => {
    try {
      const res = await axios.post(
        GET_ASSIGNED_PRODUCTS_API_URL,
        { categoryId },
        { headers: getAuthHeader() }
      );
      const ids = res.data.products.map((p) => p.id);
      setAssignedProductIds(ids);
    } catch (error) {
      console.error("Error fetching assigned products:", error);
    }
  };

  const handleAddProduct = async (productId) => {
    if (!categoryId) {
      alert("Category ID not found in URL path.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        ADD_PRODUCT_API_URL,
        { categoryId, productIds: [productId] },
        { headers: getAuthHeader() }
      );
      alert("Product added to category successfully!");
      fetchAssignedProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutList className="w-6 h-6 text-blue-600" /> Add Products to Category
        </h1>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {inventoryProducts.length > 0 ? (
                inventoryProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={product.imageUrl || "/default-product.png"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{product.description}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">${product.price}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3">{product.sku || "N/A"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleAddProduct(product.id)}
                        disabled={loading || assignedProductIds.includes(product.id)}
                        className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition ${
                          assignedProductIds.includes(product.id)
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> {assignedProductIds.includes(product.id) ? "Added" : "Add"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                    No products found.
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
