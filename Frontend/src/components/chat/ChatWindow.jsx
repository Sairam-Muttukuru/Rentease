import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

const ChatWindow = ({ isOpen, onClose, recipient, isDarkMode, currentUserRole = 'landlord' }) => {
    if (!isOpen || !recipient) return null;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi, I have a question.", sender: currentUserRole === 'landlord' ? 'tenant' : 'landlord', time: '10:30 AM' },
        { id: 2, text: "Sure, how can I help?", sender: currentUserRole, time: '10:32 AM' },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: currentUserRole,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate reply from the other party
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: prev.length + 1,
                    text: currentUserRole === 'landlord' ? "Thanks for the update!" : "I'll look into it.",
                    sender: currentUserRole === 'landlord' ? 'tenant' : 'landlord',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-md h-[600px] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>

                {/* Header */}
                <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500`}>
                                {recipient.avatar_url ? (
                                    <img src={recipient.avatar_url} alt={recipient.name} className="w-full h-full object-cover" />
                                ) : (
                                    recipient.name?.charAt(0)
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{recipient.name}</h3>
                            <p className="text-xs text-emerald-500 font-medium">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Information */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
                    <div className="text-center my-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>Today</span>
                    </div>

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === currentUserRole ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === currentUserRole
                                ? 'bg-violet-600 text-white rounded-br-none'
                                : isDarkMode
                                    ? 'bg-slate-800 text-slate-200 rounded-bl-none'
                                    : 'bg-white text-slate-800 rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.sender === currentUserRole ? 'text-violet-200' : 'text-slate-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className={`p-4 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <form onSubmit={handleSend} className="flex gap-2 items-center">
                        <button type="button" className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className={`flex-1 bg-transparent outline-none px-4 py-2 ${isDarkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'}`}
                        />
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className={`p-3 rounded-full bg-violet-600 text-white transition-all shadow-lg hover:shadow-violet-600/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Send size={18} className={message.trim() ? "translate-x-0.5" : ""} />
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ChatWindow;
