"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { LayoutList, CheckCircle, XCircle } from "lucide-react";
import { useParams } from "next/navigation";

const base_url = process.env.NEXT_PUBLIC_API_URL;
const PRODUCT_API_URL = `${base_url}/api/products/get-products`;
const ADD_PRODUCT_API_URL = `${base_url}/api/store/category/product`;
const REMOVE_PRODUCT_API_URL = `${base_url}/api/store/category/product`;
const GET_ASSIGNED_PRODUCTS_API_URL = `${base_url}/api/store/category`;

export default function AddProductsToCategory() {
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [assignedProductIds, setAssignedProductIds] = useState([]);
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [actionStatus, setActionStatus] = useState({}); // Track success/error messages per product

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
      const res = await axios.get(PRODUCT_API_URL, { headers: getAuthHeader() });
      if (Array.isArray(res.data)) {
        setInventoryProducts(res.data);
      } else if (res.data.products) {
        setInventoryProducts(res.data.products);
      } else {
        console.error("Unexpected API response structure:", res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setActionStatus({
        general: { type: "error", message: error.response?.data?.message || "Failed to fetch products." },
      });
    }
  };

 const fetchAssignedProducts = async () => {
  try {
    const res = await axios.get(GET_ASSIGNED_PRODUCTS_API_URL, {
      params: { categoryId }, // This adds ?categoryId=xxx to the URL
      headers: getAuthHeader()
    });

    // Safe optional chaining in case products is undefined
    const products = res?.data?.products ?? [];
    const ids = products.map((p) => p.id);

    setAssignedProductIds(ids);
  } catch (error) {
    console.error("Error fetching assigned products:", error);
    setActionStatus({
      general: { type: "error", message: "Failed to fetch assigned products." },
    });
  }
};


  const handleAddProduct = async (productId) => {
    if (!categoryId) {
      setActionStatus({
        [productId]: { type: "error", message: "Category ID not found in URL path." },
      });
      return;
    }

    setLoadingProductId(productId);
    try {
      console.log(productId)
      const res = await axios.post(
        ADD_PRODUCT_API_URL,
        { categoryId, productId },
        { headers: getAuthHeader() }
      );
      await fetchAssignedProducts();
      setActionStatus({
        [productId]: { type: "success", message: res.data.message || "Product added successfully!" },
      });
      setTimeout(() => setActionStatus((prev) => ({ ...prev, [productId]: null })), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setActionStatus({
        [productId]: { type: "error", message: error.response?.data?.error || "Failed to add product." },
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (!categoryId) {
      setActionStatus({
        [productId]: { type: "error", message: "Category ID not found in URL path." },
      });
      return;
    }

    setLoadingProductId(productId);
    try {
      const res = await axios.delete(
        REMOVE_PRODUCT_API_URL,
        {
          headers: getAuthHeader(),
          data: { categoryId, productIds: [productId] },
        }
      );
      await fetchAssignedProducts();
      setActionStatus({
        [productId]: { type: "success", message: res.data.message || "Product removed successfully!" },
      });
      setTimeout(() => setActionStatus((prev) => ({ ...prev, [productId]: null })), 3000);
    } catch (error) {
      console.error("Error removing product:", error);
      setActionStatus({
        [productId]: { type: "error", message: error.response?.data?.error || "Failed to remove product." },
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <LayoutList className="w-6 h-6 text-blue-600" /> Add Products to Category
        </h1>

        {actionStatus.general && (
          <div
            className={`mb-4 p-4 rounded-md ${
              actionStatus.general.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {actionStatus.general.message}
          </div>
        )}

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
                inventoryProducts.map((product) => {
                  const isAdded = assignedProductIds.includes(product.id);
                  const isLoading = loadingProductId === product.id;

                  return (
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
                      <td className="px-4 py-3 text-right space-x-2">
                        {actionStatus[product.id] && (
                          <div
                            className={`inline-block text-xs mb-2 p-2 rounded ${
                              actionStatus[product.id].type === "error"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {actionStatus[product.id].message}
                          </div>
                        )}
                        <button
                          onClick={() => handleAddProduct(product.id)}
                          disabled={isAdded || isLoading}
                          className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition ${
                            isAdded
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : isLoading
                              ? "bg-yellow-500 text-white cursor-wait"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {isAdded ? "Added" : isLoading ? "Adding..." : "Add"}
                        </button>
                        {isAdded && (
                          <button
                            onClick={() => handleRemoveProduct(product.id)}
                            disabled={isLoading}
                            className={`px-3 py-1 rounded-md text-xs flex items-center gap-1 transition ${
                              isLoading
                                ? "bg-yellow-500 text-white cursor-wait"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            <XCircle className="w-4 h-4" />
                            {isLoading ? "Removing..." : "Remove"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
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