import React from "react";

export default function NotificationCard({ notificationId, title, time, isRead, onMarkAsRead }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl p-4 transition-colors duration-200 shadow-sm border cursor-pointer ${
        isRead ? "bg-white hover:bg-gray-50 border-gray-200" : "bg-blue-50 hover:bg-blue-100 border-blue-200"
      }`}
      onClick={() => onMarkAsRead(notificationId, isRead, title)}
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full shadow-inner ${
            isRead ? "bg-gray-200" : "bg-blue-500 text-white"
          }`}
        >
          <span className="text-xs font-semibold">{title.charAt(0)}</span>
        </div>
        <span className={`text-sm font-medium ${isRead ? "text-gray-700" : "text-blue-700"}`}>
          {title}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500 font-medium">{time}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(notificationId, isRead, title);
          }}
          className={`text-xs px-3 py-1 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isRead
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400"
          }`}
        >
          {isRead ? "Mark as Unread" : "Mark as Read"}
        </button>
      </div>
    </div>
  );
}
