const Message = require("../models/Message");

module.exports = (io, socket) => {
    // Send a message
    socket.on("send_message", async (data) => {
        try {
            const { receiverId, courseId, content, type = "text" } = data;

            // Create message in database
            const message = await Message.create({
                sender: socket.userId,
                receiver: receiverId || null,
                course: courseId || null,
                content,
                type
            });

            // Populate sender info
            await message.populate("sender", "name email");

            // Determine the room to send to
            let room;
            if (courseId) {
                room = `course:${courseId}`;
            } else if (receiverId) {
                room = `user:${receiverId}`;
            }

            // Emit to the receiver/course room
            if (room) {
                io.to(room).emit("receive_message", {
                    ...message.toObject(),
                    senderId: socket.userId
                });
            }

            // Send confirmation to sender
            socket.emit("message_sent", {
                success: true,
                message: message.toObject()
            });
        } catch (error) {
            console.error("Error sending message:", error);
            socket.emit("message_error", {
                success: false,
                error: "Failed to send message"
            });
        }
    });

    // Join a course chat room
    socket.on("join_course_chat", (courseId) => {
        socket.join(`course:${courseId}`);
        console.log(`User ${socket.userId} joined course chat: ${courseId}`);
    });

    // Leave a course chat room
    socket.on("leave_course_chat", (courseId) => {
        socket.leave(`course:${courseId}`);
        console.log(`User ${socket.userId} left course chat: ${courseId}`);
    });

    // Typing indicator
    socket.on("typing", (data) => {
        const { receiverId, courseId, isTyping } = data;

        let room;
        if (courseId) {
            room = `course:${courseId}`;
        } else if (receiverId) {
            room = `user:${receiverId}`;
        }

        if (room) {
            socket.to(room).emit("user_typing", {
                userId: socket.userId,
                isTyping
            });
        }
    });

    // Mark messages as read
    socket.on("mark_as_read", async (data) => {
        try {
            const { messageIds } = data;

            await Message.updateMany(
                { _id: { $in: messageIds }, receiver: socket.userId },
                { isRead: true }
            );

            socket.emit("messages_marked_read", {
                success: true,
                messageIds
            });
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    });

    // Get chat history
    socket.on("get_chat_history", async (data) => {
        try {
            const { receiverId, courseId, limit = 50, skip = 0 } = data;

            let query = {};
            if (courseId) {
                query.course = courseId;
            } else if (receiverId) {
                query.$or = [
                    { sender: socket.userId, receiver: receiverId },
                    { sender: receiverId, receiver: socket.userId }
                ];
            }

            const messages = await Message.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(skip)
                .populate("sender", "name email");

            socket.emit("chat_history", {
                success: true,
                messages: messages.reverse()
            });
        } catch (error) {
            console.error("Error fetching chat history:", error);
            socket.emit("chat_history", {
                success: false,
                error: "Failed to fetch chat history"
            });
        }
    });
};
