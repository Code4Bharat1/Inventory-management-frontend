"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import NotificationCard from "./NotificationCard";
import OrderNotificationCard from "./OrderNotificationCard"; // ✅ Added for order notifications
import Search from "../inventory/SearchBar.jsx";

const base_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Helper to group notifications by date
function groupNotificationsByDate(notifications) {
  const grouped = {};
  notifications.forEach((notif) => {
    const dateKey = new Date(notif.createdAt).toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(notif);
  });
  return grouped;
}

// Helper to get human-friendly date label
function getDateLabel(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }
}

export default function Notification() {
  const [productNotifications, setProductNotifications] = useState([]);
  const [orderNotifications, setOrderNotifications] = useState([]); // ✅ Added for order notifications
  const [searchQuery, setSearchQuery] = useState("");

  const ownerId = "user_001"; // ✅ Replace with your ownerId or fetch dynamically

  // Fetch product notifications
  useEffect(() => {
    const fetchProductNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const response = await axios.get(`${base_url}/api/notification`);
        setProductNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch product notifications:", error.response?.data || error.message);
        alert("Failed to fetch product notifications: " + (error.response?.data?.error || error.message));
      }
    };
    fetchProductNotifications();
  }, []);

  // ✅ Fetch order notifications
  useEffect(() => {
    const fetchOrderNotifications = async () => {
      try {
        const response = await axios.get(`${base_url}/api/notifications`, {
          params: { ownerId },
        });
        setOrderNotifications(response.data || []);
      } catch (error) {
        console.error("Failed to fetch order notifications:", error.response?.data || error.message);
        alert("Failed to fetch order notifications: " + (error.response?.data?.error || error.message));
      }
    };
    fetchOrderNotifications();
  }, []);

  // Toggle read/unread for product notifications
  const handleMarkAsRead = async (notificationId, currentIsRead, title) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }
      await axios.patch(
        `${base_url}/api/notification/${notificationId}/read`,
        { isRead: !currentIsRead },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: !currentIsRead } : notif
        )
      );
    } catch (error) {
      console.error(`Failed to update notification ${notificationId}:`, error.response?.data || error.message);
      alert(`Failed to update notification "${title}": ` + (error.response?.data?.error || error.message));
    }
  };

  const filteredProductNotifications = productNotifications.filter(
    (notif) =>
      notif.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedProductNotifications = groupNotificationsByDate(filteredProductNotifications);
  const groupedOrderNotifications = groupNotificationsByDate(orderNotifications); // ✅ Grouping for order notifications

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-semibold mb-1">Notifications</h1>
      <p className="text-sm text-gray-500 mb-4">
        Manage your product and order notifications.
      </p>
      <div className="flex items-center rounded-md p-2 mb-4">
        <Search value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* ✅ Product Notifications Section */}
      <h2 className="text-xl font-semibold mt-6 mb-2">Product Notifications</h2>
      <div className="px-4 flex flex-col space-y-4">
        {Object.keys(groupedProductNotifications).length > 0 ? (
          Object.keys(groupedProductNotifications)
            .sort((a, b) => new Date(b) - new Date(a))
            .map((dateKey) => (
              <div key={dateKey}>
                <h3 className="text-lg font-semibold mb-2">{getDateLabel(dateKey)}</h3>
                <div className="flex flex-col space-y-2">
                  {groupedProductNotifications[dateKey].map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notificationId={notification.id}
                      title={`Product: ${notification.product.name} | ${notification.message}`}
                      time={new Date(notification.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      isRead={notification.isRead}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center">No product notifications found</p>
        )}
      </div>

      {/* ✅ Order Notifications Section */}
      <h2 className="text-xl font-semibold mt-10 mb-2">Order Notifications</h2>
      <div className="px-4 flex flex-col space-y-4">
        {Object.keys(groupedOrderNotifications).length > 0 ? (
          Object.keys(groupedOrderNotifications)
            .sort((a, b) => new Date(b) - new Date(a))
            .map((dateKey) => (
              <div key={dateKey}>
                <h3 className="text-lg font-semibold mb-2">{getDateLabel(dateKey)}</h3>
                <div className="flex flex-col space-y-2">
                  {groupedOrderNotifications[dateKey].map((notification) => (
                    <OrderNotificationCard
                      key={notification.id}
                      notification={notification} // ✅ Pass full notification to OrderNotificationCard
                    />
                  ))}
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center">No order notifications found</p>
        )}
      </div>
    </div>
  );
}
