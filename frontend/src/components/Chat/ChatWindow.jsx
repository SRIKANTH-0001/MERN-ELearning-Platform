import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import "../../styles/chat.css";

const ChatWindow = ({ recipientId, recipientName, courseId, onClose, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const { socket, connected } = useSocket();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (socket && connected) {
            // Request chat history
            socket.emit("get_chat_history", {
                receiverId: recipientId,
                courseId: courseId,
                limit: 50
            });

            // Join course chat if applicable
            if (courseId) {
                socket.emit("join_course_chat", courseId);
            }

            // Listen for chat history
            socket.on("chat_history", (data) => {
                if (data.success) {
                    setMessages(data.messages);
                }
            });

            // Listen for new messages
            socket.on("receive_message", (message) => {
                if (
                    (courseId && message.course === courseId) ||
                    (recipientId && (message.sender._id === recipientId || message.senderId === recipientId))
                ) {
                    setMessages((prev) => [...prev, message]);
                }
            });

            // Listen for typing indicator
            socket.on("user_typing", (data) => {
                if (data.userId === recipientId) {
                    setIsTyping(data.isTyping);
                }
            });

            // Listen for message sent confirmation
            socket.on("message_sent", (data) => {
                if (data.success) {
                    setMessages((prev) => [...prev, data.message]);
                }
            });

            return () => {
                socket.off("chat_history");
                socket.off("receive_message");
                socket.off("user_typing");
                socket.off("message_sent");
                if (courseId) {
                    socket.emit("leave_course_chat", courseId);
                }
            };
        }
    }, [socket, connected, recipientId, courseId]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !connected) return;

        socket.emit("send_message", {
            receiverId: recipientId,
            courseId: courseId,
            content: newMessage.trim(),
            type: "text"
        });

        setNewMessage("");

        // Stop typing indicator
        socket.emit("typing", {
            receiverId: recipientId,
            courseId: courseId,
            isTyping: false
        });
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        if (!socket || !connected) return;

        // Send typing indicator
        socket.emit("typing", {
            receiverId: recipientId,
            courseId: courseId,
            isTyping: true
        });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing", {
                receiverId: recipientId,
                courseId: courseId,
                isTyping: false
            });
        }, 2000);
    };

    const formatTime = (date) => {
        const messageDate = new Date(date);
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-header-left">
                    {onBack && (
                        <button onClick={onBack} className="chat-back-btn">←</button>
                    )}
                    <div className="chat-header-info">
                        <h3>{recipientName || "Chat"}</h3>
                        <span className={`status-indicator ${connected ? "online" : "offline"}`}>
                            {connected ? "Connected" : "Disconnected"}
                        </span>
                    </div>
                </div>
                <button onClick={onClose} className="chat-close-btn">×</button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <span className="empty-chat-icon">💬</span>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message, index) => {
                        const isOwnMessage = message.sender?._id === user?.id || message.sender === user?.id;
                        return (
                            <div
                                key={message._id || index}
                                className={`message ${isOwnMessage ? "own-message" : "other-message"}`}
                            >
                                {!isOwnMessage && (
                                    <div className="message-sender">{message.sender?.name || "Unknown"}</div>
                                )}
                                <div className="message-bubble">
                                    <p>{message.content}</p>
                                    <span className="message-time">{formatTime(message.createdAt)}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="chat-input"
                    disabled={!connected}
                />
                <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={!newMessage.trim() || !connected}
                >
                    <span>📤</span>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
