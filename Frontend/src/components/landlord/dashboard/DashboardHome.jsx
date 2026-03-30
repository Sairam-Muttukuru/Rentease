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
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import PropertyRules from './PropertyRules';
import RevenueTrendsChart from './charts/RevenueTrendsChart';
import ComplaintsDistributionChart from './charts/ComplaintsDistributionChart';

const DashboardHome = ({
    stats,
    notifications,
    landlordProperties,
    loadingProperties,
    isDarkMode,
    setActiveTab,
    tenants,
    complaints = [],
    payments = []
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
                        <RevenueTrendsChart isDarkMode={isDarkMode} payments={payments.filter(p => !p.receipt_number?.startsWith('SEC-DEP'))} />
                        <ComplaintsDistributionChart isDarkMode={isDarkMode} complaints={complaints} />
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Activity & Transactions</h3>
                            <LandlordButton variant="outline" className="text-xs h-8" onClick={() => setActiveTab('finance')}>View All</LandlordButton>
                        </div>
                        <Card isDarkMode={isDarkMode} className="p-0 overflow-hidden">
                            <div className="divide-y divide-slate-800/10 dark:divide-slate-800/50">
                                {payments.length === 0 && notifications.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-sm text-slate-500">No recent activity or payments found.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Payments take priority as "Visible Data" */}
                                        {payments.slice(0, 3).map((p, i) => (
                                            <div key={`pay-${p.id || i}`} className={`p-4 flex items-center justify-between transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment from {p.tenant_name || 'Tenant'}</p>
                                                        <p className="text-[10px] text-slate-500">{p.property_name} • {new Date(p.date || p.payment_date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Number(p.amount).toLocaleString()}</p>
                                            </div>
                                        ))}
                                        
                                        {/* Notifications / Other activity */}
                                        {notifications.slice(0, 3).map((n) => (
                                            <div key={`notif-${n.id}`} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className={`p-2 rounded-xl ${n.type === 'complaint' ? 'bg-blue-500/10 text-blue-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                                    {n.type === 'complaint' ? <Wrench size={18} /> : <Bell size={18} />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</p>
                                                    <p className="text-[10px] text-slate-500">{n.message} • {new Date(n.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Quick Actions & Rent Collection */}
                <div className="space-y-6">
                    {/* Current Month Collection Progress Chart */}
                    <Card isDarkMode={isDarkMode} className="p-6">
                        {(() => {
                            const now = new Date();
                            const currentMonthName = now.toLocaleString('default', { month: 'long' });
                            const currentYear = now.getFullYear();
                            const currentMonthZeroIndexed = now.getMonth();
                            
                            // Filter payments for CURRENT month AND exclude Security Deposits
                            const monthPayments = payments.filter(p => {
                                // Determine year/month from local_date or parsed date
                                let pYear, pMonth;
                                if (p.local_date) {
                                    const parts = p.local_date.split('-');
                                    pYear = parseInt(parts[0]);
                                    pMonth = parseInt(parts[1]) - 1;
                                } else {
                                    const d = new Date(p.date || p.payment_date);
                                    pYear = d.getFullYear();
                                    pMonth = d.getMonth();
                                }
                                
                                const isCurrentMonth = pYear === currentYear && pMonth === currentMonthZeroIndexed;
                                const isNotSecurityDeposit = !p.receipt_number?.startsWith('SEC-DEP');
                                return isCurrentMonth && isNotSecurityDeposit;
                            });

                            const collected = monthPayments.reduce((sum, p) => sum + Number(p.amount), 0);
                            // Use cumulative balance_due from backend (actual pending across all months)
                            const totalPending = tenants.reduce((sum, t) => sum + (Number(t.balance_due) || 0), 0);
                            // Target = total pending + already collected this month (full rent roll)
                            const totalRentRoll = tenants.reduce((sum, t) => sum + (Number(t.monthly_rent) || 0), 0);
                            const target = totalPending + collected > 0 ? totalPending + collected : totalRentRoll;
                            const percent = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : (tenants.length > 0 ? 100 : 0);
                            const allPaid = totalPending <= 0 && tenants.length > 0;
                            
                            return (
                                <>
                                    <div className="flex items-center gap-2 mb-6">
                                        <CreditCard className="text-emerald-500" size={24} />
                                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentMonthName} Progress</h3>
                                    </div>

                                    <div className="relative h-48 w-48 mx-auto mb-4">
                                        <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                                            <circle cx="50" cy="50" r="40" fill="transparent" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="12" />
                                            <motion.circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="transparent"
                                                stroke={allPaid ? "#10b981" : "#10b981"}
                                                strokeWidth="12"
                                                strokeDasharray="251.2"
                                                initial={{ strokeDashoffset: 251.2 }}
                                                animate={{ strokeDashoffset: 251.2 - (percent / 100) * 251.2 }}
                                                transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                                                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {percent}%
                                            </span>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{currentMonthName} Goal</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Received</span>
                                            </div>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{collected.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${allPaid ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Pending</span>
                                            </div>
                                            <span className={`font-bold ${allPaid ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {allPaid ? '✓ All Paid' : `₹${Math.round(totalPending).toLocaleString()}`}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
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

                <div className="lg:col-span-3">
                    <PropertyRules properties={landlordProperties} isDarkMode={isDarkMode} />
                </div>

                {/* Properties List */}
                <div className="lg:col-span-3 space-y-6">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {landlordProperties.map((property) => {
                                const tenant = tenants.find(t => t.property_id === property.id);
                                return (
                                    <Card key={property.id} isDarkMode={isDarkMode} className="group overflow-hidden hover:border-violet-500/50 transition-all">
                                        <div className="relative h-48">
                                            <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${tenant ? (tenant.status === 'PAID' ? 'bg-emerald-500' : 'bg-rose-500') : 'bg-slate-500'} text-white border border-white/10`}>
                                                    {tenant ? tenant.status : 'Vacant'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className={`text-lg font-bold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{property.name}</h4>
                                            <div className="flex justify-between items-start mb-3">
                                                <p className="text-xs text-slate-500 flex items-center gap-1 min-w-0"><MapPin size={10} className="shrink-0" /> <span className="truncate">{property.address}</span></p>
                                                {tenant && (
                                                    <span className="text-[10px] font-bold text-violet-500 shrink-0 ml-2">👤 {(tenant.name || 'Tenant').split(' ')[0]}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                                                <span className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{property.rent}<span className="text-xs font-medium text-slate-500">/mo</span></span>
                                                <LandlordButton variant="outline" className="h-8 text-[10px] px-3 font-bold" onClick={() => setActiveTab('properties')}>Details</LandlordButton>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
