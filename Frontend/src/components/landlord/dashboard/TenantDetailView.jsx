import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Home, IndianRupee, Users, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import AddResidentModal from '../modals/AddResidentModal';
import Swal from 'sweetalert2';

const TenantDetailView = ({ tenants, selectedTenantId, isDarkMode, setActiveTab, setSelectedTenantId, showNotificationToast, onUpdateStatus, onChatClick, onDeleteTenant: onParentDeleteTenant }) => {
    // 🏠 Find all equal roommates for this property
    const baseTenant = tenants.find((t) => t.id === selectedTenantId);
    // Filter to only include roommates that have a valid name or identity
    const roommates = baseTenant ? tenants.filter(t => t.property_id === baseTenant.property_id && (t.name || t.email)) : [];
    
    const [activeTenantId, setActiveTenantId] = useState(selectedTenantId);
    const tenant = tenants.find((t) => t.id === activeTenantId) || baseTenant;

    const [members, setMembers] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);

    const isPG = (tenant?.property_type || "").toUpperCase().includes('PG') || 
                 (tenant?.property_type || "").toUpperCase().includes('HOSTEL') || 
                 tenant?.tenant_type === 'BACHELORS';

    useEffect(() => {
        if (tenant?.id) {
            fetchMembers();
        }
    }, [tenant?.id]);

    useEffect(() => {
        setActiveTenantId(selectedTenantId);
    }, [selectedTenantId]);

    const fetchMembers = async () => {
        setIsLoadingMembers(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`/api/tenants/${tenant.id}/members`, {
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

    const handleDeleteMember = async (memberId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This resident will be removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete!',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#000'
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`/api/tenant-members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotificationToast("Resident deleted successfully", "success");
            fetchMembers();
        } catch (error) {
            console.error("Error deleting resident:", error);
            showNotificationToast("Failed to delete resident", "error");
        }
    };

    const handleDeleteTenant = async (tenantId, tenantName) => {
        const result = await Swal.fire({
            title: 'Delete Tenant?',
            text: `This will remove ${tenantName} and notify them via email.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete!',
            background: isDarkMode ? '#0f172a' : '#fff',
            color: isDarkMode ? '#fff' : '#000'
        });

        if (!result.isConfirmed) return;

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`/api/tenants/${tenantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showNotificationToast(`Tenant ${tenantName} removed. Notification sent.`, "success");
            
            // If the deleted tenant was the one we were viewing, go back
            if (tenantId === activeTenantId) {
                // If there are other roommates, switch to one, otherwise go back
                const remaining = roommates.filter(r => r.id !== tenantId);
                if (remaining.length > 0) {
                    setActiveTenantId(remaining[0].id);
                } else {
                    setActiveTab('tenants');
                    setSelectedTenantId(null);
                }
            }
            
            // Notify parent to refresh tenants list
            if (onParentDeleteTenant) {
                onParentDeleteTenant(tenantId);
            }
        } catch (error) {
            console.error("Error deleting tenant:", error);
            showNotificationToast("Failed to remove tenant", "error");
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

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <AddResidentModal
                isOpen={isAddResidentModalOpen}
                onClose={() => setIsAddResidentModalOpen(false)}
                tenantId={tenant.id}
                propertyType={tenant.property_type}
                roomType={tenant.room_type}
                defaultRent={tenant.monthly_rent}
                onResidentAdded={fetchMembers}
                isDarkMode={isDarkMode}
                showNotificationToast={showNotificationToast}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                        <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {isPG ? 'Property Group' : 'Tenant Details'}
                        </h2>
                        <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-bold flex items-center gap-2`}>
                            {tenant.property_name} 
                            {tenant.room_number && <span className="text-violet-500 bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20 text-[10px]">• Room {tenant.room_number}</span>}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile & Lease */}
                <div className="space-y-6">
                    <Card isDarkMode={isDarkMode} className="overflow-hidden p-0">
                        <div className="h-40 w-full relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
                            <img
                                src={tenant.property_images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1073&q=80"}
                                alt="Property"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-6 z-20 text-white">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Currently Managing</span>
                                <h3 className="text-xl font-bold truncate">{tenant.property_name}</h3>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-6">
                                <div className={`w-20 h-20 rounded-2xl bg-violet-600 flex items-center justify-center text-3xl font-black text-white shadow-xl overflow-hidden`}>
                                    {tenant.avatar_url ? (
                                        <img src={tenant.avatar_url} alt={tenant.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{tenant.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h2>
                                    <p className="text-slate-400 font-bold text-xs">{tenant.email?.toLowerCase()}</p>
                                    <p className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-500'}`}>{tenant.phone || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                                    className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                    title="Delete this tenant"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </Card>

                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest">Rent Details</h4>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tenant.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {tenant.status || 'UNPAID'}
                            </span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/10">
                                <span className="text-slate-500 font-bold text-xs uppercase">Move-in Date</span>
                                <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{new Date(tenant.start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/10">
                                <span className="text-slate-500 font-bold text-xs uppercase">Personal Rent</span>
                                <span className="font-black text-xl text-emerald-400">₹{totalRent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-800/10">
                                <span className="text-slate-500 font-bold text-xs uppercase">Total Occupancy</span>
                                <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{isPG ? `${roommates.length} / ${tenant.sharing_capacity}` : 'Family'}</span>
                            </div>
                            {tenant.room_number && (
                                <div className="flex justify-between items-center py-3 border-b border-slate-800/10">
                                    <span className="text-slate-500 font-bold text-xs uppercase">Room Number</span>
                                    <span className="px-3 py-1 bg-violet-600 rounded-lg text-white font-black text-[10px] tracking-widest">{tenant.room_number}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card isDarkMode={isDarkMode} className={`p-6 border-violet-500/20 ${isDarkMode ? 'bg-gradient-to-br from-slate-950 to-indigo-900/10' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><IndianRupee size={20} /></div>
                                <div>
                                    <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Controls</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Manage rent distribution</p>
                                </div>
                            </div>
                            <div className="px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                                <span className="text-[10px] font-black uppercase text-violet-400 tracking-widest">{tenant.tenant_type || 'FAMILY'}</span>
                            </div>
                        </div>

                        <div className={`p-6 rounded-[2rem] border border-violet-500/10 text-center ${isDarkMode ? 'bg-black/40' : 'bg-slate-50'}`}>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Individual Due Amount</p>
                            <h2 className="text-4xl font-black text-emerald-400">₹{totalRent.toLocaleString()}</h2>
                            <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                                {isPG ? `Bachelor split distributed equally across ${roommates.length} residents.` : 'Family unit total monthly liability.'}
                            </p>
                        </div>
                    </Card>

                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-500"><Users size={20} /></div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resident Management</h3>
                        </div>

                        <div className="space-y-3">
                            {(isPG ? roommates : members).map((person) => {
                                const isActive = isPG ? person.id === activeTenantId : person.is_primary;
                                return (
                                    <div 
                                        key={person.id} 
                                        onClick={() => isPG && setActiveTenantId(person.id)}
                                        className={`p-4 rounded-2xl flex items-center justify-between border cursor-pointer transition-all ${
                                            isActive 
                                            ? (isDarkMode ? 'bg-violet-600/10 border-violet-500/50' : 'bg-violet-50 border-violet-200') 
                                            : (isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50')
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isActive ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                                {(person.name || person.full_name)?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${isActive ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-slate-400' : 'text-slate-600')}`}>{person.name || person.full_name}</h4>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                                    {isPG ? 'Roommate' : (person.is_primary ? 'Primary' : 'Member')}
                                                    {tenant.room_number && ` • Room ${tenant.room_number}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isActive && <CheckCircle2 size={16} className="text-violet-500" />}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    isPG ? handleDeleteTenant(person.id, person.name) : handleDeleteMember(person.id);
                                                }}
                                                className="p-2 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TenantDetailView;
