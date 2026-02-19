import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Home, IndianRupee, Users, Trash2, Plus, MessageCircle } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import AddResidentModal from '../modals/AddResidentModal';

const TenantDetailView = ({ tenants, selectedTenantId, isDarkMode, setActiveTab, setSelectedTenantId, showNotificationToast, onUpdateStatus, onChatClick }) => {
    const tenant = tenants.find((t) => t.id === selectedTenantId);
    const [members, setMembers] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);

    useEffect(() => {
        if (tenant?.id) {
            fetchMembers();
        }
    }, [tenant?.id]);

    const fetchMembers = async () => {
        setIsLoadingMembers(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`http://localhost:5000/api/tenants/${tenant.id}/members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(response.data);
        } catch (error) {
            console.error("Error fetching members:", error);
            showNotificationToast("Failed to load resident details", "error");
        } finally {
            setIsLoadingMembers(false);
        }
    };

    const handleDeleteResident = async (memberId) => {
        if (!window.confirm("Are you sure you want to delete this resident?")) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:5000/api/tenant-members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotificationToast("Resident deleted successfully", "success");
            fetchMembers();
        } catch (error) {
            console.error("Error deleting resident:", error);
            showNotificationToast("Failed to delete resident", "error");
        }
    };

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <p className="text-slate-400 text-sm">No tenant selected.</p>
                <LandlordButton
                    isDarkMode={isDarkMode}
                    variant="outline"
                    onClick={() => setActiveTab('tenants')}
                >
                    Back to Tenants
                </LandlordButton>
            </div>
        );
    }

    const totalRent = tenant.monthly_rent || 0;
    const totalMembersCount = members.length || 1;
    const splitRentAmount = (totalRent / totalMembersCount).toFixed(2);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 pb-20">
            <AddResidentModal
                isOpen={isAddResidentModalOpen}
                onClose={() => setIsAddResidentModalOpen(false)}
                tenantId={tenant.id}
                onResidentAdded={fetchMembers}
                isDarkMode={isDarkMode}
                showNotificationToast={showNotificationToast}
            />

            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => {
                        setActiveTab('tenants');
                        setSelectedTenantId(null);
                    }}
                    className={`p-2.5 rounded-xl border transition-all ${isDarkMode
                        ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Tenant Profile
                        </h2>
                        <button
                            onClick={() => onChatClick(tenant)}
                            className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}`}
                            title="Chat with Tenant"
                        >
                            <MessageCircle size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">Viewing details for {tenant.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile & Lease */}
                <div className="space-y-6">
                    <Card isDarkMode={isDarkMode} className="overflow-hidden p-0 relative group">
                        {/* Property Image Header */}
                        <div className="h-48 w-full relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                            <img
                                src={tenant.property_images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"}
                                alt="Property"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute bottom-4 left-4 z-20 text-white">
                                <div className="flex items-center gap-2 mb-1 opacity-90">
                                    <Home size={14} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Residing At</span>
                                </div>
                                <h3 className="text-2xl font-black leading-tight">{tenant.property_name}</h3>
                            </div>
                        </div>

                        {/* Tenant Info Overlay */}
                        <div className="p-6 relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h2>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{tenant.email}</p>
                                    <p className="text-sm text-slate-500 font-medium">{tenant.phone}</p>
                                </div>
                                <div className="relative -mt-16 z-20">
                                    <div className="w-20 h-20 rounded-2xl shadow-xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {tenant.avatar_url ? (
                                            <img src={tenant.avatar_url} alt={tenant.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl font-black text-slate-400">{tenant.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Lease Terms</h4>
                            <button
                                onClick={() => onUpdateStatus(tenant.id, tenant.status)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider transition-all hover:scale-105 active:scale-95 ${tenant.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
                            >
                                {tenant.status || 'UNPAID'}
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Start Date</span>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {tenant.start_date ? new Date(tenant.start_date).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Monthly Rent</span>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    ₹{totalRent.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-slate-500 text-sm">Occupancy</span>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.tenant_type || 'FAMILY'}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Financial & Residents */}
                <div className="space-y-6">
                    <Card isDarkMode={isDarkMode} className={`p-8 border-violet-500/20 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-indigo-900/20' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><IndianRupee size={24} /></div>
                                <div>
                                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Controls</h4>
                                    <p className="text-xs text-slate-400 font-medium">Manage rent distribution</p>
                                </div>
                            </div>
                            <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                                <div
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all bg-violet-600 text-white shadow-lg`}
                                >
                                    {tenant.tenant_type || 'FAMILY'}
                                </div>
                            </div>
                        </div>

                        {tenant.tenant_type === 'BACHELORS' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className={`p-6 rounded-[2rem] border border-violet-500/10 text-center animate-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Split Amount</p>
                                    <h2 className="text-4xl font-black text-emerald-400">₹{splitRentAmount}</h2>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Per Resident ({totalMembersCount})</p>
                                </div>
                                <div className="space-y-4">
                                    <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        Bachelor split distributed equally across all <span className="text-violet-500">{totalMembersCount}</span> residents.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-6 rounded-[2rem] border border-violet-500/10 text-center animate-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Amount</p>
                                <h2 className="text-4xl font-black text-emerald-400">₹{totalRent.toLocaleString()}</h2>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Full Property Rent</p>
                            </div>
                        )}
                    </Card>

                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400"><Users size={20} /></div>
                                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resident Management</h3>
                            </div>
                            <LandlordButton
                                isDarkMode={isDarkMode}
                                onClick={() => setIsAddResidentModalOpen(true)}
                                className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20"
                                icon={Plus}
                            >
                                Add Resident
                            </LandlordButton>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {isLoadingMembers ? (
                                <div className="text-center py-8 text-slate-500">Loading residents...</div>
                            ) : members.length === 0 ? (
                                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center">
                                    <p className="text-slate-500 text-sm">No residents found.</p>
                                </div>
                            ) : (
                                members.map((member, i) => (
                                    <div key={member.id || i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${isDarkMode ? 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${member.is_primary ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-800 text-slate-400'}`}>
                                                {member.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.full_name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {member.is_primary && (
                                                        <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider">Primary Tenant</span>
                                                    )}
                                                    {!member.is_primary && (
                                                        <span className={`text-[10px] font-bold uppercase text-slate-500 px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>{member.relation || 'Resident'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {!member.is_primary && (
                                            <button
                                                onClick={() => handleDeleteResident(member.id)}
                                                className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-rose-900/30 text-slate-500 hover:text-rose-500' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div >
        </div >
    );
};

export default TenantDetailView;
