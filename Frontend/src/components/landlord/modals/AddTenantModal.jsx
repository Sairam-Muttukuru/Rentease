import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const AddTenantModal = ({ isOpen, onClose, properties, onSuccess, isDarkMode, prefill = null }) => {
    const [formData, setFormData] = useState({
        propertyId: "",
        full_name: "",
        email: "",
        phone: "",
        relation: "Self",
        tenant_type: "Family",
        monthly_rent: "",
        payment_status: "PENDING",
        start_date: "",
        rent_due_date: ""
    });

    useEffect(() => {
        if (isOpen && prefill) {
            setFormData(prev => ({
                ...prev,
                propertyId: prefill.propertyId || "",
                full_name: prefill.tenantName || "",
                email: prefill.email || "",
                phone: prefill.phone || "",
                monthly_rent: prefill.monthly_rent || ""
            }));
            
            // If propertyId is prefilled, find its rent
            if (prefill.propertyId) {
                const selectedProp = properties.find(p => p.id == prefill.propertyId);
                if (selectedProp) {
                    setFormData(prev => ({ ...prev, monthly_rent: selectedProp.price }));
                }
            }
        } else if (isOpen && !prefill) {
            // Reset if no prefill
             setFormData({
                propertyId: "",
                full_name: "",
                email: "",
                phone: "",
                relation: "Self",
                tenant_type: "Family",
                monthly_rent: "",
                payment_status: "PENDING",
                start_date: "",
                rent_due_date: ""
            });
        }
    }, [isOpen, prefill, properties]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'propertyId') {
            const selectedProp = properties.find(p => p.id == value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                monthly_rent: selectedProp ? selectedProp.price : prev.monthly_rent
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                toast.error("You are not authenticated. Please log in.");
                return;
            }
            const payload = {
                tenant_type: formData.tenant_type,
                monthly_rent: parseFloat(formData.monthly_rent),
                payment_status: formData.payment_status,
                start_date: formData.start_date,
                rent_due_date: formData.rent_due_date,
                primary_member: {
                    full_name: formData.full_name,
                    phone: formData.phone,
                    email: formData.email,
                    relation: formData.relation
                }
            };
            await axios.post(
                `https://rentease-1-pwm5.onrender.com/api/tenants/property/${formData.propertyId}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
            onClose();
            toast.success("Tenant added successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to add tenant");
        }
    };

    const inputClass = `w-full px-4 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

    return (
        <div className="fixed top-20 inset-x-0 bottom-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <Card isDarkMode={isDarkMode} className="w-full max-w-lg max-h-full overflow-y-auto scrollbar-hide p-6 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center relative z-10">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New Tenant</h3>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className={`p-2 rounded-full cursor-pointer transition-colors relative z-20 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-rose-500'}`}
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Select Property</label>
                        <select required name="propertyId" value={formData.propertyId} onChange={handleChange} className={inputClass}>
                            <option value="">-- Select Property --</option>
                            {properties.filter(p => p.status === 'Available').map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required name="full_name" value={formData.full_name} onChange={handleChange} className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input required name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Relation</label>
                        <select name="relation" value={formData.relation} onChange={handleChange} className={inputClass}>
                            <option value="Self">Self</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Child">Child</option>
                            <option value="Parent">Parent</option>
                            <option value="Friend">Friend</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                            <select name="tenant_type" value={formData.tenant_type} onChange={handleChange} className={inputClass}>
                                <option value="Family">Family</option>
                                <option value="Bachelors">Bachelors</option>
                                <option value="Couple">Couple</option>
                            </select>
                        </div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Monthly Rent</label><input required type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Payment Status</label>
                        <select name="payment_status" value={formData.payment_status} onChange={handleChange} className={inputClass}>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Due Date</label><input required type="date" name="rent_due_date" value={formData.rent_due_date} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div className="pt-4">
                        <LandlordButton type="submit" className="w-full justify-center" isDarkMode={isDarkMode}>Add Tenant</LandlordButton>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AddTenantModal;
