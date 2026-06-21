import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (socket && connected) {
      // Request notifications on connect
      socket.emit("get_notifications", { limit: 20 });

      // Listen for notifications list
      socket.on("notifications_list", (data) => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      });

      // Listen for new notifications
      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast notification
        toast.info(notification.title, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      });

      // Listen for mark as read confirmation
      socket.on("notification_marked_read", (data) => {
        if (data.success) {
          setNotifications((prev) =>
            prev.map((notif) =>
              notif._id === data.notificationId ? { ...notif, isRead: true } : notif
            )
          );
          setUnreadCount(data.unreadCount);
        }
      });

      // Listen for mark all as read confirmation
      socket.on("all_notifications_marked_read", (data) => {
        if (data.success) {
          setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, isRead: true }))
          );
          setUnreadCount(0);
        }
      });

      return () => {
        socket.off("notifications_list");
        socket.off("new_notification");
        socket.off("notification_marked_read");
        socket.off("all_notifications_marked_read");
      };
    }
  }, [socket, connected]);

  const markAsRead = (notificationId) => {
    if (socket && connected) {
      socket.emit("mark_notification_read", { notificationId });
    }
  };

  const markAllAsRead = () => {
    if (socket && connected) {
      socket.emit("mark_all_notifications_read");
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
