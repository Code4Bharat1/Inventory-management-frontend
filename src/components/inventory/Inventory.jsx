"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import Filters from "./Filter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Upload } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../product/DeleteProduct.jsx";

const Table = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async (filterParams = {}) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`,
        { params: filterParams }
      );
      setProducts(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error("Please upload a CSV or Excel file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/upload-products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Products uploaded successfully.");
      fetchProducts(); // Refresh the table
    } catch (error) {
      console.error("Error uploading products:", error);
      toast.error("Failed to upload products.");
    } finally {
      setUploading(false);
      event.target.value = null; // Reset file input
    }
  };

  const indexOfLastProduct = currentPage * rowsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (productId) => {
    router.push(`/inventory/${productId}/edit-product`);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    console.log(selectedProduct.id)
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct.id}`
      );
      toast.success("Product deleted successfully.");
      setShowDeleteModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Inventory
          </h1>
          <p className="text-gray-600">
            View, filter, and manage your product inventory with ease.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg cursor-pointer hover:bg-green-700 transition">
            <Upload size={18} />
            {uploading ? "Uploading..." : "Upload Products"}
            <input
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <Link
            href="/inventory/create-product"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            New Product
          </Link>
        </div>
      </div>

      <SearchBar onResults={setProducts} />
      <Filters onFilter={setProducts} />

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm p-4 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "#",
                "Product Name",
                "Category",
                "SKU",
                "Price (₹)",
                "Stock",
                "Status",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {currentProducts.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {indexOfFirstProduct + index + 1}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 whitespace-nowrap cursor-pointer hover:underline">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 whitespace-nowrap cursor-pointer hover:underline">
                  {product.sku}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                  {product.quantity}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      product.status === "Low Stock"
                        ? "bg-red-200 text-red-800 border border-red-400"
                        : "bg-green-200 text-green-800 border border-green-400"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === idx + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        productName={selectedProduct?.name}
      />
    </div>
  );
};

export default Table;