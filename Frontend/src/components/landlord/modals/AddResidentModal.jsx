import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, User, Phone, Mail, UserPlus, Calendar, IndianRupee } from 'lucide-react';
import LandlordButton from '../common/LandlordButton';

const AddResidentModal = ({ isOpen, onClose, tenantId, propertyType, roomType, defaultRent, onResidentAdded, isDarkMode }) => {
    if (!isOpen) return null;

    const isShared = (propertyType || "").toUpperCase().includes('PG') || 
                     (propertyType || "").toUpperCase().includes('HOSTEL') || 
                     (roomType || "").toUpperCase().includes('SHARING') ||
                     (roomType || "").toUpperCase().includes('BACHELOR');

    const [formData, setFormData] = useState({
        full_name: "",
        relation: isShared ? "Roommate" : "Other",
        phone: "",
        email: "",
        lease_start: new Date().toISOString().split('T')[0],
        rent_amount: defaultRent || "",
        rent_due_day: "1"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.full_name) return;

        if (formData.phone && formData.phone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`/api/tenant-members/${tenantId}`, {
                ...formData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`${isShared ? 'Roommate' : 'Resident'} added successfully!`, {
                position: "top-center"
            });
            onResidentAdded();
            onClose();
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
                        Register a new occupant with their own rent terms
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                        <div className={`group flex items-center px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                            <User size={20} className="text-slate-400 group-focus-within:text-indigo-500 mr-4" />
                            <input
                                type="text"
                                placeholder="Verified full name"
                                className="bg-transparent border-none outline-none w-full text-base font-bold placeholder:text-slate-500"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Phone</label>
                            <div className={`flex items-center px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                                <input
                                    type="tel"
                                    placeholder="10-digit #"
                                    className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-500"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, phone: cleaned });
                                    }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Email</label>
                            <div className={`flex items-center px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800 focus-within:border-indigo-500' : 'bg-slate-50 border-slate-200 focus-within:border-indigo-500'}`}>
                                <input
                                    type="email"
                                    placeholder="Verified email"
                                    className="bg-transparent border-none outline-none w-full text-sm font-bold placeholder:text-slate-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rent & Due Day */}
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Monthly Rent (₹)</label>
                            <div className={`flex items-center px-5 py-3 rounded-2xl border-2 border-emerald-500/30 transition-all duration-300 ${isDarkMode ? 'bg-emerald-950/20' : 'bg-emerald-50'}`}>
                                <IndianRupee size={16} className="text-emerald-500 mr-2" />
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="bg-transparent border-none outline-none w-full text-sm font-black text-emerald-500 placeholder:text-emerald-500/50"
                                    value={formData.rent_amount}
                                    onChange={(e) => setFormData({ ...formData, rent_amount: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Rent Due Day (1-31)</label>
                            <div className={`flex items-center px-5 py-3 rounded-2xl border-2 border-amber-500/30 transition-all duration-300 ${isDarkMode ? 'bg-amber-950/20' : 'bg-amber-50'}`}>
                                <Calendar size={16} className="text-amber-500 mr-2" />
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    placeholder="1"
                                    className="bg-transparent border-none outline-none w-full text-sm font-black text-amber-600 placeholder:text-amber-500/50"
                                    value={formData.rent_due_day}
                                    onChange={(e) => setFormData({ ...formData, rent_due_day: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Move-in Date only */}
                    <div className="space-y-2">
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Move-in Date</label>
                        <div className={`flex items-center px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${isDarkMode ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                            <Calendar size={18} className="text-indigo-500 mr-3" />
                            <input
                                type="date"
                                className={`bg-transparent border-none outline-none w-full text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                value={formData.lease_start}
                                onChange={(e) => setFormData({ ...formData, lease_start: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
                        >
                            Cancel
                        </button>
                        <LandlordButton
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-4 rounded-2xl text-base font-black shadow-lg shadow-indigo-500/20"
                            isDarkMode={isDarkMode}
                        >
                            {isSubmitting ? 'Registering...' : `Add ${isShared ? 'Roommate' : 'Resident'}`}
                        </LandlordButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResidentModal;
