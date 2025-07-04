"use client";

import React, { useState } from "react";
import axios from "axios";

export default function OrderNotificationCard({ notification }) {
  const [status, setStatus] = useState(
    notification.status ?? notification.order?.status ?? "PENDING"
  );
  const [loading, setLoading] = useState(false);

  const isPending = status === "PENDING";

  const handleResponse = async (responseStatus) => {
    try {
      setLoading(true);

      // Retrieve token for secure API call
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in.");
        setLoading(false);
        return;
      }
      console.log(notification);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/respond`,
        {
          orderId: notification.order?.id,
          status: responseStatus,
          message:
            responseStatus === "ACCEPTED"
              ? "Order accepted and ready."
              : "Order rejected due to stock issues.",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatus(responseStatus);
    } catch (error) {
      console.error(
        "Error updating notification:",
        error.response?.data || error.message || error
      );
      alert(
        `Failed to update notification: ${
          error.response?.data?.error || error.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl p-4 shadow-sm border transition-colors duration-200 ${
        status === "PENDING"
          ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
          : status === "ACCEPTED"
          ? "bg-green-50 border-green-200 hover:bg-green-100"
          : "bg-red-50 border-red-200 hover:bg-red-100"
      }`}
    >
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold text-gray-800">
          Order Notification: {notification.id}
        </span>
        <span className="text-xs text-gray-600">Status: {status}</span>
        <span className="text-xs text-gray-600">
          Shop: {notification.shop?.name ?? "N/A"}
        </span>
        <span className="text-xs text-gray-600">
          Order Total: SAR {notification.order?.totalAmount ?? "N/A"}
        </span>
        <span className="text-xs text-gray-600">
          Customer: {notification.order?.user?.name ?? "N/A"} (
          {notification.order?.user?.email ?? "N/A"})
        </span>
      </div>

      {isPending ? (
        <div className="flex space-x-2 mt-3 sm:mt-0">
          <button
            disabled={loading}
            onClick={() => handleResponse("ACCEPTED")}
            className="px-3 py-1 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Accept"}
          </button>
          <button
            disabled={loading}
            onClick={() => handleResponse("REJECTED")}
            className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Decline"}
          </button>
        </div>
      ) : (
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            status === "ACCEPTED"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      )}
    </div>
  );
}
