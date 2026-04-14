import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, User, Users, Phone, Mail, ChevronDown, UserPlus } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const AddResidentModal = ({ isOpen, onClose, tenantId, propertyType, roomType, onResidentAdded, isDarkMode }) => {
    if (!isOpen) return null;

    const isShared = (propertyType || "").toUpperCase().includes('PG') || 
                     (propertyType || "").toUpperCase().includes('HOSTEL') || 
                     (roomType || "").toUpperCase().includes('SHARING') ||
                     (roomType || "").toUpperCase().includes('BACHELOR');

    const [formData, setFormData] = useState({
        full_name: "",
        relation: isShared ? "Roommate" : "Other",
        phone: "",
        email: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name) return;
        
        // 🚨 Strict Email Validation for PGs/Bachelors
        if (isShared && !formData.email) {
            toast.warning("Email is mandatory for Bachelor/PG roommates!", {
                position: "top-center",
                theme: "colored"
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const payload = {
                full_name: formData.full_name,
                phone: formData.phone || null,
                relation: isShared ? "Roommate" : formData.relation,
                email: formData.email, // Mandatory for PGs
            };

            await axios.post(
                `/api/tenants/${tenantId}/members`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onResidentAdded();
            onClose();
            toast.success(isShared ? "Roommate registered!" : "Resident added successfully");
        } catch (error) {
            console.error("Error adding resident:", error);
            const errMsg = error.response?.data?.error || error.response?.data?.message || "Registration failed";
            toast.error(errMsg, {
                position: "top-center",
                autoClose: 8000,
                theme: "colored"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`w-full max-w-md overflow-hidden rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-100'}`} onClick={(e) => e.stopPropagation()}>
                
                {/* Header Section */}
                <div className="relative px-8 pt-10 pb-6 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-500/10 transition-colors text-slate-400"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-3xl bg-indigo-500/10 text-indigo-500">
                        <UserPlus size={32} />
                    </div>
                    
                    <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {isShared ? 'New Roommate' : 'New Resident'}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Enter details to register a new occupant
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Full Name</label>
                        <div className={`group flex items-center px-5 py-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5'}`}>
                            <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors mr-4" />
                            <input
                                type="text"
                                placeholder="Verified full name"
                                className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-500"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Relation Field (Simplified) */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Relation</label>
                        <div className={`flex items-center px-5 py-4 rounded-2xl border transition-all duration-300 ${isShared ? 'bg-indigo-500/5 border-indigo-500/20' : isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                            <Users size={18} className="text-slate-400 mr-4" />
                            {isShared ? (
                                <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">Roommate</span>
                            ) : (
                                <select
                                    className={`bg-transparent border-none outline-none w-full text-sm font-bold appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-900'} [&>option]:text-slate-900`}
                                    value={formData.relation}
                                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                >
                                    <option value="Other">Other</option>
                                    <option value="Husband">Husband</option>
                                    <option value="Wife">Wife</option>
                                    <option value="Son">Son</option>
                                    <option value="Daughter">Daughter</option>
                                    <option value="Friend">Friend</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Phone Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Phone</label>
                            <div className={`flex items-center px-5 py-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                                <input
                                    type="tel"
                                    placeholder="Optional"
                                    className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                                Email {isShared && <span className="text-indigo-500">★</span>}
                            </label>
                            <div className={`flex items-center px-5 py-4 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500/50' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                                <input
                                    type="email"
                                    placeholder={isShared ? "Required" : "Optional"}
                                    className={`bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-500 ${isShared ? 'text-indigo-400' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required={isShared}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            {isSubmitting ? 'Registering...' : (isShared ? 'Confirm Roommate' : 'Add Resident')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResidentModal;
