import React from 'react';
import { Download, FileText, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import Button from '../ui/Button';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { useTheme } from "../../../context/ThemeContext";
import BASE_URL from '../../../utils/apiConfig';

const PaymentsPage = ({ payments }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const downloadReceipt = async (payment) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${BASE_URL}/api/payment/download-receipt/${payment.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

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

    const downloadStatement = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // ── Header bar
            doc.setFillColor(109, 40, 217); // violet-700
            doc.rect(0, 0, pageWidth, 28, 'F');

            // Logo placeholder circle
            doc.setFillColor(255, 255, 255);
            doc.circle(20, 14, 8, 'F');
            doc.setTextColor(109, 40, 217);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('RE', 16.5, 16.5);

            // Company name
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('RentEase', 34, 12);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Smart Rental Management Platform', 34, 19);

            // Statement label on right
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text('PAYMENT STATEMENT', pageWidth - 15, 16, { align: 'right' });

            // ── Info block
            doc.setTextColor(30, 30, 30);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const now = new Date();

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            doc.text(`Tenant: ${user.name || user.first_name || '—'}`, 15, 38);
            doc.text(`Email: ${user.email || '—'}`, 15, 44);
            doc.text(`Generated: ${now.toLocaleString('en-IN')}`, pageWidth - 15, 38, { align: 'right' });
            doc.text(`Total Records: ${payments.length}`, pageWidth - 15, 44, { align: 'right' });

            // Separator line
            doc.setDrawColor(220, 220, 235);
            doc.setLineWidth(0.5);
            doc.line(15, 50, pageWidth - 15, 50);

            // ── Table headers
            const colX = [15, 55, 115, 145, 170];
            const headers = ['Date', 'Description', 'Method', 'Amount', 'Status'];

            doc.setFillColor(245, 243, 255); // light violet
            doc.rect(15, 54, pageWidth - 30, 8, 'F');
            doc.setTextColor(109, 40, 217);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            headers.forEach((h, i) => doc.text(h, colX[i], 59.5));

            // ── Table rows
            let y = 68;
            let totalAmount = 0;

            payments.forEach((payment, idx) => {
                if (y > 265) {
                    doc.addPage();
                    y = 20;
                }

                if (idx % 2 === 0) {
                    doc.setFillColor(250, 249, 255);
                    doc.rect(15, y - 5, pageWidth - 30, 9, 'F');
                }

                doc.setTextColor(50, 50, 50);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);

                const date = new Date(payment.date || payment.payment_date)
                    .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                const desc = payment.receipt_number?.startsWith('SEC-DEP') ? 'Security Deposit' : 'Rent Payment';
                const method = payment.method || 'Stripe';
                const amount = `Rs.${Number(payment.amount).toLocaleString('en-IN')}`;
                const status = payment.status || 'Paid';

                doc.text(date, colX[0], y);
                doc.text(desc, colX[1], y);
                doc.text(method, colX[2], y);
                doc.text(amount, colX[3], y);

                // Status badge color
                doc.setTextColor(status.toLowerCase() === 'paid' ? 4 : 180,
                    status.toLowerCase() === 'paid' ? 120 : 60,
                    status.toLowerCase() === 'paid' ? 87 : 0);
                doc.setFont('helvetica', 'bold');
                doc.text(status, colX[4], y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(50, 50, 50);

                totalAmount += Number(payment.amount) || 0;
                y += 9;
            });

            // ── Total row
            doc.setLineWidth(0.5);
            doc.setDrawColor(200, 200, 220);
            doc.line(15, y, pageWidth - 15, y);
            y += 7;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(109, 40, 217);
            doc.text('Total Amount Paid', colX[0], y);
            doc.text(`Rs.${totalAmount.toLocaleString('en-IN')}`, colX[3], y);

            // ── Footer
            const footerY = doc.internal.pageSize.getHeight() - 12;
            doc.setFillColor(245, 243, 255);
            doc.rect(0, footerY - 5, pageWidth, 20, 'F');
            doc.setFontSize(7.5);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(130, 100, 200);
            doc.text('RentEase — Smart Rental Management | This is a system-generated statement.', pageWidth / 2, footerY + 2, { align: 'center' });

            doc.save(`RentEase_Statement_${now.toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
            toast.success('Statement downloaded as PDF!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate statement');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment History</h2>
                <button
                    onClick={downloadStatement}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${isDarkMode
                        ? 'border-violet-500/40 text-violet-400 hover:bg-violet-500/15 hover:border-violet-400'
                        : 'border-violet-300 text-violet-700 hover:bg-violet-50 hover:border-violet-500'}`}
                >
                    <FileText size={16} />
                    Statement
                </button>
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
                                    <td className={`px-6 py-4 font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Number(payment.amount).toLocaleString()}</td>
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

