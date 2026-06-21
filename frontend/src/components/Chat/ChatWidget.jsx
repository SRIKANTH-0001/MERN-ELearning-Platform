import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import "../../styles/chat.css";

const ChatWidget = () => {
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState(null);

    if (!isAuthenticated || user?.role === "admin") return null;

    const handleSelectConversation = (recipient) => {
        setSelectedRecipient(recipient);
    };

    const handleBackToList = () => {
        setSelectedRecipient(null);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedRecipient(null);
    };

    return (
        <div className="chat-widget-container">
            {isOpen ? (
                <div className="chat-widget-content">
                    {selectedRecipient ? (
                        <ChatWindow
                            recipientId={selectedRecipient._id}
                            recipientName={selectedRecipient.name}
                            onClose={handleClose}
                            onBack={handleBackToList}
                        />
                    ) : (
                        <ConversationList onSelectConversation={handleSelectConversation} />
                    )}
                    {!selectedRecipient && (
                        <button className="chat-widget-close-btn" onClick={() => setIsOpen(false)}>×</button>
                    )}
                </div>
            ) : (
                <button className="chat-fab" onClick={() => setIsOpen(true)}>
                    <span className="chat-icon">💬</span>
                    <span className="chat-label">Chat</span>
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
