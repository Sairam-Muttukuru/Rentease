import React from 'react';
import { Download, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '../ui/Button';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { useTheme } from "../../../context/ThemeContext";
import BASE_URL from "../../../utils/apiConfig";

const PaymentsPage = ({ payments }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const downloadReceipt = async (payment) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${BASE_URL}/api/payment/download-receipt/${payment.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob' // Important for PDF download
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Receipt_${payment.receipt_number || payment.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Receipt downloaded successfully");
        } catch (err) {
            console.error("Download failed", err);
            toast.error("Failed to download receipt");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment History</h2>
                <Button variant="secondary" icon={Download}>Statement</Button>
            </div>

            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b transition-colors duration-500`}>
                            <tr>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date</th>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</th>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Method</th>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Amount</th>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                                <th className={`px-6 py-4 font-semibold transition-colors duration-500 text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                            {payments.map((payment) => (
                                <tr key={payment.id} className={`transition-colors duration-200 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                                    <td className={`px-6 py-4 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {new Date(payment.date || payment.payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className={`px-6 py-4 font-medium transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                        {payment.receipt_number?.startsWith('SEC-DEP') ? 'Security Deposit' : 'Rent Payment'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{payment.method}</td>
                                    <td className={`px-6 py-4 font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => downloadReceipt(payment)}
                                            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-violet-500/20 text-violet-400' : 'hover:bg-violet-50 text-violet-600'}`}
                                            title="Download Receipt"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default PaymentsPage;
