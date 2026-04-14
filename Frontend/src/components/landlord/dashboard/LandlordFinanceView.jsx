import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../utils/apiConfig';
import { toast } from 'react-toastify';
import { Download, IndianRupee, Users, PieChart, CheckCircle2, Home } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import RevenueTrendsChart from './charts/RevenueTrendsChart';

const LandlordFinanceView = ({ isDarkMode, tenants, onUpdateStatus, setActiveTab }) => {
    const [realPayments, setRealPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await axios.get(`${BASE_URL}/api/payment/landlord-payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRealPayments(res.data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoadingPayments(false);
        }
    };

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

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Overview</h2>
                    <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track revenue streams and payment statuses</p>
                </div>
                <LandlordButton icon={Download} variant="outline" isDarkMode={isDarkMode}>Export Report</LandlordButton>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><IndianRupee size={100} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Total Revenue (Year {new Date().getFullYear()})</p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹{realPayments.filter(p => {
                            const pYear = p.local_date ? p.local_date.split('-')[0] : new Date(p.date || p.payment_date).getFullYear().toString();
                            return pYear === new Date().getFullYear().toString() && !p.receipt_number?.startsWith('SEC-DEP');
                        }).reduce((a, b) => a + Number(b.amount), 0).toLocaleString()}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">Total payments collected YTD</p>
                </Card>
                <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={100} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">
                        {new Date().toLocaleString('default', { month: 'long' })} Pending Payments
                    </p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ₹{tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).reduce((sum, t) => sum + (parseFloat(t.balance_due) || 0), 0).toLocaleString()}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-slate-800/20 space-y-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unpaid Tenants</p>
                        {tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).length === 0 ? (
                             <p className="text-xs text-emerald-500 font-bold tracking-tight">✓ All Clean!</p>
                        ) : (
                            tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).slice(0, 4).map((t, i) => (
                                <div key={i} className="flex justify-between items-center text-[11px]">
                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{t.name || t.full_name || 'Tenant'}</span>
                                    <span className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Math.round(t.balance_due).toLocaleString()}</span>
                                </div>
                            ))
                        )}
                        {tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).length > 4 && (
                            <Link to="/landlord/dashboard/tenants" className="text-[10px] text-violet-500 hover:underline">+{tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).length - 4} more...</Link>
                        )}
                    </div>
                </Card>
                <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><PieChart size={100} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">{new Date().toLocaleString('default', { month: 'long' })} Collection Rate</p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {tenants.length > 0 ? Math.round((tenants.filter(t => t.status === 'PAID').length / tenants.length) * 100) : 0}%
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">Target: 95% efficiency</p>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="h-[400px]">
                <RevenueTrendsChart isDarkMode={isDarkMode} payments={realPayments.filter(p => !p.receipt_number?.startsWith('SEC-DEP'))} />
            </div>

            {/* Recent Transactions List */}
            <Card isDarkMode={isDarkMode} className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h3>
                    <LandlordButton variant="outline" className="text-xs h-8" isDarkMode={isDarkMode} onClick={() => setActiveTab('transactions')}>View All</LandlordButton>
                </div>
                <div className="space-y-4">
                    {loadingPayments ? (
                        <p className="text-slate-500 text-center py-4">Loading transactions...</p>
                    ) : realPayments.length === 0 ? (
                        <p className="text-slate-500 text-center py-4">No transactions recorded.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {realPayments.slice(0, 6).map((p, i) => (
                                <div key={p.id || i} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            <IndianRupee size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.tenant_name || 'Unknown Tenant'}</p>
                                            <p className="text-xs text-slate-500">{p.property_name} • {new Date(p.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Number(p.amount).toLocaleString()}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{p.status}</p>
                                        </div>
                                        <button
                                            onClick={() => downloadReceipt(p.id)}
                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                                            title="Download Receipt"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
            
            {/* Detailed Unpaid Tenants Ledger */}
            <Card isDarkMode={isDarkMode} className="p-8 border-rose-500/20 bg-rose-500/5">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
                            <Users className="text-rose-500" size={28} /> 
                            Arrears Monitoring <span className="text-rose-500/50">/ Unpaid Tenants</span>
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">Follow up with tenants who have outstanding balances.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4">
                                <th className="pb-2 pl-4">Tenant</th>
                                <th className="pb-2">Property / Room</th>
                                <th className="pb-2">Monthly Rent</th>
                                <th className="pb-2">Total Due</th>
                                <th className="pb-2 text-right pr-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <CheckCircle2 size={40} className="text-emerald-500" />
                                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Zero Arrears!</p>
                                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black">All tenants have cleared their dues.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tenants.filter(t => (parseFloat(t.balance_due) || 0) > 0).map((t, i) => (
                                    <tr key={i} className={`${isDarkMode ? 'bg-slate-900/60' : 'bg-white'} rounded-2xl shadow-sm overflow-hidden group hover:scale-[1.01] transition-all`}>
                                        <td className="py-4 pl-4 rounded-l-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-violet-500 border border-slate-700">
                                                    {(t.name || t.full_name || 'T')[0]}
                                                </div>
                                                <div>
                                                    <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.name || t.full_name}</p>
                                                    <p className="text-[10px] text-slate-500">{t.email || t.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                                                <Home size={12} className="text-violet-500" />
                                                <span className="truncate max-w-[150px]">{t.property_name || 'Assigned Property'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>₹{Number(t.monthly_rent || 0).toLocaleString()}</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-lg font-black text-rose-500 italic">₹{Number(t.balance_due).toLocaleString()}</p>
                                        </td>
                                        <td className="py-4 pr-4 text-right rounded-r-2xl">
                                            {/* Action button removed per user request */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default LandlordFinanceView;
