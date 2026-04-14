import React, { useState } from 'react';
import { 
    Download, 
    Search, 
    Filter, 
    Calendar, 
    Users, 
    Building, 
    ArrowLeft,
    IndianRupee,
    FileText,
    MapPin
} from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import axios from 'axios';
import BASE_URL from '../../../utils/apiConfig';
import { toast } from 'react-toastify';

const LandlordTransactionsView = ({ isDarkMode, payments, setActiveTab }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProperty, setFilterProperty] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const downloadReceipt = async (paymentId) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${BASE_URL}/api/payment/download-receipt/${paymentId}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Receipt downloaded");
        } catch (error) {
            console.error("Download failed", error);
            toast.error("Receipt not found or failed to generate");
        }
    };

    const properties = [...new Set(payments.map(p => p.property_name))];

    const filteredPayments = payments
        .filter(p => {
            const matchesSearch = 
                (p.tenant_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.receipt_number || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesProperty = filterProperty === 'all' || p.property_name === filterProperty;
            return matchesSearch && matchesProperty;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date || a.payment_date);
            const dateB = new Date(b.date || b.payment_date);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button 
                        onClick={() => setActiveTab('finance')}
                        className="flex items-center gap-2 text-violet-500 font-bold text-sm mb-2 hover:translate-x-1 transition-transform"
                    >
                        <ArrowLeft size={16} /> Back to Finance
                    </button>
                    <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Transaction History</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        All payments received across your portfolio
                    </p>
                </div>
                <div className="flex gap-2">
                    <LandlordButton variant="outline" icon={Download} isDarkMode={isDarkMode}>
                        Export CSV
                    </LandlordButton>
                </div>
            </div>

            {/* Filters Bar */}
            <Card isDarkMode={isDarkMode} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                        <input 
                            type="text"
                            placeholder="Search tenant or receipt..."
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-violet-500 outline-none transition-all ${
                                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Property Filter */}
                    <div className="relative">
                        <Building className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                        <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-violet-500 outline-none appearance-none transition-all ${
                                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            value={filterProperty}
                            onChange={(e) => setFilterProperty(e.target.value)}
                        >
                            <option value="all">All Properties</option>
                            {properties.map(prop => (
                                <option key={prop} value={prop}>{prop}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="relative">
                        <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                        <select 
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm border focus:ring-2 focus:ring-violet-500 outline-none appearance-none transition-all ${
                                isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* Total Info */}
                    <div className={`flex items-center justify-end px-4 font-bold text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {filteredPayments.length} Transactions Found
                    </div>
                </div>
            </Card>

            {/* Transactions List */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800/10 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse bg-transparent">
                    <thead>
                        <tr className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-slate-50'} border-b border-slate-800/10 dark:border-slate-800/50`}>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Receipt / Date</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tenant & Property</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800/50">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-4 rounded-full bg-slate-900/20 text-slate-500">
                                            <Search size={40} />
                                        </div>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No matching transactions found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((p, idx) => (
                                <tr key={p.id || idx} className={`group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-slate-900/40 text-slate-400 border border-slate-800">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className={`font-black text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.receipt_number || '#REC-000'}</p>
                                                <p className="text-[10px] font-bold text-slate-500">{new Date(p.date || p.payment_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{p.tenant_name || 'Anonymous'}</p>
                                            <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1"><MapPin size={10} /> {p.property_name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                            p.receipt_number?.startsWith('SEC-DEP') 
                                                ? 'bg-amber-500/10 text-amber-500' 
                                                : 'bg-violet-500/10 text-violet-500'
                                        }`}>
                                            {p.receipt_number?.startsWith('SEC-DEP') ? 'Security Deposit' : 'Monthly Rent'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className={`font-black text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Number(p.amount).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{p.status || 'PAID'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => downloadReceipt(p.id)}
                                            className={`p-2 rounded-xl transition-all ${
                                                isDarkMode 
                                                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white' 
                                                    : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                                            }`}
                                            title="Download PDF Receipt"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LandlordTransactionsView;

// Need MapPin import from lucide-react above
