import React, { useState } from 'react';
import { useTheme } from "../../../context/ThemeContext";
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FileText, Download, Shield, AlertCircle, FileCheck, Calendar } from 'lucide-react';
import jsPDF from 'jspdf'; // Assuming installed for receipt download

const DocumentsPage = ({ user }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [activeTab, setActiveTab] = useState('lease');

    // Mock Documents Data (In real app, fetch from backend)
    const leaseDocuments = [
        { id: 1, title: 'Lease Agreement 2025-2026', date: 'Jan 15, 2025', type: 'PDF', size: '2.4 MB' },
        { id: 2, title: 'Property Condition Report', date: 'Jan 15, 2025', type: 'PDF', size: '1.8 MB' },
    ];

    const receipts = [
        { id: 101, title: 'Rent Receipt - February 2026', date: 'Feb 05, 2026', amount: user?.monthlyRent || 15000, status: 'Paid' },
        { id: 102, title: 'Rent Receipt - January 2026', date: 'Jan 05, 2026', amount: user?.monthlyRent || 15000, status: 'Paid' },
    ];

    const handleDownload = (doc) => {
        // Mock download
        alert(`Downloading ${doc.title}...`);
    };

    const generateReceipt = (receipt) => {
        // Simple receipt generation logic
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Rent Receipt", 105, 20, null, null, "center");
        doc.setFontSize(12);
        doc.text(`Receipt #: ${receipt.id}`, 20, 40);
        doc.text(`Date: ${receipt.date}`, 20, 50);
        doc.text(`Amount Paid: ₹${receipt.amount}`, 20, 60);
        doc.text(`Tenant: ${user?.name || "Tenant"}`, 20, 70);
        doc.text(`Status: ${receipt.status}`, 20, 80);
        doc.save(`${receipt.title}.pdf`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Documents & Records
                </h1>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Access and manage all your important rental documents securely.
                </p>
            </div>

            {/* Tabs */}
            <div className={`flex items-center gap-2 p-1 rounded-xl w-fit border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                {['lease', 'receipts', 'rules'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 capitalize
                            ${activeTab === tab
                                ? 'bg-violet-600 text-white shadow-lg'
                                : `${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                            }
                        `}
                    >
                        {tab === 'lease' ? 'Agreements' : tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid gap-6">

                {/* Lease Agreements Tab */}
                {activeTab === 'lease' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {leaseDocuments.map((doc) => (
                            <Card key={doc.id} className="group hover:border-violet-500/50 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800 text-violet-400' : 'bg-violet-50 text-violet-600'}`}>
                                        <FileCheck size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold mb-1 group-hover:text-violet-500 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.title}</h3>
                                        <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                                            <Calendar size={12} /> {doc.date} • {doc.size}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full flex items-center justify-center gap-2"
                                            onClick={() => handleDownload(doc)}
                                        >
                                            <Download size={14} /> Download PDF
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Card className={`border-dashed flex flex-col items-center justify-center py-12 text-center gap-4 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Need ID Proofs?</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">Your submitted ID proofs are stored securely with the property manager. Contact them for updates.</p>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Receipts Tab */}
                {activeTab === 'receipts' && (
                    <div className="space-y-4">
                        {receipts.map((receipt) => (
                            <Card key={receipt.id} className="flex items-center justify-between p-4 group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{receipt.title}</h3>
                                        <p className="text-sm text-slate-500">{receipt.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{receipt.amount.toLocaleString()}</span>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => generateReceipt(receipt)}
                                        title="Download Receipt"
                                    >
                                        <Download size={18} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Rules Tab */}
                {activeTab === 'rules' && (
                    <Card>
                        <div className="flex items-start gap-4 mb-6">
                            <AlertCircle size={24} className="text-amber-500 shrink-0 mt-1" />
                            <div>
                                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Community Guidelines & Rules</h3>
                                <p className="text-sm text-slate-500">Please adhere to these rules to maintain a peaceful living environment.</p>
                            </div>
                        </div>
                        <ul className={`space-y-4 list-disc pl-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li>Quiet hours are from 10:00 PM to 7:00 AM daily.</li>
                            <li>Garbage must be segregated and disposed of in designated bins only.</li>
                            <li>Guest parking is limited to 24 hours without prior pass.</li>
                            <li>Common areas (Pool, Gym) require booking for private events.</li>
                            <li>Modifications to the apartment structure are strictly prohibited.</li>
                        </ul>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default DocumentsPage;
