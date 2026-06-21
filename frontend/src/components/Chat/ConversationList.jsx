import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/chat.css";

const ConversationList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5005"}/api/chat/conversations`, config);
                setConversations(response.data);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchConversations();
        }
    }, [token]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5005"}/api/chat/search?query=${query}`, config);
            setSearchResults(response.data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    if (loading) return <div className="conversations-loading">Loading chats...</div>;

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h3>Messages</h3>
                <button
                    className="new-chat-btn"
                    onClick={() => setIsSearching(!isSearching)}
                >
                    {isSearching ? "✕" : "📝"}
                </button>
            </div>

            {isSearching && (
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search for users..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="chat-search-input"
                        autoFocus
                    />
                </div>
            )}

            <div className="conversation-items">
                {isSearching ? (
                    searchResults.length === 0 ? (
                        <div className="no-conversations">
                            {searchQuery.length < 2 ? "Type to search..." : "No users found"}
                        </div>
                    ) : (
                        searchResults.map((user) => (
                            <div
                                key={user._id}
                                className="conversation-item"
                                onClick={() => {
                                    onSelectConversation(user);
                                    setIsSearching(false);
                                    setSearchQuery("");
                                }}
                            >
                                <div className="conv-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="conv-info">
                                    <span className="conv-name">{user.name}</span>
                                    <span className="conv-role">{user.role}</span>
                                </div>
                            </div>
                        ))
                    )
                ) : conversations.length === 0 ? (
                    <div className="no-conversations">
                        <p>No recent messages</p>
                        <button
                            className="start-chat-prompt-btn"
                            onClick={() => setIsSearching(true)}
                        >
                            Start a new conversation
                        </button>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.user._id}
                            className="conversation-item"
                            onClick={() => onSelectConversation(conv.user)}
                        >
                            <div className="conv-avatar">
                                {conv.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="conv-info">
                                <div className="conv-name-row">
                                    <span className="conv-name">{conv.user.name}</span>
                                    {conv.unreadCount > 0 && (
                                        <span className="conv-unread-badge">{conv.unreadCount}</span>
                                    )}
                                </div>
                                <p className="conv-last-msg">{conv.lastMessage.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
