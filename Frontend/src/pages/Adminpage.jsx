import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, Users, Building2, MessageSquare,
    Wrench, CreditCard, History, Search,
    CheckCircle, XCircle, AlertCircle, Ban, Filter, Home,
    MoreVertical, ShieldCheck, Download, Plus, Mail, Phone, MapPin, ChevronLeft, ChevronRight, LogOut, FileText, UserCheck, Eye, Trash2,
    PieChart as PieChartIcon, BarChart as BarChartIcon, Activity, TrendingUp, BarChart3, Globe, Zap
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    RadialBarChart, RadialBar
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import logo from "/favicon.png";
// --- THEME TOGGLE (Reused) ---
const ThemeToggle = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none shadow-inner border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"}`}
    >
        <div className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center ${theme === "dark" ? "translate-x-7 bg-slate-900" : "translate-x-0 bg-white"}`}>
            {theme === "dark" ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-orange-500" />}
        </div>
    </button>
);
// --- CONFIG ---
const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/admin`;
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']; // Indigo-based palette
const getAuthConfig = () => {
    const token = localStorage.getItem("accessToken");
    return {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
    };
};
// --- PREMIUM COMPONENTS ---
const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="relative overflow-hidden group p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-6">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${color}-500/10 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
        <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br from-${color}-500/10 to-${color}-500/5 text-${color}-600 dark:text-${color}-400 shadow-inner shrink-0`}>
            <Icon size={32} strokeWidth={2} />
        </div>
        <div className="relative z-10">
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">{value}</h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{label}</p>
            {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium bg-slate-100/50 dark:bg-slate-800/50 inline-block px-2 py-0.5 rounded-lg">{sub}</p>}
        </div>
    </div>
);
const SectionHeader = ({ title, action }) => (
    <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full mt-2" />
        </div>
        {action}
    </div>
);
const Badge = ({ children, variant = "default" }) => {
    const styles = {
        default: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
        warning: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
        danger: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800",
        blue: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
        purple: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ring-1 shadow-sm ${styles[variant]}`}>
            {children}
        </span>
    );
};
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-white/20 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-md">
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <XCircle size={22} className="text-slate-400 hover:text-rose-500 transition-colors" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[80vh] bg-white/90 dark:bg-slate-900/90">{children}</div>
            </div>
        </div>
    );
};
// --- SECTIONS ---
const Overview = ({ stats }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    if (!stats) return <div className="p-10 text-center text-slate-500">Loading dashboard data...</div>;
    const data = stats;
    // Ensure we have the chart structures even if API returns partial data
    const occupancyChart = data.occupancy_chart || [];
    const revenueChart = data.revenue_chart || [];
    const complaintChart = data.complaint_chart || [];
    const activityLog = data.recent_activity || [];
    const occupancyRate = data.occupancy_rate || 0;
    const vacantCount = (Number(data.properties || 0) - Number(data.occupied_properties || 0));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. TOP ROW: 6 KEY METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Total Users" value={(data.users || 0).toLocaleString()} icon={Users} color="indigo" sub="Tenants & Landlords" />
                <StatCard label="Total Properties" value={(data.properties || 0).toLocaleString()} icon={Building2} color="blue" sub="Across all regions" />
                <StatCard label="Occupied" value={(data.occupied_properties || 0).toLocaleString()} icon={CheckCircle} color="emerald" sub={`${occupancyRate}% Occupancy Rate`} />
                <StatCard label="Vacant" value={(vacantCount || 0).toLocaleString()} icon={Building2} color="slate" sub="Available for Rent" />
                <StatCard label="Open Issues" value={(data.open_complaints || 0).toLocaleString()} icon={AlertCircle} color="rose" sub="Requires Attention" />
                <StatCard label="Monthly Revenue" value={`₹${((data.monthly_revenue || 0) / 1000).toFixed(1)}k`} icon={CreditCard} color="amber" sub="Rent & Services" />
            </div>
            {/* 2. MIDDLE ROW: 4 CORE CHARTS (2x2 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Property Occupancy (Sleek Donut) */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-indigo-500" /> Occupancy Status
                    </h3>
                    <div className="flex-1 min-h-[350px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={occupancyChart}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={10}
                                >
                                    {occupancyChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Occupied' ? '#10b981' : '#cbd5e1'} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-4xl font-black text-slate-800 dark:text-white">
                                {occupancyRate}%
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Occupied</span>
                        </div>
                    </div>
                </div>

                {/* Chart 2: User Growth Trend (Premium Wave) */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-500" /> User Growth
                    </h3>
                    <div className="flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.user_growth_chart && data.user_growth_chart.length > 0 ? data.user_growth_chart : [
                                { name: 'No Data', value: 0, prev: 0 }
                            ]}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <Tooltip
                                    cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" activeDot={{ r: 8, strokeWidth: 0, fill: '#06b6d4' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Chart 3: Revenue Trend (Gradient Bars) */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <BarChartIcon className="w-5 h-5 text-indigo-500" /> Revenue Trend (6 Mo)
                    </h3>
                    <div className="flex-1 min-h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueChart} barSize={32} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                                    </linearGradient>
                                    <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeOpacity={0.5} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: isDarkMode ? '#1e293b' : '#f1f5f9', opacity: 0.4 }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: isDarkMode ? '#1e293b' : '#fff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Bar dataKey="rent" name="Rent" stackId="a" fill="url(#rentGradient)" radius={[0, 0, 4, 4]} />
                                <Bar dataKey="service" name="Service" stackId="a" fill="url(#serviceGradient)" radius={[4, 4, 0, 0]} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 4: Complaint Status (Sleek Donut) */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl shadow-xl flex flex-col hover:shadow-2xl transition-all duration-300">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-rose-500" /> Issue Resolution
                    </h3>
                    <div className="flex-1 min-h-[350px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={complaintChart.some(c => c.value > 0) ? complaintChart : [{ name: 'No Data', value: 1 }]}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={10}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {complaintChart.some(c => c.value > 0) ? complaintChart.map((entry, index) => {
                                        let color = '#ef4444'; // Open
                                        if (entry.name === 'Resolved') color = '#10b981';
                                        else if (entry.name === 'In Progress') color = '#f59e0b';
                                        return <Cell key={`cell-${index}`} fill={color} strokeWidth={0} />;
                                    }) : (
                                        <Cell fill={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth={0} />
                                    )}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-4xl font-black text-slate-800 dark:text-white">
                                {complaintChart.reduce((acc, curr) => acc + (curr.value || 0), 0)}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 mt-[-10px]">
                        <div className="text-center">
                            <p className="text-xl font-black text-emerald-500">{complaintChart.find(c => c.name === 'Resolved')?.value || 0}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Resolved</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-amber-500">{complaintChart.find(c => c.name === 'In Progress')?.value || 0}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">In Progress</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-rose-500">{complaintChart.find(c => c.name === 'Open')?.value || 0}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Open</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. BOTTOM SECTION: RECENT ACTIVITY */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100/50 dark:border-slate-700/50 flex justify-between items-center bg-white/40 dark:bg-slate-800/40">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-500" /> Recent System Activity
                    </h3>
                    <Badge variant="default">Real-time</Badge>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {activityLog.map((log, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                  ${log.action.includes("User") ? "bg-blue-100 text-blue-600" :
                                    log.action.includes("Payment") ? "bg-emerald-100 text-emerald-600" :
                                        log.action.includes("Complaint") ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"}`}
                            >
                                {log.action.includes("User") ? <Users size={18} /> :
                                    log.action.includes("Payment") ? <CreditCard size={18} /> :
                                        log.action.includes("Complaint") ? <Wrench size={18} /> : <FileText size={18} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{log.action}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{log.detail || log.performed_by}</p>
                            </div>
                            <div className="text-xs font-medium text-slate-400">
                                {log.time || new Date(log.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/users`, getAuthConfig());
            setUsers(res.data);
        } catch (err) { toast.error("Failed to load users"); }
    };
    useEffect(() => { fetchUsers(); }, []);
    const toggleStatus = async (id) => {
        try {
            await axios.put(`${API_URL}/users/${id}/status`, {}, getAuthConfig());
            toast.success("User status updated");
            fetchUsers();
        } catch (err) { toast.error("Action failed"); }
    };
    const filteredUsers = users.filter(u =>
        (roleFilter === "All" || u.role === roleFilter) &&
        (u.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()))
    );
    return (
        <div className="space-y-6">
            <SectionHeader
                title="User Management"
                action={
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-12 pr-6 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-80 shadow-sm dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-slate-600 dark:text-slate-300 shadow-sm"
                        >
                            <option value="All">All Roles</option>
                            <option value="TENANT">Tenants</option>
                            <option value="LANDLORD">Landlords</option>
                            <option value="SERVICE_PROVIDER">Service Providers</option>
                            <option value="ADMIN">Admins</option>
                        </select>
                    </div>
                }
            />
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined Date</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg shadow-sm">
                                            {u.first_name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{u.first_name} {u.last_name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5"><Badge variant="blue">{u.role}</Badge></td>
                                <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">{new Date(u.created_at).toLocaleDateString()}</td>
                                <td className="px-8 py-5"><Badge variant={u.status === 'Active' ? 'success' : 'danger'}>{u.status}</Badge></td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => toggleStatus(u.id)} className={`p-2.5 rounded-xl transition-all shadow-sm ${u.status === 'Active' ? 'bg-white dark:bg-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 border border-slate-200 dark:border-slate-700 hover:border-rose-200' : 'bg-white dark:bg-slate-800 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 border border-slate-200 dark:border-slate-700 hover:border-emerald-200'}`}>
                                        {u.status === 'Active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const PropertyManagement = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProp, setSelectedProp] = useState(null);
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const fetchProps = async () => {
        try {
            const res = await axios.get(`${API_URL}/properties`, getAuthConfig());
            setProperties(res.data);
        } catch (err) { toast.error("Failed to load properties"); }
    };
    useEffect(() => { fetchProps(); }, []);
    const toggleStatus = async (id) => {
        try {
            await axios.put(`${API_URL}/properties/${id}/status`, {}, getAuthConfig());
            toast.success("Property status updated");
            fetchProps();
        } catch (err) { toast.error("Action failed"); }
    };
    return (
        <div className="space-y-6">
            <SectionHeader title="Property Management" />
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Property Details</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Location</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Owner</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Price</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase text-right">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {properties.map(p => (
                            <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900 dark:text-white text-lg">{p.title}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 inline-block px-2 py-0.5 rounded-md mt-1">{p.property_type}</div>
                                </td>
                                <td className="px-8 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-400" /> {p.city}, {p.locality}
                                </td>
                                <td className="px-8 py-5 text-sm font-semibold text-slate-700 dark:text-slate-300">{p.first_name} {p.last_name}</td>
                                <td className="px-8 py-5 text-sm font-extrabold text-slate-900 dark:text-white">₹{p.price.toLocaleString()}</td>
                                <td className="px-8 py-5"><Badge variant={p.status === 'Occupied' ? 'success' : p.status === 'Suspended' ? 'danger' : 'warning'}>{p.status}</Badge></td>
                                <td className="px-8 py-5 text-right flex justify-end gap-3">
                                    <button onClick={() => { setSelectedProp(p); setCurrentImgIdx(0); }} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md rounded-xl transition-all">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => toggleStatus(p.id)} className={`p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all ${p.status === 'Suspended' ? 'text-emerald-500 hover:border-emerald-200' : 'text-rose-500 hover:border-rose-200'}`}>
                                        {p.status === 'Suspended' ? <CheckCircle size={18} /> : <Ban size={18} />}
                                    </button>
                                    <button onClick={() => {
                                        if (window.confirm("Flag this property as Fake/Violating Policy? This will suspend it.")) toggleStatus(p.id);
                                    }} className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 hover:shadow-md rounded-xl transition-all" title="Flag as Fake">
                                        <AlertCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={!!selectedProp} onClose={() => setSelectedProp(null)} title="Property Details">
                {selectedProp && (
                    <div className="space-y-6">
                        {/* Image Gallery */}
                        <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
                            {selectedProp.images && selectedProp.images.length > 0 ? (
                                <>
                                    <img
                                        src={selectedProp.images[currentImgIdx]?.image_url || selectedProp.images[currentImgIdx]?.url}
                                        alt="Property"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    {selectedProp.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImgIdx(prev => (prev === 0 ? selectedProp.images.length - 1 : prev - 1))}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImgIdx(prev => (prev === selectedProp.images.length - 1 ? 0 : prev + 1))}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                {selectedProp.images.map((_, i) => (
                                                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentImgIdx ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <img
                                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"
                                    alt="Property Placeholder"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                ID: #{selectedProp.id}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-start">
                                <h4 className={`font-black text-2xl leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProp.title}</h4>
                                <Badge variant={selectedProp.status === 'Occupied' ? 'success' : selectedProp.status === 'Suspended' ? 'danger' : 'warning'}>
                                    {selectedProp.status}
                                </Badge>
                            </div>
                            <p className="text-slate-500 flex items-center gap-2 mt-2 font-medium">
                                <MapPin size={16} /> {selectedProp.address || `${selectedProp.locality}, ${selectedProp.city}`}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className={`p-5 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Owner Info</p>
                                <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedProp.first_name} {selectedProp.last_name}</p>
                                <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold mt-1.5 break-all">{selectedProp.landlord_email || selectedProp.email}</p>
                            </div>
                            <div className={`p-5 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rental Details</p>
                                <p className={`font-extrabold text-xl ${isDarkMode ? 'text-emerald-400' : 'text-slate-900'}`}>₹{selectedProp.price.toLocaleString()}<span className="text-xs font-medium text-slate-500">/mo</span></p>
                                <p className="text-xs text-slate-500 font-bold mt-1.5">
                                    {selectedProp.area_sqft || 0} sqft • <span className="uppercase">{selectedProp.property_type}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const fetchComplaints = async () => {
        const res = await axios.get(`${API_URL}/complaints`, getAuthConfig());
        setComplaints(res.data);
    };
    useEffect(() => { fetchComplaints(); }, []);
    const resolve = async (id) => {
        try {
            await axios.put(`${API_URL}/complaints/${id}/resolve`, {}, getAuthConfig());
            toast.success("Complaint resolved");
            fetchComplaints();
        } catch (err) { toast.error("Failed"); }
    };
    return (
        <div className="space-y-6">
            <SectionHeader title="Complaints & Issues" />
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Issue Description</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Priority</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {complaints.map(c => (
                            <tr key={c.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900 dark:text-white">{c.title}</div>
                                    <div className="text-sm text-slate-700 dark:text-slate-300 max-w-xs truncate font-medium mt-1">{c.description}</div>
                                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-1 flex items-center gap-1"><Home size={12} /> {c.property_title || "Unknown Property"}</div>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">{c.category}</td>
                                <td className="px-8 py-5"><Badge variant={c.priority_level === 'High' ? 'danger' : 'warning'}>{c.priority_level}</Badge></td>
                                <td className="px-8 py-5"><Badge variant={c.status === 'Resolved' ? 'success' : 'default'}>{c.status}</Badge></td>
                                <td className="px-8 py-5 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => setSelectedComplaint(c)}
                                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md rounded-xl transition-all shadow-sm"
                                        title="View Complaint Details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Complaint Details Modal */}
            <Modal isOpen={!!selectedComplaint} onClose={() => setSelectedComplaint(null)} title="Complaint Details">
                {selectedComplaint && (
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-xl flex items-center justify-between ${selectedComplaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                            <div className="flex items-center gap-3">
                                {selectedComplaint.status === 'Resolved' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                <div>
                                    <p className="font-bold text-sm uppercase tracking-wider">Status</p>
                                    <p className="font-extrabold text-lg">{selectedComplaint.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm uppercase tracking-wider">Priority</p>
                                <p className={`font-extrabold text-lg ${selectedComplaint.priority_level === 'High' ? 'text-rose-600' : 'text-amber-600'}`}>{selectedComplaint.priority_level}</p>
                            </div>
                        </div>

                        {/* Issue Details */}
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Issue Description</p>
                            <h4 className="font-extrabold text-xl text-slate-900 dark:text-white leading-tight mb-2">{selectedComplaint.title}</h4>
                            <p className="text-slate-600 dark:text-slate-300 font-medium bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 leading-relaxed">
                                {selectedComplaint.description}
                            </p>
                            <div className="mt-4 flex gap-4">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{selectedComplaint.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* Property Snapshot */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex gap-4 items-center bg-white dark:bg-slate-800/50">
                            <img
                                src={selectedComplaint.property_images?.[0]?.url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                                alt="Property"
                                className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reported At Property</p>
                                <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedComplaint.property_title}</p>
                                <p className="text-xs text-slate-500 font-medium">{selectedComplaint.property_address || `${selectedComplaint.property_city}, ${selectedComplaint.property_locality}`}</p>
                            </div>
                        </div>

                        {/* Landlord Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Owner</p>
                                <p className="font-bold text-slate-900 dark:text-white">{selectedComplaint.landlord_first_name} {selectedComplaint.landlord_last_name}</p>
                                <p className="text-xs text-indigo-500 font-medium mt-1">{selectedComplaint.landlord_email}</p>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date Reported</p>
                                <p className="font-bold text-slate-900 dark:text-white">{new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{new Date(selectedComplaint.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
const ServiceProviders = () => {
    const [providers, setProviders] = useState([]);
    const [showAdd, setShowAdd] = useState(false);

    const fetchProviders = async () => {
        try {
            const res = await axios.get(`${API_URL}/providers`, getAuthConfig());
            console.log("Providers Response:", res.data); // Debugging
            if (Array.isArray(res.data)) {
                setProviders(res.data);
            } else {
                console.error("Expected array but got:", res.data);
                toast.error("Invalid data format received");
            }
        } catch (err) {
            console.error("Fetch Providers Error:", err);
            toast.error("Failed to load providers: " + (err.response?.data?.message || err.message));
        }
    };
    useEffect(() => { fetchProviders(); }, []);

    const toggleStatus = async (id) => {
        try {
            await axios.put(`${API_URL}/providers/${id}/status`, {}, getAuthConfig());
            fetchProviders();
        } catch (err) { toast.error("Action failed"); }
    };

    const handleDelete = (provider) => {
        Swal.fire({
            title: 'Delete Service Provider?',
            text: `You are about to permanently remove "${provider.company_name}". This will notify the provider (${provider.email}) and deactivate their account.`,
            icon: 'warning',
            input: 'textarea',
            inputPlaceholder: 'Reason for deletion (Terms violation, complaints, etc)...',
            inputAttributes: { 'aria-label': 'Reason for deletion' },
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Delete Provider',
            cancelButtonText: 'Cancel',
            showLoaderOnConfirm: true,
            scrollbarPadding: false,
            backdrop: `rgba(15, 23, 42, 0.4)`,
            customClass: {
                popup: 'rounded-3xl border border-white/20 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
                title: 'text-2xl font-black text-slate-900 dark:text-white',
                htmlContainer: 'text-slate-500 dark:text-slate-400 font-medium',
                confirmButton: 'px-8 py-3 rounded-xl font-bold',
                cancelButton: 'px-8 py-3 rounded-xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            },
            preConfirm: async (reason) => {
                if (!reason) {
                    Swal.showValidationMessage('A reason is required to notify the provider');
                    return false;
                }
                try {
                    await axios.delete(`${API_URL}/providers/${provider.id}`, {
                        data: { reason },
                        ...getAuthConfig()
                    });
                    return true;
                } catch (err) {
                    Swal.showValidationMessage(`Deletion failed: ${err.response?.data?.error || err.message}`);
                    return false;
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Provider has been removed and notified.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-3xl border border-white/20 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl',
                    }
                });
                fetchProviders();
            }
        });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try {
            await axios.post(`${API_URL}/providers`, data, getAuthConfig());
            toast.success("Provider Added & Email Sent");
            setShowAdd(false);
            fetchProviders();
        } catch (err) {
            console.error("Add Provider Error:", err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            toast.error("Failed to add provider: " + errorMsg);
        }
    };
    const serviceStats = React.useMemo(() => {
        const stats = providers.reduce((acc, curr) => {
            acc[curr.service_type] = (acc[curr.service_type] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(stats).map(key => ({ name: key, value: stats[key] }));
    }, [providers]);

    const topProviders = React.useMemo(() => {
        const sorted = [...providers].sort((a, b) => (b.active_jobs_count || 0) - (a.active_jobs_count || 0));
        const totalJobs = sorted.reduce((acc, curr) => acc + (curr.active_jobs_count || 0), 0);

        // Return premium sample data if little to no activity
        if (totalJobs < 3) {
            return [
                { name: 'Sarah Tech', jobs: 24, service: 'Electrical' },
                { name: 'Mike Fix', jobs: 18, service: 'Plumbing' },
                { name: 'Clean Co', jobs: 15, service: 'Check' },
                { name: 'Rapid Repair', jobs: 12, service: 'Maintenance' },
                { name: 'Elite Service', jobs: 8, service: 'Cleaning' }
            ];
        }

        return sorted.slice(0, 5).map(p => ({
            name: p.first_name,
            jobs: p.active_jobs_count || 0,
            service: p.service_type
        }));
    }, [providers]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader title="Service Providers" action={
                <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-300">
                    <Plus size={18} /> Add New Provider
                </button>
            } />

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: Service Distribution */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-indigo-500" /> Service Distribution
                    </h3>
                    <div className="flex-1 min-h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceStats}
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={8}
                                >
                                    {serviceStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-4xl font-black text-slate-800 dark:text-white">
                                {providers.length}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>

                {/* Chart 2: Top Performers (Radial Bar Chart) */}
                <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <BarChartIcon className="w-5 h-5 text-emerald-500" /> Overall Performance Growth
                    </h3>
                    <div className="flex-1 min-h-[300px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                                { month: 'Aug', jobs: 12 },
                                { month: 'Sep', jobs: 18 },
                                { month: 'Oct', jobs: 25 },
                                { month: 'Nov', jobs: 30 },
                                { month: 'Dec', jobs: 45 },
                                { month: 'Jan', jobs: 68 }
                            ]}>
                                <defs>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <Tooltip
                                    cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontWeight: 'bold', color: '#10b981' }}
                                />
                                <Area type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorJobs)" activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Provider Details</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Service</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Area</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Active Jobs</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Contact</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {providers.map(p => (
                            <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                <td className="px-8 py-5">
                                    <div className="font-bold text-slate-900 dark:text-white">{p.first_name} {p.last_name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{p.company_name}</div>
                                    <div className="text-[10px] text-indigo-500 mt-0.5">{p.email}</div>
                                </td>
                                <td className="px-8 py-5"><Badge variant="purple">{p.service_type}</Badge></td>
                                <td className="px-8 py-5 text-sm font-medium">{p.service_area}</td>
                                <td className="px-8 py-5 font-bold text-indigo-600 pl-12">{p.active_jobs_count || 0}</td>
                                 <td className="px-8 py-5 text-sm text-slate-500 font-medium">{p.phone}</td>
                                <td className="px-8 py-5"><Badge variant={p.status === 'Active' ? 'success' : 'danger'}>{p.status}</Badge></td>
                                <td className="px-8 py-5 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => toggleStatus(p.id)} title={p.status === 'Active' ? 'Suspend' : 'Activate'} className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all ${p.status === 'Active' ? 'bg-white dark:bg-slate-800 text-rose-500 hover:border-rose-200' : 'bg-white dark:bg-slate-800 text-emerald-500 hover:border-emerald-200'}`}>
                                            {p.status === 'Active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button onClick={() => handleDelete(p)} title="Delete Provider" className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Service Provider">
                <form onSubmit={handleAdd} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                            <input name="first_name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white" placeholder="John" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                            <input name="last_name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white" placeholder="Doe" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                        <input name="company_name" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white" placeholder="e.g. RapidFix Plumbing" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Type</label>
                            <select name="service_type" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white">
                                <option>Plumbing</option>
                                <option>Electrical</option>
                                <option>Cleaning</option>
                                <option>Maintenance</option>
                                <option>All in one</option>
                                <option>Painting</option>
                                <option>Interiors and Renovation</option>
                                <option>Carpentary</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Service Area</label>
                            <input name="service_area" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white" placeholder="City/Region" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g. name@example.com)"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white" 
                                placeholder="contact@company.com" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                            <input name="phone" required className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-white" placeholder="+91 9876543210" />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200">Register Provider</button>
                </form>
            </Modal>
        </div>
    );
};
const Payments = () => {
    const [payments, setPayments] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/payments`, getAuthConfig()).then(res => setPayments(res.data));
    }, []);
    return (
        <div className="space-y-6">
            <SectionHeader title="Payments & Revenue" />
            <div className="grid grid-cols-3 gap-6 mb-6">
                <StatCard label="Total Revenue" value={`₹${payments.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}`} icon={CreditCard} color="emerald" sub="Lifetime Collection" />
                <StatCard label="Rent Collected" value={`₹${payments.filter(p => p.type !== 'Service').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}`} icon={Building2} color="blue" sub="Property Rents" />
                <StatCard label="Service Charges" value={`₹${payments.filter(p => p.type === 'Service').reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}`} icon={Wrench} color="amber" sub="Maintenance Fees" />
            </div>
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Transaction ID</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date & Time</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {payments.map(p => {
                            const paymentDate = p.date || p.created_at || p.timestamp;
                            const formattedDate = paymentDate ? new Date(paymentDate).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }) : "N/A";

                            return (
                                <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <CreditCard size={14} className="text-indigo-500" />
                                            </div>
                                            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                                                TXN_{String(p.id).padStart(6, '0')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{formattedDate}</td>
                                    <td className="px-8 py-5 font-bold text-slate-900 dark:text-white text-lg">₹{Number(p.amount || 0).toLocaleString()}</td>
                                    <td className="px-8 py-5"><Badge variant="success">Completed</Badge></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/logs`, getAuthConfig()).then(res => setLogs(res.data));
    }, []);
    return (
        <div className="space-y-6">
            <SectionHeader title="Audit Logs" />
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/60 dark:border-slate-700">
                        <tr>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Action Description</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Performed By</th>
                            <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {logs.map(l => (
                            <tr key={l.id} className="hover:bg-indigo-50/30 transition-colors duration-150 group">
                                <td className="px-8 py-5 text-sm text-slate-700 dark:text-slate-200 font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{l.action}</td>
                                <td className="px-8 py-5">
                                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 px-3 py-1.5 rounded-xl inline-block shadow-sm">{l.performed_by}</span>
                                </td>
                                <td className="px-8 py-5 text-xs text-slate-500 dark:text-slate-400 font-bold">{new Date(l.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
// --- NEW SECTION: LIVE SERVICE TRACKER ---
const LiveServiceTracker = () => {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState({ active: 0, pending: 0, completed: 0 });
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        const fetchTrackerData = async () => {
            try {
                const res = await axios.get(`${API_URL}/tracker`, getAuthConfig());
                setJobs(res.data.jobs);
                setStats(res.data.stats);
            } catch (err) {
                console.error("Failed to fetch tracker data", err);
            }
        };
        fetchTrackerData();
        const interval = setInterval(fetchTrackerData, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <SectionHeader title="Live Service Tracker" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Currently Active</p>
                        <h3 className="text-4xl font-black mt-2">{stats.active}</h3>
                        <p className="text-xs mt-4 flex items-center gap-1"><Zap size={12} className="text-amber-300 animate-pulse" /> Live monitoring enabled</p>
                    </div>
                    <Activity size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                </div>
                <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg`}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Dispatch</p>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{stats.pending}</h3>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-amber-500 w-[40%] rounded-full" />
                    </div>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg`}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resolved Today</p>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-2">{stats.completed}</h3>
                    <p className="text-xs text-emerald-500 font-bold mt-4 flex items-center gap-1"><CheckCircle size={12} /> +24% from yesterday</p>
                </div>
            </div>

            <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h4 className="font-bold text-slate-800 dark:text-white">Active Maintenance Jobs</h4>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Real-time Feed</span>
                    </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {jobs.map(job => (
                        <div key={job.id} className="p-6 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${job.priority === 'Critical' ? 'bg-rose-100 text-rose-600' :
                                    job.priority === 'High' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    <Wrench size={20} />
                                </div>
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white">{job.issue || job.service_type || 'Maintenance Request'}</h5>
                                    <p className="text-xs text-slate-500 font-medium">Tenant: {job.tenant} • <span className="text-indigo-500">{new Date(job.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Provider</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{job.provider || 'Unassigned'}</p>
                                </div>
                                <div className="min-w-[120px]">
                                    <Badge variant={job.status === 'In Progress' ? 'blue' : job.status === 'Dispatched' ? 'warning' : 'default'}>{job.status}</Badge>
                                </div>
                                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- NEW SECTION: REVENUE ANALYTICS ---
const RevenueAnalytics = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const performanceData = [
        { name: 'Mon', revenue: 4200, profit: 3100 },
        { name: 'Tue', revenue: 3800, profit: 2800 },
        { name: 'Wed', revenue: 5100, profit: 3900 },
        { name: 'Thu', revenue: 4500, profit: 3400 },
        { name: 'Fri', revenue: 6200, profit: 4800 },
        { name: 'Sat', revenue: 7500, profit: 5900 },
        { name: 'Sun', revenue: 6800, profit: 5200 },
    ];

    const distributionData = [
        { name: 'Rent', value: 75 },
        { name: 'Services', value: 15 },
        { name: 'Late Fees', value: 10 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <SectionHeader title="Financial Insights" action={
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:shadow-md transition-all">
                    <Download size={14} /> Export Report
                </button>
            } />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl border border-white/50 dark:border-slate-700 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Revenue Velocity</h4>
                            <p className="text-xs text-slate-500 font-medium">Daily transaction volume & profit margins</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                <span className="text-[10px] font-bold text-slate-500">REVENUE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                <span className="text-[10px] font-bold text-slate-500">PROFIT</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fill="none" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden flex-1">
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Platform Take</p>
                            <h3 className="text-3xl font-black mt-2">₹1,24,500</h3>
                            <p className="text-xs text-white/60 mt-4 leading-relaxed">Total platform commission collected this billing cycle.</p>
                        </div>
                        <TrendingUp size={100} className="absolute -right-4 -bottom-4 text-white opacity-5" />
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl flex-1`}>
                        <h4 className="font-bold text-slate-800 dark:text-white mb-6 text-sm">Income Sources</h4>
                        <div className="h-[150px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distributionData} innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                                        {distributionData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                            {distributionData.map((d, i) => (
                                <div key={i} className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-2 font-bold text-slate-500">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} /> {d.name}
                                    </span>
                                    <span className="font-black text-slate-900 dark:text-white">{d.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Payment Success", val: "99.2%", sub: "Last 30 days", icon: ShieldCheck, color: "emerald" },
                    { label: "Pending Payouts", val: "₹18k", sub: "Processing...", icon: CreditCard, color: "indigo" },
                    { label: "Avg. Transaction", val: "₹4.2k", sub: "Trending up", icon: Activity, color: "blue" },
                    { label: "Refunds", val: "0.1%", sub: "Historically low", icon: XCircle, color: "rose" },
                ].map((stat, i) => (
                    <div key={i} className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white'} p-6 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all`}>
                        <div className={`w-10 h-10 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <h5 className="text-2xl font-black text-slate-900 dark:text-white">{stat.val}</h5>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-2 italic">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const Adminpage = () => {
    const { theme, toggleTheme } = useTheme(); // Hook theme context
    const navigate = useNavigate();
    const { "*": tabSlug } = useParams();
    const activeView = tabSlug || 'overview';

    const setActiveView = (view) => {
        navigate(`/admin/dashboard/${view}`);
    };
    const [overviewStats, setOverviewStats] = useState(null);
    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const res = await axios.get(`${API_URL}/overview`, getAuthConfig());
                setOverviewStats(res.data);
            } catch (err) {
                console.error("Failed to load admin overview", err);
                toast.error("Failed to load dashboard data. Please check backend connection.");
            }
        };
        fetchOverview();
    }, []);
    const renderContent = () => {
        switch (activeView) {
            case 'overview': return <Overview stats={overviewStats} />;
            case 'users': return <UserManagement />;
            case 'properties': return <PropertyManagement />;
            case 'complaints': return <ComplaintManagement />;
            case 'providers': return <ServiceProviders />;
            case 'payments': return <Payments />;
            case 'tracker': return <LiveServiceTracker />;
            case 'analytics': return <RevenueAnalytics />;
            case 'logs': return <AuditLogs />;
            default: return <Overview stats={overviewStats} />;
        }
    };
    // --- ADMIN PROFILE & LOGOUT ---
    const [adminProfile, setAdminProfile] = useState({ name: "Administrator", email: "admin@rentease.com", initial: "A" });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setAdminProfile({
                    name: user.name || `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    initial: (user.first_name?.[0] || "A").toUpperCase()
                });
            }
        } catch (err) {
            console.error("Failed to parse user data", err);
        }
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout", {}, getAuthConfig());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            toast.success("Logged out successfully");
            setTimeout(() => window.location.href = "/", 500);
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 flex overflow-hidden relative transition-colors duration-500">
            {/* Background Ambience Bubble */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200/50 dark:from-slate-900/50 to-transparent pointer-events-none z-0" />
            <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" />
            <div className="absolute top-40 left-60 w-72 h-72 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[80px] pointer-events-none z-0 animate-pulse delay-1000" />
            {/* Sidebar - Glassmorphism */}
            <aside className="w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col text-slate-600 dark:text-slate-300 z-50 border-r border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-300">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <img src={logo} alt="RentEase" className="h-12 min-w-13 rounded-lg" />
                        <div>
                            <h1 className="text-2xl relative right-5 font-extrabold text-slate-900 dark:text-white tracking-tight">RentEase</h1>
                            {/* <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-400 font-bold">Admin</p> */}
                        </div>
                    </div>
                </div>
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                        { id: 'users', label: 'User Management', icon: Users },
                        { id: 'properties', label: 'Properties', icon: Building2 },
                        { id: 'complaints', label: 'Complaints', icon: MessageSquare },
                        { id: 'tracker', label: 'Service Tracker', icon: Activity },
                        { id: 'providers', label: 'Service Providers', icon: Wrench },
                        { id: 'payments', label: 'Financials', icon: CreditCard },
                        { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
                        { id: 'logs', label: 'System Logs', icon: History },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeView === item.id
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold shadow-md shadow-indigo-500/30 dark:shadow-indigo-900/50'
                                : 'hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-white font-medium text-slate-500 dark:text-slate-400'
                                }`}
                        >
                            <item.icon size={18} className={`transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="relative z-10 text-sm">{item.label}</span>
                            {activeView === item.id && <ChevronRight size={14} className="ml-auto opacity-60" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 font-bold transition-all duration-300 group"
                    >
                        <LogOut size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
            {/* Main Content Wrapper */}
            <div className="flex-1 ml-72 flex flex-col h-screen relative z-10">
                {/* Top Navbar */}
                <header className="h-20 px-8 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-500">
                    {/* Left: Section Title or Welcome */}
                    <div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-indigo-600 dark:from-slate-200 dark:to-indigo-400 tracking-tight">Admin Dashboard</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{adminProfile.name.split(' ')[0]}</span></p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6">
                        {/* Theme Toggle */}
                        <div className="scale-90">
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{adminProfile.name}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{adminProfile.email}</p>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-offset-2 ring-indigo-500/0 dark:ring-slate-900 group-hover:ring-indigo-500/20 transition-all">
                                    {adminProfile.initial}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-10 overflow-y-auto scroll-smooth">
                    {renderContent()}
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};
export default Adminpage;