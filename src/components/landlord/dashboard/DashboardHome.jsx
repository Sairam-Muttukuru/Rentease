import React from 'react';
import {
    PlusCircle,
    Building,
    Users,
    CreditCard,
    AlertCircle,
    MapPin,
    Plus,
    Wrench,
    Bell,
    Check
} from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import RevenueTrendsChart from './charts/RevenueTrendsChart';
import ComplaintsDistributionChart from './charts/ComplaintsDistributionChart';

const DashboardHome = ({
    stats,
    notifications,
    landlordProperties,
    loadingProperties,
    isDarkMode,
    setActiveTab,
    tenants
}) => {
    return (
        <div className="space-y-8 fade-in-up">
            {/* Header Removed - Content moved to Topbar */}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} isDarkMode={isDarkMode} className="p-6 relative group overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02]">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>{stat.label}</p>
                                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold mt-2 ${stat.sub.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.sub}</p>
                            </div>
                            <div className={`p-3 rounded-2xl text-white shadow-lg ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Main Content Area: Activity & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                        <RevenueTrendsChart isDarkMode={isDarkMode} />
                        <ComplaintsDistributionChart isDarkMode={isDarkMode} />
                    </div>

                    <div className="space-y-6">
                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Recent Activity</h3>
                        <Card isDarkMode={isDarkMode} className="p-6 space-y-6">
                            {notifications.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-sm text-slate-500">No recent activity.</p>
                                </div>
                            ) : (
                                notifications.slice(0, 5).map((n) => (
                                    <div key={n.id} className="flex gap-4 items-start">
                                        <div className={`p-3 rounded-full shrink-0 ${n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' : n.type === 'complaint' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {n.type === 'payment' ? <CreditCard size={20} /> : n.type === 'complaint' ? <AlertCircle size={20} /> : <Bell size={20} />}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{n.title}</p>
                                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{n.message}</p>
                                            <p className="text-[10px] mt-1 text-slate-500">
                                                {n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Card>

                        {/* Properties List */}
                        <div className="space-y-6">
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>My Properties</h3>
                            {landlordProperties.length === 0 ? (
                                <Card isDarkMode={isDarkMode} className="p-8 text-center border-dashed border-2 border-slate-700 bg-transparent">
                                    <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                        <Building size={32} className="text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-slate-400">No Properties Found</h3>
                                    <p className="text-slate-500 mb-4 text-sm">You haven't added any properties yet.</p>
                                    <LandlordButton onClick={() => setActiveTab('add-property')} icon={Plus}>Add First Property</LandlordButton>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {landlordProperties.map((property) => (
                                        <Card key={property.id} isDarkMode={isDarkMode} className="group overflow-hidden hover:border-violet-500/50 transition-all">
                                            <div className="relative h-40">
                                                <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold bg-black/50 backdrop-blur-md text-white border border-white/10`}>
                                                        {property.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className={`text-lg font-bold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{property.name}</h4>
                                                <p className="text-sm text-slate-500 mb-3 flex items-center gap-1"><MapPin size={12} /> {property.address}</p>
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                                                    <span className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{property.rent}<span className="text-xs font-medium text-slate-500">/mo</span></span>
                                                    <LandlordButton variant="outline" className="h-8 text-xs" onClick={() => setActiveTab('properties')}>View Details</LandlordButton>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Rent Collection */}
                <div className="space-y-6">
                    {/* Rent Collection Donut Chart */}
                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <CreditCard className="text-emerald-500" size={24} />
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rent Collection</h3>
                        </div>

                        <div className="relative h-48 w-48 mx-auto mb-4">
                            <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="12" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="transparent"
                                    stroke="#10b981"
                                    strokeWidth="12"
                                    strokeDasharray={`${((tenants.filter(t => t.status === 'PAID').length || 0) / (tenants.length || 1)) * 251.2} 251.2`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {Math.round(((tenants.filter(t => t.status === 'PAID').length || 0) / (tenants.length || 1)) * 100)}%
                                </span>
                                <span className="text-xs text-slate-500 uppercase font-bold">Collected</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Paid</span>
                                </div>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenants.filter(t => t.status === 'PAID').length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Pending</span>
                                </div>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenants.filter(t => t.status !== 'PAID').length}</span>
                            </div>
                        </div>
                    </Card>

                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Quick Actions</h3>
                    <Card isDarkMode={isDarkMode} className="p-4 space-y-2">
                        {[
                            { label: 'View All Properties', icon: Building, action: () => setActiveTab('properties') },
                            { label: 'Manage Tenants', icon: Users, action: () => setActiveTab('tenants') },
                            { label: 'View Payments', icon: CreditCard, action: () => setActiveTab('finance') },
                            { label: 'Review Complaints', icon: AlertCircle, action: () => setActiveTab('requests') }
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={action.action}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-black hover:text-black'}`}
                            >
                                <action.icon size={18} />
                                <span className="font-bold text-sm">{action.label}</span>
                            </button>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
