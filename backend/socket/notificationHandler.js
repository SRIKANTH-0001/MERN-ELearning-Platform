const Notification = require("../models/Notification");

module.exports = (io, socket) => {
    // Get user notifications
    socket.on("get_notifications", async (data) => {
        try {
            const { limit = 20, skip = 0 } = data || {};

            const notifications = await Notification.find({ user: socket.userId })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip);

            const unreadCount = await Notification.countDocuments({
                user: socket.userId,
                isRead: false
            });

            socket.emit("notifications_list", {
                success: true,
                notifications,
                unreadCount
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            socket.emit("notifications_list", {
                success: false,
                error: "Failed to fetch notifications"
            });
        }
    });

    // Mark notification as read
    socket.on("mark_notification_read", async (data) => {
        try {
            const { notificationId } = data;

            await Notification.findByIdAndUpdate(notificationId, { isRead: true });

            const unreadCount = await Notification.countDocuments({
                user: socket.userId,
                isRead: false
            });

            socket.emit("notification_marked_read", {
                success: true,
                notificationId,
                unreadCount
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    });

    // Mark all notifications as read
    socket.on("mark_all_notifications_read", async () => {
        try {
            await Notification.updateMany(
                { user: socket.userId, isRead: false },
                { isRead: true }
            );

            socket.emit("all_notifications_marked_read", {
                success: true,
                unreadCount: 0
            });
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    });
};

// Helper function to send notification (can be called from other parts of the app)
const sendNotification = async (io, userId, notificationData) => {
    try {
        const notification = await Notification.create({
            user: userId,
            ...notificationData
        });

        // Send real-time notification to user
        io.to(`user:${userId}`).emit("new_notification", notification);

        return notification;
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
};

module.exports.sendNotification = sendNotification;
