import React from 'react';
import { Plus, MessageSquare, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { useTheme } from "../../../context/ThemeContext";

const ComplaintsPage = ({
    complaints,
    isDarkMode,
    navigate,
    userName,
    setShowComplaintModal,
    handleUpdateStatus
}) => {
    const { theme } = useTheme();
    // isDarkMode is passed as prop, but we can also use hook if needed.
    // Using prop to match signature.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaints</h2>
                <Button onClick={() => setShowComplaintModal(true)} icon={Plus}>New Complaint</Button>
            </div>

            <div className="grid gap-4">
                {complaints.length === 0 ? (
                    <div className={`text-center py-12 rounded-xl border border-dashed transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                        <p className="text-slate-500">No complaints found.</p>
                    </div>
                ) : (
                    complaints.map((req) => (
                        <Card key={req.id} onClick={() => navigate(`/${userName}/tenant/dashboard/complaints/${req.id}`)} className={`p-6 transition-all group hover:scale-[1.01] cursor-pointer`}>
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    {/* Cover: Use first proof image or fallback icon */}
                                    {req.images && req.images.length > 0 ? (
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                                            <img
                                                src={req.images[0]}
                                                alt="Proof"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`p-3 rounded-xl border shrink-0 transition-colors duration-500 ${req.status === 'Resolved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-200') : (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-700 border-amber-200')}`}>
                                            <MessageSquare size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-white group-hover:text-violet-400' : 'text-slate-900 group-hover:text-violet-600'}`}>{req.title}</h3>
                                        <p className="text-sm text-slate-500">{req.category} • Submitted on {req.date}</p>
                                        <p className={`text-sm mt-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{req.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-4">
                                        <StatusBadge status={req.status} />
                                        <div className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                                            <ChevronRight size={20} className="text-slate-500" />
                                        </div>
                                    </div>
                                    {req.status?.toLowerCase() !== 'resolved' && (
                                        <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                                            {['open', 'in progress'].includes(req.status?.toLowerCase()) && (
                                                <button
                                                    onClick={() => handleUpdateStatus(req.id, 'In Progress')}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                                >
                                                    In Progress
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleUpdateStatus(req.id, 'Resolved')}
                                                className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ComplaintsPage;
