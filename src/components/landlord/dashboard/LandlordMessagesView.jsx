import React, { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandlordMessagesView({ isDarkMode }) {
    const [activeTab, setActiveTab] = useState('View All');
    
    const tabs = ['View All', 'Inquiries', 'Tours', 'Applicants', 'Tenants'];

    return (
        <div className={`flex flex-col h-[calc(100vh-120px)] ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'} w-[90%] lg:w-[100%] max-w-7xl mx-auto rounded-xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} shadow-sm overflow-hidden animate-in fade-in duration-500`}>
            {/* Zillow-style Header */}
            <div className={`p-4 md:p-6 border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <h1 className="text-3xl font-serif text-slate-900 dark:text-white tracking-tight">Messages</h1>
                        
                        {/* Tabs */}
                        <div className="flex gap-6 overflow-x-auto no-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap pb-1 font-medium text-sm transition-colors relative ${activeTab === tab ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border font-semibold text-sm transition-colors ${isDarkMode ? 'border-blue-500/30 text-blue-400 hover:bg-blue-900/20' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>
                        <button className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border font-semibold text-sm transition-colors ${isDarkMode ? 'border-blue-500/30 text-blue-400 hover:bg-blue-900/20' : 'border-blue-200 text-blue-600 hover:bg-blue-50'}`}>
                            Inbox
                            <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Zillow-style 3 Column Layout */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Column 1: Inbox List */}
                <div className={`w-1/3 min-w-[300px] border-r flex flex-col ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-white'}`}>
                    <div className="p-4">
                        <div className={`flex items-center px-3 py-2 rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-300 bg-white'}`}>
                            <input 
                                type="text" 
                                placeholder="Search by name, phone #" 
                                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-500"
                            />
                            <Search className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                    
                    {/* Empty State for Inbox list */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-8 text-slate-500 dark:text-slate-400">
                        <div className="w-16 h-16 mb-4 flex relative opacity-30 dark:opacity-50">
                            {/* SVG mimicking Zillow's double speech bubble empty state */}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-blue-400 absolute top-0 left-0">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-cyan-400 absolute bottom-0 right-0 bg-white dark:bg-slate-950 rounded-bl-xl">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <p className="text-sm">When a renter messages you about a property, it will show up here.</p>
                    </div>
                </div>

                {/* Column 2: Active Chat Area */}
                <div className={`flex-1 border-r flex flex-col justify-center items-center text-center p-8 bg-slate-50 dark:bg-slate-900/10 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    <p className="text-slate-500 dark:text-slate-400 mb-2 font-medium">No messages in your inbox to show.</p>
                    <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Go to My Properties</button>
                </div>

                {/* Column 3: Renter Info Panel */}
                <div className={`w-1/4 min-w-[250px] flex flex-col justify-center items-center text-center p-6 ${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
                    <p className="text-sm text-slate-500 dark:text-slate-400">See more information on a potential renter here.</p>
                </div>

            </div>
        </div>
    );
}
