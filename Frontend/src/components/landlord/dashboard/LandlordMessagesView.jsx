import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Smile, Paperclip, CheckCheck, User, MessageSquarePlus, Trash2, ShieldAlert, UserX, Info } from 'lucide-react';
import axios from 'axios';
import { getSocket, initSocket } from '../../../utils/socket';

export default function LandlordMessagesView({ isDarkMode, tenants = [], currentUser }) {
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({}); // Track unread message counts heart
    const [lastMessages, setLastMessages] = useState({}); // Track snippet and time for sidebar heart
    const [isTyping, setIsTyping] = useState(false);
    
    const commonEmojis = ['😊', '😂', '👍', '🙏', '🙌', '🤝', '🏠', '🔑', '💰', '📅', '🔔', '✅', '❌', '❤️', '📍', '📞'];

    const [blockedTenants, setBlockedTenants] = useState(() => {
        const saved = localStorage.getItem('landlord_blocked_tenants');
        return saved ? JSON.parse(saved) : [];
    });

    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const socketRef = useRef(null);

    // Initial Socket Setup
    useEffect(() => {
        if (currentUser?.id) {
            const socket = initSocket(currentUser.id);
            socketRef.current = socket;

            socket.on("new_message", (msg) => {
                // Update active chat if open
                if (selectedTenant && msg.sender_id === selectedTenant.user_id) {
                    setMessages(prev => [...prev, {
                        id: msg.id,
                        text: msg.message_text,
                        sender: 'tenant',
                        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(msg.created_at).toLocaleDateString()
                    }]);
                }

                // Always update sidebar snippet and order heart
                setLastMessages(prev => ({
                    ...prev,
                    [msg.sender_id]: {
                        text: msg.message_text,
                        time: msg.created_at
                    }
                }));
            });

            socket.on("user_status_change", ({ userId, status }) => {
                setOnlineStatus(prev => ({ ...prev, [userId]: status }));
            });

            socket.on("display_typing", ({ senderId, isTyping }) => {
                if (selectedTenant && senderId == selectedTenant.user_id) {
                    setIsTyping(isTyping);
                }
            });

            socket.on("unread_update", ({ contact_id, unread_count }) => {
                setUnreadCounts(prev => ({ ...prev, [contact_id]: unread_count }));
            });

            return () => {
                socket.off("new_message");
                socket.off("user_status_change");
                socket.off("display_typing");
            };
        }
    }, [currentUser?.id, selectedTenant]);

    // Fetch initial online status for all contacts
    useEffect(() => {
        const fetchStatuses = async () => {
            tenants.forEach(async (t) => {
                try {
                    const res = await axios.get(`/api/messages/status/${t.user_id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                    });
                    setOnlineStatus(prev => ({ ...prev, [t.user_id]: res.data.status }));
                } catch (err) {
                    console.error("Error fetching status:", err);
                }
            });
        };
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`/api/messages/conversations`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                const messages = {};
                res.data.forEach(conv => {
                    messages[conv.contact_id] = {
                        text: conv.last_message,
                        time: conv.last_chat_time
                    };
                });
                setLastMessages(messages);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };

        const fetchUnreadCounts = async () => {
            try {
                const res = await axios.get(`/api/messages/unread-counts`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                const counts = {};
                res.data.forEach(item => {
                    counts[item.contact_id] = item.unread_count;
                });
                setUnreadCounts(counts);
            } catch (err) {
                console.error("Error fetching unread counts:", err);
            }
        };

        if (tenants.length > 0) {
            fetchStatuses();
            fetchUnreadCounts();
            fetchConversations();
        }
    }, [tenants.length]);

    // Filter and SORT tenants based on search and recent messages heart
    const filteredTenants = tenants
        .filter(t =>
            t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.phone?.includes(searchTerm)
        )
        .sort((a, b) => {
            const timeA = lastMessages[a.user_id]?.time || 0;
            const timeB = lastMessages[b.user_id]?.time || 0;
            return new Date(timeB) - new Date(timeA);
        });

    // Styles for hiding scrollbars
    useEffect(() => {
        const styleId = 'messages-no-scrollbar-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `;
            document.head.appendChild(style);
        }
    }, []);

    // Persistence for blocks
    useEffect(() => {
        localStorage.setItem('landlord_blocked_tenants', JSON.stringify(blockedTenants));
    }, [blockedTenants]);

    // Fetch messages for selected tenant
    const fetchMessages = async (contactId) => {
        if (!contactId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`/api/messages/chat/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const formattedMessages = res.data.map(m => ({
                id: m.id,
                text: m.message_text,
                sender: m.sender_id === currentUser?.id ? 'landlord' : 'tenant',
                timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date(m.created_at).toLocaleDateString()
            }));
            
            setMessages(formattedMessages);
        } catch (err) {
            console.error("Error fetching messages:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load messages when tenant changes
    useEffect(() => {
        if (selectedTenant && tenants.length > 0) {
            const updated = tenants.find(t => t.id === selectedTenant.id);
            if (updated && !updated.user_id && selectedTenant.user_id) {
                // Keep the existing user_id if the new one is missing (unlikely but safe)
            } else if (updated) {
                // Only update if it's actually different or missing crucial data
                if (updated.user_id !== selectedTenant.user_id) {
                    setSelectedTenant(updated);
                }
            }
        }
    }, [tenants]);

    useEffect(() => {
        if (selectedTenant) {
            fetchMessages(selectedTenant.user_id);
            setIsTyping(false);
            // Clear unread count for this tenant locally heart
            setUnreadCounts(prev => ({ ...prev, [selectedTenant.user_id]: 0 }));
        } else {
            setMessages([]);
        }
    }, [selectedTenant]);

    // Scroll to bottom on message update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedTenant || blockedTenants.includes(selectedTenant.id)) return;

        const text = message;
        setMessage('');
        setShowEmojiPicker(false);

        // Tell socket we stopped typing
        const socket = getSocket();
        if (socket) {
            socket.emit("typing", { receiverId: selectedTenant.user_id, isTyping: false });
        }

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(`/api/messages/send`, {
                receiverId: selectedTenant.user_id,
                text: text,
                propertyId: selectedTenant.property_id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Add local feedback
            const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, {
                id: res.data.id,
                text: text,
                sender: 'landlord',
                timestamp: timestamp,
                date: new Date().toLocaleDateString()
            }]);

            // Update sidebar for landlord's own message heart
            setLastMessages(prev => ({
                ...prev,
                [selectedTenant.user_id]: {
                    text: text,
                    time: new Date().toISOString()
                }
            }));
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message. Please ensure the page is refreshed and you are connected. " + (err.response?.data?.message || err.message));
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        const socket = getSocket();
        if (socket && selectedTenant) {
            socket.emit("typing", { 
                receiverId: selectedTenant.user_id, 
                isTyping: e.target.value.length > 0 
            });
        }
    };

    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji);
    };

    const handleBlockTenant = () => {
        if (!selectedTenant) return;
        setBlockedTenants(prev =>
            prev.includes(selectedTenant.id)
                ? prev.filter(id => id !== selectedTenant.id)
                : [...prev, selectedTenant.id]
        );
        setIsMenuOpen(false);
    };

    const handleClearChat = () => {
        if (!selectedTenant) return;
        if (window.confirm(`Are you sure you want to clear the chat with ${selectedTenant.name}?`)) {
            setMessages([]);
        }
        setIsMenuOpen(false);
    };

    const isBlocked = selectedTenant && blockedTenants.includes(selectedTenant.id);
    const activeMessages = messages;

    return (
        <div className={`flex h-[calc(100vh-190px)] w-full max-w-7xl mx-auto mt-12 rounded-3xl border overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 ${isDarkMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-xl' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>

            {/* Sidebar (Contacts) */}
            <div className={`w-80 md:w-96 flex flex-col border-r ${isDarkMode ? 'border-white/5 bg-slate-900/40' : 'border-slate-100 bg-slate-50/30'}`}>
                {/* Search Header */}
                <div className={`p-5 border-b ${isDarkMode ? 'border-white/5 bg-slate-900/60' : 'border-slate-100 bg-white/50'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Messages</h2>
                        <div className="flex gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                {currentUser?.avatar_url ? (
                                    <img src={currentUser.avatar_url} alt="Me" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs bg-indigo-600">
                                        {currentUser?.name?.charAt(0) || 'L'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`flex items-center px-4 py-2.5 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'border-white/10 bg-slate-800/50 focus-within:border-indigo-500/50 focus-within:bg-slate-800' : 'border-slate-200 bg-white/80 focus-within:border-indigo-500 focus-within:shadow-sm'}`}>
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search tenants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredTenants.length > 0 ? (
                        filteredTenants.map(tenant => {
                            const blocked = blockedTenants.includes(tenant.id);
                            const status = onlineStatus[tenant.user_id] || "offline";
                            return (
                                <button
                                    key={tenant.id}
                                    onClick={() => setSelectedTenant(tenant)}
                                    className={`w-full p-4 flex items-center gap-4 transition-all duration-300 hover:bg-white/5 dark:hover:bg-white/5 text-left border-b ${isDarkMode ? 'border-white/[0.03]' : 'border-slate-50'} ${selectedTenant?.id === tenant.id ? (isDarkMode ? 'bg-indigo-600/10 dark:bg-indigo-600/10 shadow-inner ring-1 ring-white/10' : 'bg-white shadow-sm ring-1 ring-slate-100') : ''}`}
                                >
                                    <div className="relative">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 p-0.5 transition-transform duration-300 group-hover:scale-105 ${isDarkMode ? 'border-white/10 shadow-lg shadow-black/20' : 'border-white shadow-md'}`}>
                                            <div className="w-full h-full rounded-full overflow-hidden">
                                                {tenant.avatar_url ? (
                                                    <img src={tenant.avatar_url} alt={tenant.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className={`w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${blocked ? 'from-slate-500 to-slate-600' : 'from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20'}`}>
                                                        {tenant.name?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!blocked && status === "online" && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>}
                                        {blocked && <div className="absolute bottom-0 right-0 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"><ShieldAlert size={10} className="text-white" /></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{tenant.name}</h3>
                                            {lastMessages[tenant.user_id]?.time && (
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {new Date(lastMessages[tenant.user_id].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-xs truncate flex items-center gap-1 ${unreadCounts[tenant.user_id] > 0 ? (isDarkMode ? 'text-indigo-400 font-medium' : 'text-indigo-600 font-medium') : 'text-slate-500 dark:text-slate-400'}`}>
                                            {blocked ? 'Blocked' : (lastMessages[tenant.user_id]?.text || (status === "online" ? "Online" : "Last seen recently"))}
                                        </p>
                                    </div>
                                    {!blocked && unreadCounts[tenant.user_id] > 0 && (
                                        <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-in zoom-in duration-300">
                                            <span className="text-[10px] font-bold text-white">{unreadCounts[tenant.user_id]}</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400 space-y-2 opacity-60">
                            <User className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm font-medium">No tenants found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedTenant ? (
                <div className={`flex-1 flex flex-col relative ${isDarkMode ? 'bg-slate-950/20' : 'bg-slate-100/30'}`}>
                    {/* Chat Header */}
                    <div className={`p-4 flex items-center justify-between border-b shadow-sm z-10 ${isDarkMode ? 'border-white/5 bg-slate-900/60 backdrop-blur-xl' : 'border-slate-100 bg-white/60 backdrop-blur-md'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border ${isDarkMode ? 'border-slate-700 shadow-lg shadow-black/20' : 'border-slate-200 shadow-md'}`}>
                                {selectedTenant.avatar_url ? (
                                    <img src={selectedTenant.avatar_url} alt={selectedTenant.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${isBlocked ? 'from-slate-500 to-slate-600' : 'from-indigo-500 to-blue-600'}`}>
                                        {selectedTenant.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedTenant.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    {isTyping ? (
                                        <span className="text-[10px] text-indigo-500 font-medium animate-pulse">Typing...</span>
                                    ) : !isBlocked && onlineStatus[selectedTenant.user_id] === "online" ? (
                                        <>
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] text-emerald-500 font-medium">Active now</span>
                                        </>
                                    ) : (
                                        <span className="text-[10px] text-slate-500 font-medium">{isBlocked ? 'Tenant Blocked' : 'Offline'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                            >
                                <MoreVertical size={20} />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div className={`absolute right-0 top-12 w-48 rounded-xl shadow-2xl border z-20 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                    <button
                                        onClick={handleBlockTenant}
                                        className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 ${isBlocked ? 'text-emerald-500' : 'text-red-500'}`}
                                    >
                                        {isBlocked ? <ShieldAlert size={16} /> : <UserX size={16} />}
                                        {isBlocked ? 'Unblock Tenant' : 'Block Tenant'}
                                    </button>
                                    <button
                                        onClick={handleClearChat}
                                        className={`w-full px-4 py-3 flex items-center gap-3 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                                    >
                                        <Trash2 size={16} />
                                        Clear Chat
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                        {activeMessages.length > 0 ? (
                            activeMessages.map((msg, i) => {
                                const isFirstOfDay = i === 0 || msg.date !== activeMessages[i - 1].date;
                                return (
                                    <React.Fragment key={msg.id}>
                                        {isFirstOfDay && (
                                            <div className="text-center my-4">
                                                <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                                                    {msg.date === new Date().toLocaleDateString() ? 'Today' : msg.date}
                                                </span>
                                            </div>
                                        )}
                                        <div className={`flex ${msg.sender === 'landlord' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative group animate-in slide-in-from-${msg.sender === 'landlord' ? 'right' : 'left'}-4 duration-300 ${msg.sender === 'landlord'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : isDarkMode
                                                    ? 'bg-slate-800 text-slate-200 rounded-bl-none'
                                                    : 'bg-white text-slate-800 rounded-bl-none'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                                <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                                    <span className="text-[10px]">{msg.timestamp}</span>
                                                    {msg.sender === 'landlord' && <CheckCheck size={12} />}
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <MessageSquarePlus className="w-8 h-8 text-slate-400 mb-4" />
                                <h4 className="font-bold text-slate-500">No messages yet</h4>
                                <p className="text-xs text-slate-400">Say hi to {selectedTenant.name}!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Area */}
                    <div className={`p-5 border-t ${isDarkMode ? 'border-white/5 bg-slate-900/60 backdrop-blur-xl' : 'border-slate-100 bg-white/60 backdrop-blur-md'}`}>
                        {isBlocked ? (
                            <div className={`p-3 rounded-xl text-center text-sm font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                Unblock {selectedTenant.name} to send messages
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
                                <div className="flex gap-1 relative" ref={emojiPickerRef}>
                                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        <Smile size={20} />
                                    </button>
                                    {showEmojiPicker && (
                                        <div className={`absolute bottom-full left-0 mb-4 p-3 rounded-2xl shadow-2xl border z-30 grid grid-cols-4 gap-2 w-48 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                                            {commonEmojis.map(emoji => (
                                                <button key={emoji} type="button" onClick={() => addEmoji(emoji)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xl">
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className={`flex-1 flex items-center px-4 py-2.5 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'border-white/10 bg-slate-800/40 focus-within:border-indigo-500/50 focus-within:bg-slate-800/60' : 'border-slate-200 bg-slate-50/50 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-sm'}`}>
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={handleTyping}
                                        placeholder="Type a message..."
                                        className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-500 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <button type="submit" disabled={!message.trim()} className="p-3 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-50">
                                    <Send size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4 ${isDarkMode ? 'bg-slate-950/20' : 'bg-slate-50/50'}`}>
                    <MessageSquarePlus size={64} className="text-indigo-600/40 mb-4" />
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rentease Messages</h2>
                    <p className={`text-sm max-w-sm mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a tenant to start a real-time conversation.</p>
                </div>
            )}
        </div>
    );
}
