import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Download, IndianRupee, Users, PieChart } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import RevenueLineChart from './charts/RevenueLineChart';
import RevenueTrendsChart from './charts/RevenueTrendsChart';

const LandlordFinanceView = ({ isDarkMode, tenants, onUpdateStatus }) => {
    const [realPayments, setRealPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await axios.get("http://localhost:5000/api/payment/landlord-payments", {
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
            const res = await axios.get(`http://localhost:5000/api/payment/download-receipt/${paymentId}`, {
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
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Total Revenue (YTD)</p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{realPayments.reduce((a, b) => a + Number(b.amount), 0).toLocaleString()}</h3>
                    <p className="text-xs text-slate-500 mt-2">+12% from last month</p>
                </Card>
                <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={100} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">Pending Payments</p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{tenants.filter(t => t.status !== 'PAID').reduce((sum, t) => sum + (parseFloat(t.monthly_rent) || 0), 0).toLocaleString()}</h3>
                    <p className="text-xs text-slate-500 mt-2">{tenants.filter(t => t.status !== 'PAID').length} Tenants Pending</p>
                </Card>
                <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><PieChart size={100} /></div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Collection Rate</p>
                    <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {tenants.length > 0 ? Math.round((tenants.filter(t => t.status === 'PAID').length / tenants.length) * 100) : 0}%
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">Target: 95%</p>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                <div className="lg:col-span-2 h-full">
                    <RevenueLineChart isDarkMode={isDarkMode} />
                </div>
                <div className="lg:col-span-1 h-full">
                    <RevenueTrendsChart isDarkMode={isDarkMode} />
                </div>
            </div>

            {/* Recent Transactions List */}
            <Card isDarkMode={isDarkMode} className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h3>
                    <LandlordButton variant="outline" className="text-xs h-8" isDarkMode={isDarkMode}>View All</LandlordButton>
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
        </div>
    );
};

export default LandlordFinanceView;
