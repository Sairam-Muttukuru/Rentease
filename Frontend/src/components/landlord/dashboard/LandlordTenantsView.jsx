import React, { useMemo } from 'react';
import {
    UserPlus,
    Search,
    Users,
    Home,
    Edit,
    Trash2,
    IndianRupee,
    Phone
} from 'lucide-react';
import LandlordButton from '../common/LandlordButton';

const LandlordTenantsView = ({
    tenants = [],
    isDarkMode,
    setIsAddModalOpen,
    onViewDetails,
    onEditClick,
    onDeleteClick
}) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredTenants = useMemo(() => (tenants || []).filter(tenant => {
        const search = (searchTerm || "").toLowerCase();
        return (
            tenant.name?.toLowerCase().includes(search) ||
            tenant.property_name?.toLowerCase().includes(search) ||
            tenant.email?.toLowerCase().includes(search) ||
            tenant.phone?.includes(search)
        );
    }), [tenants, searchTerm]);

    const groupedTenants = useMemo(() => {
        const groups = {};
        // 🛡️ CRITICAL: Filter for identified roommates only to prevent ghost circles
        const identifiedTenants = filteredTenants.filter(t => t.name || t.email);
        
        identifiedTenants.forEach(t => {
            const isShared = t.property_type?.toUpperCase().includes('PG') || 
                             t.property_type?.toUpperCase().includes('HOSTEL') || 
                             t.tenant_type === 'BACHELORS';
            
            if (isShared) {
                if (!groups[t.property_id]) {
                    groups[t.property_id] = { 
                        ...t, 
                        isGroup: true, 
                        occupants: [t] 
                    };
                } else {
                    groups[t.property_id].occupants.push(t);
                }
            } else {
                groups[`single_${t.id}`] = { ...t, isGroup: false };
            }
        });
        return Object.values(groups);
    }, [filteredTenants]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-5xl font-black tracking-tight ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
                        My Tenants
                    </h2>
                    <p className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage your community
                    </p>
                </div>
                <LandlordButton
                    icon={UserPlus}
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 border-none px-6 py-3 h-auto text-base rounded-2xl transition-transform active:scale-95"
                >
                    Add New Tenant
                </LandlordButton>
            </div>

            {/* Search Bar */}
            <div className={`relative overflow-hidden p-1 rounded-3xl transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-2xl shadow-black/50' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
                <div className={`relative z-10 p-2 flex items-center gap-4`}>
                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-violet-400' : 'bg-slate-50 text-violet-600'}`}>
                        <Search size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, property, or email..."
                        className={`w-full bg-transparent outline-none text-lg font-bold placeholder:font-medium placeholder:text-slate-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tenant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupedTenants.length === 0 ? (
                    <div className={`col-span-full flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                        <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400 shadow-xl'}`}>
                            <Users size={64} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Tenants Found</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Register your first resident to start tracking.</p>
                    </div>
                ) : (
                    groupedTenants.map((group) => (
                        <div
                            key={group.id}
                            className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDarkMode
                                ? 'bg-slate-900 hover:shadow-violet-900/20 ring-1 ring-slate-800 hover:ring-violet-500/50'
                                : 'bg-white hover:shadow-xl hover:shadow-slate-200 ring-1 ring-slate-200 hover:ring-violet-300'
                                }`}
                        >
                            {/* Decorative Header */}
                            <div className={`h-32 w-full relative overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${group.property_type?.includes('PG') ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                                        {group.property_type || 'Property'}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-emerald-500/30 bg-emerald-500/20 text-emerald-400`}>
                                        ACTIVE
                                    </div>
                                </div>
                            </div>

                            {/* Multiple Avatars or Single Avatar */}
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
                                {group.isGroup ? (
                                    <div className="flex -space-x-8 p-1">
                                        {group.occupants.map((occupant, idx) => (
                                            <div 
                                                key={occupant.id}
                                                className={`w-24 h-24 rounded-full border-4 ${isDarkMode ? 'border-slate-900 bg-slate-800 shadow-xl' : 'border-white bg-slate-100 shadow-lg'} overflow-hidden flex items-center justify-center text-3xl font-black text-white relative transition-transform hover:scale-110 hover:z-20`}
                                                style={{ zIndex: group.occupants.length - idx, backgroundColor: `hsl(${(idx * 137) % 360}, 50%, 50%)` }}
                                            >
                                                {occupant.avatar_url ? (
                                                    <img src={occupant.avatar_url} alt={occupant.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{occupant.name?.charAt(0)}</span>
                                                )}
                                            </div>
                                        ))}
                                        {/* Vacancy slots - showing dashed circles for empty beds */}
                                        {Array.from({ length: Math.max(0, (group.sharing_capacity || 0) - group.occupants.length) }).map((_, idx) => (
                                            <div 
                                                key={`empty-${idx}`}
                                                className={`w-24 h-24 rounded-full border-4 border-dashed ${isDarkMode ? 'border-slate-700 bg-slate-800/20' : 'border-slate-200 bg-slate-50'} flex items-center justify-center text-slate-500 opacity-40`}
                                            >
                                                <Users size={24} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`w-32 h-32 rounded-[2.5rem] border-4 ${isDarkMode ? 'border-slate-900 shadow-2xl' : 'border-white shadow-xl'} overflow-hidden bg-violet-600 flex items-center justify-center text-4xl font-black text-white transform group-hover:rotate-3 transition-transform duration-500`}>
                                        {group.avatar_url ? (
                                            <img src={group.avatar_url} alt={group.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{group.name?.charAt(0)}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="pt-20 px-8 pb-8 text-center">
                                <h3 className={`text-2xl font-black mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {group.isGroup ? `${group.occupants.length} Active Occupant${group.occupants.length > 1 ? 's' : ''}` : group.name}
                                </h3>
                                {group.isGroup ? (
                                    <div className="space-y-1 mb-4">
                                        <p className="text-slate-500 font-bold text-[10px] truncate italic tracking-tighter">
                                            {group.occupants.map(o => o.name).join(' • ')}
                                        </p>
                                        <p className="text-violet-500 font-bold text-[9px] truncate tracking-tight">
                                            {group.occupants.map(o => o.phone).filter(Boolean).join(' • ')}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-1 mb-4">
                                        <p className="text-slate-500 font-bold text-xs truncate">{group.email?.toLowerCase()}</p>
                                        <p className="text-violet-400 font-bold text-[10px] tracking-widest">{group.phone}</p>
                                    </div>
                                )}

                                <div className={`p-6 rounded-[2rem] space-y-4 mb-6 text-left transition-colors ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><Home size={16} /></div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Property</p>
                                            <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                {group.property_name} {group.room_number && <span className="text-violet-500 ml-1">• Room {group.room_number}</span>}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400"><Users size={16} /></div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Occupancy Status</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {group.isGroup ? group.occupants.length : '1'} / {group.sharing_capacity || 1} Occupied
                                                </p>
                                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-violet-500 rounded-full transition-all duration-1000" 
                                                        style={{ width: `${((group.isGroup ? group.occupants.length : 1) / (group.sharing_capacity || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400"><IndianRupee size={16} /></div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Rent</p>
                                            <p className={`text-xs font-black text-emerald-400`}>
                                                ₹{group.monthly_rent} <span className="text-[10px] text-slate-500 font-medium">/ person</span>
                                            </p>
                                        </div>
                                    </div>

                                    {!group.isGroup && group.phone && (
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400"><Phone size={16} /></div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Phone Number</p>
                                                <p className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {group.phone}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <LandlordButton
                                        isDarkMode={isDarkMode}
                                        onClick={() => onViewDetails(group)}
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold h-12 rounded-2xl shadow-lg shadow-violet-600/20"
                                    >
                                        View Details
                                    </LandlordButton>
                                    
                                    {!group.isGroup && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEditClick(group)}
                                                className={`p-3 rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'}`}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(group.id)}
                                                className={`p-3 rounded-2xl transition-all duration-300 ${isDarkMode ? 'hover:bg-rose-950/30 text-slate-500 hover:text-rose-500' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LandlordTenantsView;
