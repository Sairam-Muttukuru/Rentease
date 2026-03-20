import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Smile, Paperclip, CheckCheck, User, MessageSquarePlus, Trash2, ShieldAlert, UserX, Info } from 'lucide-react';
import axios from 'axios';
import { getSocket, initSocket } from '../../../utils/socket';

export default function TenantMessagesView({ isDarkMode, currentUser, allProperties = [] }) {
    const [selectedLandlord, setSelectedLandlord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState({});
    const [unreadCounts, setUnreadCounts] = useState({}); // Track unread counts heart
    const [lastMessages, setLastMessages] = useState({}); // Track snippet and time heart
    const [isTyping, setIsTyping] = useState(false);
    
    const commonEmojis = ['😊', '😂', '👍', '🙏', '🙌', '🤝', '🏠', '🔑', '💰', '📅', '🔔', '✅', '❌', '❤️', '📍', '📞'];

    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const socketRef = useRef(null);

    // Extract unique landlords from properties
    const landlords = Array.from(new Map(allProperties.map(p => [p.landlord_id, {
        id: p.landlord_id,
        user_id: p.landlord_id,
        name: p.landlord_name,
        email: p.landlord_email,
        propertyName: p.property_name,
        avatar_url: p.landlord_avatar_url // We might need to ensure this is fetched
    }])).values());

    // Filter and SORT landlords heart
    const filteredLandlords = landlords
        .filter(l =>
            l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.propertyName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const timeA = lastMessages[a.user_id]?.time || 0;
            const timeB = lastMessages[b.user_id]?.time || 0;
            return new Date(timeB) - new Date(timeA);
        });

    // Initialize Socket
    useEffect(() => {
        if (currentUser?.id) {
            const socket = initSocket(currentUser.id);
            socketRef.current = socket;

            socket.on("new_message", (msg) => {
                if (selectedLandlord && msg.sender_id === selectedLandlord.user_id) {
                    setMessages(prev => [...prev, {
                        id: msg.id,
                        text: msg.message_text,
                        sender: 'landlord',
                        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(msg.created_at).toLocaleDateString()
                    }]);
                }

                // Update sidebar snippet heart
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
                if (selectedLandlord && senderId == selectedLandlord.user_id) {
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
    }, [currentUser?.id, selectedLandlord]);

    // Fetch initial online status
    useEffect(() => {
        const fetchStatuses = async () => {
            landlords.forEach(async (l) => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/messages/status/${l.user_id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                    });
                    setOnlineStatus(prev => ({ ...prev, [l.user_id]: res.data.status }));
                } catch (err) {
                    console.error("Error fetching status:", err);
                }
            });
        };
        const fetchConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/conversations`, {
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
                const res = await axios.get(`http://localhost:5000/api/messages/unread-counts`, {
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

        if (landlords.length > 0) {
            fetchStatuses();
            fetchUnreadCounts();
            fetchConversations();
        }
    }, [landlords.length]);

    // Fetch messages for selected landlord
    const fetchMessages = async (contactId) => {
        if (!contactId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`http://localhost:5000/api/messages/chat/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const formattedMessages = res.data.map(m => ({
                id: m.id,
                text: m.message_text,
                sender: m.sender_id === currentUser?.id ? 'tenant' : 'landlord',
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

    useEffect(() => {
        if (selectedLandlord) {
            fetchMessages(selectedLandlord.user_id);
            setIsTyping(false);
            // Clear unread count locally heart
            setUnreadCounts(prev => ({ ...prev, [selectedLandlord.user_id]: 0 }));
        } else {
            setMessages([]);
        }
    }, [selectedLandlord]);

    // Close emoji picker when clicking outside heart
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedLandlord) return;

        const text = message;
        setMessage('');
        setShowEmojiPicker(false);
        
        const socket = getSocket();
        if (socket) {
            socket.emit("typing", { receiverId: selectedLandlord.user_id, isTyping: false });
        }

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(`http://localhost:5000/api/messages/send`, {
                receiverId: selectedLandlord.user_id,
                text: text
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Add my own message to UI immediately or wait for Socket? 
            // Better to add manually for instant feedback
            setMessages(prev => [...prev, {
                id: res.data.id,
                text: text,
                sender: 'tenant',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString()
            }]);

            // Update sidebar snippet heart
            setLastMessages(prev => ({
                ...prev,
                [selectedLandlord.user_id]: {
                    text: text,
                    time: new Date().toISOString()
                }
            }));
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message: " + (err.response?.data?.message || err.message));
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);
        const socket = getSocket();
        if (socket && selectedLandlord) {
            socket.emit("typing", { 
                receiverId: selectedLandlord.user_id, 
                isTyping: e.target.value.length > 0 
            });
        }
    };

    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji);
    };

    return (
        <div className={`flex h-[calc(100vh-140px)] w-full rounded-3xl border overflow-hidden shadow-2xl transition-all duration-500 animate-in fade-in zoom-in-95 ${isDarkMode ? 'bg-slate-900/60 border-white/5 backdrop-blur-xl' : 'bg-white border-slate-200'}`}>
            {/* Sidebar */}
            <div className={`w-80 md:w-96 flex flex-col border-r ${isDarkMode ? 'border-white/5 bg-slate-900/40' : 'border-slate-100 bg-slate-50/30'}`}>
                <div className={`p-5 border-b ${isDarkMode ? 'border-white/5 bg-slate-900/60' : 'border-slate-100 bg-white/50'}`}>
                    <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>My Landlords</h2>
                    <div className={`flex items-center px-4 py-2.5 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'border-white/10 bg-slate-800/50 focus-within:border-indigo-500/50 focus-within:bg-slate-800' : 'border-slate-200 bg-white/80 focus-within:border-indigo-500 focus-within:shadow-sm'}`}>
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search landlords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredLandlords.map(landlord => (
                        <button
                            key={landlord.id}
                            onClick={() => setSelectedLandlord(landlord)}
                            className={`w-full p-4 flex items-center gap-3 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 text-left border-b ${isDarkMode ? 'border-slate-800/40' : 'border-slate-50'} ${selectedLandlord?.id === landlord.id ? (isDarkMode ? 'bg-slate-800 shadow-inner' : 'bg-white shadow-sm ring-1 ring-slate-100') : ''}`}
                        >
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 p-0.5 transition-transform duration-300 group-hover:scale-105 ${isDarkMode ? 'border-white/10 shadow-lg shadow-black/20' : 'border-white shadow-md'}`}>
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        {landlord.avatar_url ? (
                                            <img src={landlord.avatar_url} alt={landlord.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
                                                {landlord.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {onlineStatus[landlord.user_id] === "online" && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{landlord.name}</h3>
                                    {lastMessages[landlord.user_id]?.time && (
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(lastMessages[landlord.user_id].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs truncate ${unreadCounts[landlord.user_id] > 0 ? (isDarkMode ? 'text-indigo-400 font-medium' : 'text-indigo-600 font-medium') : 'text-slate-500 dark:text-slate-400'}`}>
                                    {lastMessages[landlord.user_id]?.text || landlord.propertyName}
                                </p>
                            </div>
                            {unreadCounts[landlord.user_id] > 0 && (
                                <div className="min-w-[20px] h-5 px-1.5 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-in zoom-in duration-300">
                                    <span className="text-[10px] font-bold text-white">{unreadCounts[landlord.user_id]}</span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            {selectedLandlord ? (
                <div className={`flex-1 flex flex-col relative ${isDarkMode ? 'bg-slate-950/20' : 'bg-slate-100/30'}`}>
                    <div className={`p-4 flex items-center justify-between border-b shadow-sm z-10 ${isDarkMode ? 'border-white/5 bg-slate-900/60 backdrop-blur-xl' : 'border-slate-100 bg-white/60 backdrop-blur-md'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 p-0.5 ${isDarkMode ? 'border-white/10 shadow-lg shadow-black/20' : 'border-white shadow-md'}`}>
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    {selectedLandlord.avatar_url ? (
                                        <img src={selectedLandlord.avatar_url} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold">
                                            {selectedLandlord.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedLandlord.name}</h3>
                                <div className="flex items-center gap-1.5">
                                    {isTyping ? (
                                        <span className="text-[10px] text-indigo-500 font-medium animate-pulse">Typing...</span>
                                    ) : onlineStatus[selectedLandlord.user_id] === "online" ? (
                                        <><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><span className="text-[10px] text-emerald-500 font-medium">Online</span></>
                                    ) : (
                                        <span className="text-[10px] text-slate-500 font-medium">Offline</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar relative">
                        {messages.map((msg, i) => {
                            const isFirstOfDay = i === 0 || msg.date !== messages[i - 1].date;
                            return (
                                <React.Fragment key={msg.id}>
                                    {isFirstOfDay && (
                                        <div className="text-center my-4">
                                            <span className="text-[10px] px-3 py-1 rounded-full font-medium bg-slate-200 text-slate-500">{msg.date}</span>
                                        </div>
                                    )}
                                    <div className={`flex ${msg.sender === 'tenant' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm relative group animate-in slide-in-from-${msg.sender === 'tenant' ? 'right' : 'left'}-4 duration-300 ${msg.sender === 'tenant'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'
                                                : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                            <div className="flex items-center justify-end gap-1 mt-1 opacity-70">
                                                <span className="text-[10px]">{msg.timestamp}</span>
                                                {msg.sender === 'tenant' && <CheckCheck size={12} />}
                                            </div>
                                        </div>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={`p-5 border-t ${isDarkMode ? 'border-white/5 bg-slate-900/60 backdrop-blur-xl' : 'border-slate-100 bg-white/60 backdrop-blur-md'}`}>
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
                            <div className="flex gap-1 relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <Smile size={20} />
                                </button>
                                {showEmojiPicker && (
                                    <div className={`absolute bottom-full left-0 mb-4 p-3 rounded-2xl shadow-2xl border z-30 grid grid-cols-4 gap-2 w-48 ${isDarkMode ? 'bg-slate-800 border-white/5' : 'bg-white border-slate-100'}`}>
                                        {commonEmojis.map(emoji => (
                                            <button key={emoji} type="button" onClick={() => addEmoji(emoji)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors text-xl">
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
                            <button type="submit" disabled={!message.trim()} className="p-3 rounded-full bg-indigo-600 text-white shadow-lg disabled:opacity-50 transition-all active:scale-95"><Send size={18} /></button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-40">
                    <MessageSquarePlus size={64} className="mb-4 text-indigo-600" />
                    <h2 className="text-2xl font-bold">Select a landlord to start chatting</h2>
                </div>
            )}
        </div>
    );
}
