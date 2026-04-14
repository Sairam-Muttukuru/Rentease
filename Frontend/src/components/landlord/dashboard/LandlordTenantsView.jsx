import React from 'react';
import {
    UserPlus,
    Search,
    Users,
    Home,
    Phone,
    MessageCircle,
    Edit,
    Trash2,
    IndianRupee
} from 'lucide-react';
import LandlordButton from '../common/LandlordButton';

const LandlordTenantsView = ({
    tenants = [],
    isDarkMode,
    setIsAddModalOpen,
    onViewDetails,
    onChatClick,
    onEditClick,
    onDeleteClick
}) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    const filteredTenants = (tenants || []).filter(tenant => {
        const search = (searchTerm || "").toLowerCase();
        return (
            tenant.name?.toLowerCase().includes(search) ||
            tenant.property_name?.toLowerCase().includes(search) ||
            tenant.email?.toLowerCase().includes(search)
        );
    });

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
                {filteredTenants.length === 0 ? (
                    <div className={`col-span-full flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                        <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400 shadow-xl'}`}>
                            <Users size={64} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Tenants Found</h3>
                        <p className="text-slate-500">Add your first tenant to get started!</p>
                    </div>
                ) : (
                    filteredTenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDarkMode
                                ? 'bg-slate-900 hover:shadow-violet-900/20 ring-1 ring-slate-800 hover:ring-violet-500/50'
                                : 'bg-white hover:shadow-xl hover:shadow-slate-200 ring-1 ring-slate-200 hover:ring-violet-300'
                                }`}
                        >
                            {/* Decorative Header */}
                            <div className={`h-32 w-full relative overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${tenant.property_type?.includes('PG') ? 'bg-violet-500/20 text-violet-400 border-violet-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>
                                        {tenant.property_type || 'Property'}
                                    </div>
                                    {tenant.room_no && (
                                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-amber-500/30 bg-amber-500/20 text-amber-400`}>
                                            Room {tenant.room_no}
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
                                    Active
                                </div>
                            </div>

                            {/* Avatar & Main Info */}
                            <div className="relative px-8 pb-8 -mt-16 text-center">
                                <div className="relative inline-block mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl relative z-10 overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600`}>
                                        {tenant.avatar_url ? (
                                            <img src={tenant.avatar_url} alt={tenant.name} className="w-full h-full object-cover" />
                                        ) : (
                                            tenant.name?.charAt(0)
                                        )}
                                    </div>
                                </div>

                                <h3 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h3>

                                {/* Info Grid */}
                                <div className={`mt-6 space-y-3 text-left p-5 rounded-3xl ${isDarkMode ? 'bg-slate-950/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}><Home size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Property & Occupancy</p>
                                            <p className={`font-bold text-xs truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {tenant.property_name} 
                                                <span className="ml-2 text-violet-500">
                                                    ({tenant.occupied_count || 1}/{tenant.sharing_capacity || 1})
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-sm'}`}><IndianRupee size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Monthly Rent</p>
                                            <p className={`font-black text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                ₹{parseFloat(tenant.monthly_rent || 0).toLocaleString()} <span className="text-[10px] font-bold text-slate-500">
                                                    {tenant.property_type?.includes('PG') ? '/ per person' : '/ month'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}><Phone size={18} /></div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Contact</p>
                                            <p className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-6 flex items-center gap-3">
                                    <button
                                        onClick={() => onViewDetails(tenant)}
                                        className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/20 transition-all active:scale-95 text-sm"
                                    >
                                        View Details
                                    </button>


                                    <button onClick={() => onEditClick(tenant)} className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600'}`}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => onDeleteClick(tenant.id)} className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-rose-950/30 text-rose-500' : 'border-slate-200 hover:bg-rose-50 text-rose-500'}`}>
                                        <Trash2 size={18} />
                                    </button>
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
