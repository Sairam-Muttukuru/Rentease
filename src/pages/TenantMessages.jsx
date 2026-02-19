import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Paperclip, Send, MessageCircle } from 'lucide-react';

const TenantMessages = () => {
    // Mock Data for Tenant (Chatting with Providers)
    const [conversations, setConversations] = useState([
        { id: 1, name: "Uzumaki Home Services", lastMessage: "I'll be there in 10 mins.", time: "10:30 AM", unread: 1, avatar: null, online: true, role: "Plumber" },
        { id: 2, name: "Reliable Electricians", lastMessage: "Service confirmed for tomorrow.", time: "Yesterday", unread: 0, avatar: null, online: false, role: "Electrician" },
        { id: 3, name: "City Cleaners", lastMessage: "Thanks for the feedback!", time: "Mon", unread: 0, avatar: null, online: true, role: "Cleaner" },
    ]);

    const [activeChat, setActiveChat] = useState(conversations[0]);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, sender: "me", text: "Hi, are you still available for the leak repair?", time: "10:00 AM" },
        { id: 2, sender: "other", text: "Yes, I'm on my way.", time: "10:05 AM" },
        { id: 3, sender: "other", text: "I'll be there in 10 mins.", time: "10:30 AM" },
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessageInput("");

        // Mock reply
        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                sender: "other",
                text: "Okay, got it!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
            {/* Chat List */}
            <div className="w-80 flex flex-col bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Messages</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-slate-700 dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/10 ${activeChat?.id === chat.id ? 'bg-violet-50 dark:bg-violet-900/20' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                    {chat.avatar ? <img src={chat.avatar} alt="" className="w-full h-full object-cover" /> : chat.name[0]}
                                </div>
                                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className={`font-bold text-sm truncate ${activeChat?.id === chat.id ? 'text-violet-900 dark:text-violet-100' : 'text-slate-800 dark:text-slate-200'}`}>{chat.name}</h4>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {activeChat.avatar ? <img src={activeChat.avatar} alt="" className="w-full h-full object-cover" /> : activeChat.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] rounded font-bold uppercase tracking-wider">{activeChat.role}</span>
                                        <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-violet-500 transition-colors rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="text-center text-xs text-slate-400 my-4 font-bold uppercase tracking-widest opacity-60">Today</div>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-3 shadow-md border ${msg.sender === 'me'
                                        ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-none border-violet-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border-slate-200 dark:border-slate-700'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] mt-1 block text-right font-medium opacity-70 ${msg.sender === 'me' ? 'text-violet-100' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all shadow-inner">
                                <button type="button" className="p-2 text-slate-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 h-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="p-2 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-600/20 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={40} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="font-bold">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantMessages;
