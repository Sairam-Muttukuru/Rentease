import React from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, AlertCircle, FileText, Camera, Download, Clock, Wrench } from 'lucide-react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';

const ComplaintDetail = ({
    complaints,
    isLoading,
    isDarkMode,
    navigate,
    userName,
    handleUpdateStatus,
}) => {
    const { id } = useParams();
    const complaint = complaints.find(c => c.id === parseInt(id));

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                <p className={`mt-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading details...</p>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
                <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                    <AlertCircle size={32} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Not Found</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>The complaint you are looking for does not exist or has been removed.</p>
                <button onClick={() => navigate(`/${userName}/tenant/dashboard/complaints`)} className="text-violet-500 hover:text-violet-400 font-medium mt-6 flex items-center gap-2">
                    <ChevronLeft size={16} /> Back to Complaints
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(`/${userName}/tenant/dashboard/complaints`)} className={`p-2 rounded-xl border transition-all duration-300 group ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm'}`}>
                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Details</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID: #{complaint.id}</p>
                </div>
            </div>

            <Card className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b dark:border-slate-800 border-slate-100">
                    <div>
                        <h3 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{complaint.title}</h3>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                            <StatusBadge status={complaint.status} />
                            <span className={`px-3 py-1 rounded-full border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{complaint.category}</span>
                            <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <Clock size={14} /> {complaint.date}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                                <FileText size={16} /> Description
                            </h4>
                            <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>{complaint.description}</p>
                        </div>

                        <div>
                            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                                <Camera size={16} /> Attached Evidence
                            </h4>
                            {complaint.images && complaint.images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {complaint.images.map((img, idx) => (
                                        <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border group cursor-zoom-in ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} onClick={() => window.open(img, '_blank')}>
                                            <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                                                    <Download size={20} className="text-slate-900" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={`p-8 rounded-xl border border-dashed text-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50 text-slate-500' : 'border-slate-300 bg-slate-50 text-slate-500'}`}>
                                    <p className="italic">No images attached to this complaint.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ticket Information</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
                                    <StatusBadge status={complaint.status} />
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Priority</span>
                                    <span className={`font-bold ${['High', 'Critical'].includes(complaint.priority_level) ? 'text-rose-500' : 'text-amber-500'}`}>
                                        {complaint.priority_level || 'Low'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 last:border-0 last:pb-0">
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Category</span>
                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{complaint.category}</span>
                                </div>
                            </div>
                        </div>

                        {complaint.status?.toLowerCase() !== 'resolved' && (
                            <div className={`p-6 mb-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Update Status</h4>
                                <div className="flex flex-col gap-3">
                                    {['open', 'in progress'].includes(complaint.status?.toLowerCase()) && (
                                        <Button
                                            onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                                            className="w-full justify-center bg-blue-600 hover:bg-blue-700 border-0"
                                        >
                                            Mark as In Progress
                                        </Button>
                                    )}
                                    <Button
                                        onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                                        className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 border-0"
                                    >
                                        Mark as Resolved
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                            <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>Professional Help Required?</h4>
                            <p className={`text-xs mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Book an expert professional to fix this issue immediately.</p>
                            <Button
                                onClick={() => navigate(`/${userName}/tenant/dashboard/services`, { state: { category: complaint.category } })}
                                className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 border-0 flex items-center gap-2"
                            >
                                <Wrench size={16} /> Book Service
                            </Button>
                        </div>

                        <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Timeline</h4>
                            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-violet-500 bg-white dark:bg-slate-900"></div>
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Submitted</p>
                                    <p className="text-xs text-slate-500">{complaint.date}</p>
                                </div>
                                {complaint.status !== 'Open' && (
                                    <div className="relative pl-8">
                                        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 ${complaint.status === 'Resolved' ? 'border-emerald-500' : 'border-amber-500'} bg-white dark:bg-slate-900`}></div>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Status Updated to {complaint.status}</p>
                                        <p className="text-xs text-slate-500">Recently</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ComplaintDetail;
