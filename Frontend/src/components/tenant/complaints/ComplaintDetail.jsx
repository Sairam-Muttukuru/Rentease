import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertCircle, FileText, Camera, X, Clock, Wrench } from 'lucide-react';
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

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (idx) => { setLightboxIndex(idx); setLightboxOpen(true); };
    const closeLightbox = () => setLightboxOpen(false);
    const prevImage = () => setLightboxIndex(i => (i - 1 + (complaint?.images?.length || 1)) % (complaint?.images?.length || 1));
    const nextImage = () => setLightboxIndex(i => (i + 1) % (complaint?.images?.length || 1));

    useEffect(() => {
        const handleKey = (e) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen, complaint]);

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
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/${userName}/tenant/dashboard/complaints`)} className={`p-2 rounded-xl border transition-all duration-300 group ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm'}`}>
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Details</h2>
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
                                            <div
                                                key={idx}
                                                className={`relative aspect-square rounded-xl overflow-hidden border group cursor-zoom-in ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`}
                                                onClick={() => openLightbox(idx)}
                                            >
                                                <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
                                        <StatusBadge status={complaint.status} />
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Priority</span>
                                        <span className={`font-bold ${['High', 'Critical'].includes(complaint.priority_level) ? 'text-rose-500' : 'text-amber-500'}`}>
                                            {complaint.priority_level || 'Low'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
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
                                            <Button onClick={() => handleUpdateStatus(complaint.id, 'In Progress')} className="w-full justify-center bg-blue-600 hover:bg-blue-700 border-0">
                                                Mark as In Progress
                                            </Button>
                                        )}
                                        <Button onClick={() => handleUpdateStatus(complaint.id, 'Resolved')} className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 border-0">
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

            {/* Lightbox Gallery Overlay */}
            {lightboxOpen && complaint.images && (
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center animate-in fade-in duration-200"
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                        onClick={closeLightbox}
                    >
                        <X size={24} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-4 py-1 rounded-full">
                        {lightboxIndex + 1} / {complaint.images.length}
                    </div>

                    {/* Prev */}
                    {complaint.images.length > 1 && (
                        <button
                            className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        >
                            <ChevronLeft size={28} />
                        </button>
                    )}

                    {/* Main image */}
                    <img
                        src={complaint.images[lightboxIndex]}
                        alt={`Evidence ${lightboxIndex + 1}`}
                        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Next */}
                    {complaint.images.length > 1 && (
                        <button
                            className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors z-10"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        >
                            <ChevronRight size={28} />
                        </button>
                    )}

                    {/* Thumbnail strip */}
                    {complaint.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {complaint.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                        idx === lightboxIndex ? 'border-violet-500 scale-110' : 'border-white/20 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ComplaintDetail;
