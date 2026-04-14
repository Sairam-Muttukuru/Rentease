import React, { useState } from 'react';
import { PencilLine, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const RequestedServices = ({ serviceRequests = [], fetchTenantData }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [editingId, setEditingId] = useState(null);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEditClick = (req) => {
        setEditingId(req.id);
        setComment(req.comment || '');
        setRating(req.rating || 0);
    };

    const handleSaveComment = async (id) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("accessToken");
            await axios.put(`/api/tenants/service-requests/${id}/comment`,
                { comment, rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Comment updated successfully");
            setEditingId(null);
            fetchTenantData();
        } catch (err) {
            toast.error("Failed to update comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'Pending': return <Clock size={16} className="text-amber-500" />;
            case 'Rejected': return <AlertCircle size={16} className="text-rose-500" />;
            default: return <Clock size={16} className="text-blue-500" />;
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Requested Services</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                    {serviceRequests.length} Total
                </span>
            </div>

            <div className="space-y-4">
                {serviceRequests.length === 0 ? (
                    <div className={`text-center py-8 border-2 border-dashed rounded-xl ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                        No service requests found
                    </div>
                ) : (
                    serviceRequests.map((req) => (
                        <div
                            key={req.id}
                            className={`p-4 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50' : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-md'}`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{req.service_name}</h4>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        Provider: <span className="font-medium">{req.provider_name || 'Not assigned'}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-opacity-10 text-xs font-semibold" style={{ backgroundColor: req.status === 'Completed' ? '#10b98120' : '#f59e0b20', color: req.status === 'Completed' ? '#10b981' : '#f59e0b' }}>
                                    {getStatusIcon(req.status)}
                                    {req.status}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4 text-xs">
                                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                    <span className="font-medium">Date:</span> {new Date(req.scheduled_date).toLocaleDateString()}
                                </span>
                                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                    <span className="font-medium">Time:</span> {req.scheduled_time}
                                </span>
                            </div>

                            <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                {editingId === req.id ? (
                                    <div className="space-y-3">
                                        <div className="flex gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`p-1 transition-colors ${star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                                        }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Add your comments here..."
                                            className={`w-full p-3 rounded-lg text-sm border focus:ring-2 outline-none transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:ring-violet-500/50' : 'bg-white border-slate-200 text-slate-900 focus:ring-violet-500/20'}`}
                                            rows="2"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSaveComment(req.id)}
                                                disabled={isSubmitting}
                                                className="bg-violet-600 hover:bg-violet-700 text-white"
                                            >
                                                {isSubmitting ? 'Saving...' : 'Save Review'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between group">
                                        <div className="flex flex-col gap-1">
                                            {req.rating > 0 && (
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 24 24"
                                                            fill="currentColor"
                                                            className={`w-4 h-4 ${i < req.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                                                }`}
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <MessageSquare size={16} className={`mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                                <p className={`text-sm italic ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {req.comment || 'No review yet...'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleEditClick(req)}
                                            className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                            title="Edit Review"
                                        >
                                            <PencilLine size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default RequestedServices;
