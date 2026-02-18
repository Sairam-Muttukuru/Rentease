import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const EditTenantModal = ({ isOpen, onClose, tenant, onUpdate, isDarkMode }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        monthly_rent: "",
        tenant_type: "Family",
        payment_status: "PENDING",
        relation: "Self",
        start_date: "",
        rent_due_date: ""
    });

    React.useEffect(() => {
        if (tenant) {
            setFormData({
                name: tenant.name || "",
                phone: tenant.phone || "",
                email: tenant.email || "",
                monthly_rent: tenant.monthly_rent || "",
                tenant_type: tenant.tenant_type || "Family",
                payment_status: tenant.status || "PENDING",
                relation: tenant.relation || "Self",
                start_date: tenant.start_date ? new Date(tenant.start_date).toISOString().split('T')[0] : "",
                rent_due_date: tenant.rent_due_date || ""
            });
        }
    }, [tenant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen || !tenant) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...tenant, ...formData });
    };

    const inputClass = `w-full px-4 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <Card isDarkMode={isDarkMode} className="w-full max-w-lg p-6 space-y-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Tenant</h3>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-50 cursor-pointer"
                    >
                        <X className="text-slate-500 hover:text-rose-500 w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
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
                                <option value="FAMILY">Family</option>
                                <option value="BACHELORS">Bachelors</option>
                                <option value="COUPLE">Couple</option>
                            </select>
                        </div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Monthly Rent</label><input required type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Payment Status</label>
                        <select name="payment_status" value={formData.payment_status} onChange={handleChange} className={inputClass}>
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="OVERDUE">Overdue</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Due Date</label><input type="number" min="1" max="31" placeholder="Day (1-31)" name="rent_due_date" value={formData.rent_due_date} onChange={handleChange} className={inputClass} /></div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <LandlordButton type="button" onClick={onClose} variant="secondary" className="flex-1 justify-center" isDarkMode={isDarkMode}>Cancel</LandlordButton>
                        <LandlordButton type="submit" className="flex-1 justify-center" isDarkMode={isDarkMode}>Save Changes</LandlordButton>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditTenantModal;
