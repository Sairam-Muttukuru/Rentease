import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard, ClipboardList, Wallet, UserCircle, BarChart3, Bell, CheckCircle2, Clock,
    AlertCircle, MapPin, Phone, Calendar, ChevronRight, Menu, X, XCircle, TrendingUp, TrendingDown,
    Star, MessageSquare, Search, LogOut, CreditCard, Zap, CalendarCheck, Mail, LifeBuoy, MessageCircle, FileText,
    Building2, Sun, Moon, LayoutGrid, Plus, Edit2, Trash2, Home, Sparkles, Paintbrush, Fan, Hammer, Wrench, Lock,
    Briefcase, Hourglass, IndianRupee, Eye, EyeOff, Camera, Upload, Loader, Layers, Image, Check, MoreVertical, Paperclip, Send
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- HELPER: IMMEDIATE CHART WRAPPER (Removed Lazy Delay) ---
const LazyChart = ({ children }) => {
    return children;
};
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import logo from "/favicon.png"; // UPDATED LOGO

const ICON_MAP = {
    Fan, Sparkles, Zap, Paintbrush, Wrench, Hammer, Home, Star, LayoutGrid, ClipboardList
};

const API_BASE_URL = "http://localhost:5000/api/service-provider";

// Axios Interceptor for Auth
const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- MOCK DATA & CONSTANTS ---
const INITIAL_STATS = { totalServices: 0, activeServices: 0, pendingJobs: 0, totalEarnings: 0 };

// 2. INITIAL PROVIDER PROFILE
const INITIAL_PROFILE = {
    city: "",
    experience: 0,
    about: "",
    about_us: "",
    skills: [],
    isOnline: true,
    company_name: "",
    service_type: "",
    phone: ""
};

// 3. INITIAL SERVICES (My Services) - Fallback
const INITIAL_MY_SERVICES = [];

// 4. BOOKINGS DATA (Service Jobs)
const INITIAL_BOOKINGS = [
    { id: "BK-9012", service: "Tap Washer Replacement", customer: "Sarah Johnson", address: "123 Maple Ave, Apt 4B", date: "2024-05-20", time: "10:00 AM", amount: 149, status: "Assigned", priority: "High" },
    { id: "BK-8841", service: "Indian Toilet Installation", customer: "Michael Chen", address: "782 Pine St, Unit 12", date: "2024-05-19", time: "02:00 PM", amount: 1279, status: "In Progress", priority: "Critical" },
    { id: "BK-8722", service: "Bathroom Deep Clean", customer: "Emily Davis", address: "45 Oak Lane", date: "2024-05-18", time: "11:00 AM", amount: 699, status: "Completed", priority: "Medium" },
];

// 5. ANALYTICS DATA
const MOCK_REVENUE_DATA = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 2100 },
    { name: 'Wed', revenue: 800 },
    { name: 'Thu', revenue: 1600 },
    { name: 'Fri', revenue: 2900 },
    { name: 'Sat', revenue: 3400 },
    { name: 'Sun', revenue: 1900 },
];

const MOCK_SERVICE_DISTRIBUTION = [
    { name: 'Plumbing', value: 45, color: '#6366f1' },
    { name: 'Cleaning', value: 30, color: '#10b981' },
    { name: 'AC Repair', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#64748b' },
];

const MOCK_WEEKLY_ACTIVITY = [
    { name: 'Mon', completed: 2, pending: 1 },
    { name: 'Tue', completed: 4, pending: 0 },
    { name: 'Wed', completed: 1, pending: 2 },
    { name: 'Thu', completed: 3, pending: 1 },
    { name: 'Fri', completed: 5, pending: 0 },
    { name: 'Sat', completed: 6, pending: 1 },
    { name: 'Sun', completed: 2, pending: 0 },
];

const MOCK_STOCK_DATA = [
    { name: 'Pipes', available: 45 },
    { name: 'Wiring', available: 28 },
    { name: 'Paint', available: 15 },
    { name: 'Tools', available: 60 },
    { name: 'Filters', available: 32 },
];

const MOCK_REVIEWS = [
    { id: 1, user: "Alice Freeman", rating: 5, comment: "Excellent service! Fixed the leak in no time.", date: "2 days ago", avatar: "AF" },
    { id: 2, user: "Bob Smith", rating: 4, comment: "Good work, but arrived slightly late.", date: "1 week ago", avatar: "BS" },
    { id: 3, user: "Charlie Davis", rating: 5, comment: "Very professional and clean. Highly recommended!", date: "2 weeks ago", avatar: "CD" },
];

const MOCK_SCHEDULE = [
    { id: 1, service: "Full Home Cleaning", time: "09:00 AM", date: "Tomorrow", address: "Highland Park, Apt 405", status: "Confirmed" },
    { id: 2, service: "AC Filter Change", time: "02:00 PM", date: "Tomorrow", address: "Sunshine Villas, #12", status: "Pending" },
    { id: 3, service: "Tap Repair", time: "11:00 AM", date: "Wed, May 22", address: "Oak Street, 55B", status: "Confirmed" },
];

// --- HELPERS ---
const getServiceImage = (serviceName = "") => {
    // If it's a URL already, return it
    if (typeof serviceName === 'string' && serviceName.startsWith('http')) return serviceName;

    const s = String(serviceName).toLowerCase();

    // 1. Check for local PNG mappings (High Priority)
    if (s.includes('ac') || s.includes('appliance') || s.includes('geyser') || s.includes('washing') || s.includes('refrigerator')) return "/ac.png";
    if (s.includes('cleaning')) return "/cleaning.png";
    if (s.includes('elect')) return "/electrical.png";
    if (s.includes('paint')) return "/painting.png";
    if (s.includes('plumb') || s.includes('tap') || s.includes('toilet')) return "/plumbing.png";

    return "/cleaning.png"; // Global Fallback
};

// --- PREMIUM COMPONENTS (Ported from Admin Layout) ---
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none shadow-inner border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"}`}>
            <div className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center ${theme === "dark" ? "translate-x-7 bg-slate-900" : "translate-x-0 bg-white"}`}>
                {theme === "dark" ? <Moon size={12} className="text-orange-400" /> : <Sun size={12} className="text-amber-500" />}
            </div>
        </button>
    );
};

const StatCard = ({ label, value, icon: Icon, color, sub, trend, trendUp }) => (
    <div className="relative overflow-hidden group p-6 rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex justify-between items-start">
            <div className="relative z-10">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight leading-none">{value}</h3>
                <div className="flex items-center gap-2 mt-2">
                    {trend && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trend}
                        </div>
                    )}
                    {sub && <p className={`text-xs font-bold ${sub.includes('Action') ? 'text-sky-500' : 'text-indigo-500'}`}>{sub}</p>}
                </div>
            </div>
            <div className={`p-4 rounded-2xl bg-${color}-500 text-white shadow-lg shadow-${color}-500/30 transform group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            {/* Background Glow */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${color}-500/10 blur-2xl rounded-full transition-opacity group-hover:opacity-100 opacity-50`} />
        </div>
    </div>
);

const SectionHeader = ({ title, action }) => (
    <div className="flex justify-between items-center mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
        <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full mt-2" />
        </div>
        {action}
    </div>
);

// --- 0. CLOUDINARY UPLOAD HELPER ---
const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "First_project");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/dghdwtef5/image/upload",
        {
            method: "POST",
            body: fd
        }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
};

// --- 1. PROFILE VIEW COMPONENT ---

const ProfileView = ({ user, profile, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...profile });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setFormData({ ...profile });
    }, [profile]);

    const handleSave = () => {
        onUpdate(formData);
        setIsEditing(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const imageUrl = await uploadToCloudinary(file);
            const updatedData = { ...formData, avatar_url: imageUrl };
            setFormData(updatedData);
            await onUpdate(updatedData);
        } catch (err) {
            console.error("Image Upload sync error:", err);
        } finally {
            setIsUploading(false);
        }
    };

    // Password Update Logic
    const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
    const [passwordMessage, setPasswordMessage] = useState("");
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordUpdate = async () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            toast.error('All fields are required.');
            return;
        }
        if (passwordForm.new !== passwordForm.confirm) {
            toast.error('New passwords do not match.');
            return;
        }
        if (passwordForm.new.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/change-password', {
                currentPassword: passwordForm.current,
                newPassword: passwordForm.new
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            toast.success('Password updated successfully!');
            setPasswordForm({ current: "", new: "", confirm: "" });
            setPasswordMessage("");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || "Failed to update password";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="MY PROFILE" action={
                !isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
                        <Edit2 size={16} /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-4">
                        <button onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-400 hover:text-white font-bold tracking-widest text-xs uppercase hover:bg-white/5 rounded-xl transition-all">Cancel</button>
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold tracking-widest text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                            <CheckCircle2 size={16} /> Save Changes
                        </button>
                    </div>
                )
            } />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Visual Identity Card */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-900/50 to-blue-900/50 opacity-40" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

                    {/* Avatar */}
                    <div className="relative z-10 w-48 h-48 rounded-full p-1.5 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 mb-8 shadow-lg group/avatar hover:scale-105 transition-all duration-500">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 relative">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-500">
                                    {(formData.company_name?.[0] || user?.first_name?.[0] || 'P').toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Upload Trigger */}
                        <label className={`absolute bottom-2 right-2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg border-4 border-slate-950 hover:bg-indigo-500 transition-all hover:scale-110 z-20 ${!isEditing && 'hidden'}`}>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading || !isEditing} />
                            {isUploading ? <Loader size={20} className="animate-spin" /> : <Camera size={20} />}
                        </label>
                    </div>

                    <div className="relative z-10 w-full">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight truncate px-2">
                            {formData.company_name || 'Service Partner'}
                        </h2>
                        {formData.company_name && (
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">
                                {user?.first_name} {user?.last_name}
                            </p>
                        )}

                        <div className="space-y-3 mt-6">
                            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{formData.phone || user?.phone || 'No Phone'}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center gap-4">
                            <span className="px-4 py-2 bg-indigo-900/30 text-indigo-400 rounded-lg text-[10px] font-black border border-indigo-500/20 uppercase tracking-widest">
                                {formData.service_type || 'General'}
                            </span>
                            <span className="px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/20 uppercase tracking-widest">
                                {formData.experience || 0} YRS EXP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Form */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                        {/* Company Name */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Company Name</label>
                            <input
                                disabled={!isEditing}
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="Enter company name"
                            />
                        </div>
                        {/* Service Type */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Service Type</label>
                            <input
                                disabled={!isEditing}
                                value={formData.service_type}
                                onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="e.g. Plumbing"
                            />
                        </div>
                        {/* Phone */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                            <input
                                disabled={!isEditing}
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="+91..."
                            />
                        </div>
                        {/* City */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Service Area</label>
                            <input
                                disabled={!isEditing}
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="City"
                            />
                        </div>
                        {/* Experience */}
                        <div className="group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">Experience (Years)</label>
                            <input
                                type="number"
                                disabled={!isEditing}
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                placeholder="0"
                            />
                        </div>

                        {/* About Me */}
                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">About Me</label>
                            <textarea
                                disabled={!isEditing}
                                rows={4}
                                value={formData.about}
                                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-medium text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none text-sm leading-relaxed"
                                placeholder="Tell customers about your expertise..."
                            />
                        </div>

                        {/* Availability Toggle */}
                        <div className="md:col-span-2 pt-6 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Service Availability</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Turn off to stop receiving new bookings temporarily.</p>
                                </div>
                                <button
                                    disabled={!isEditing}
                                    onClick={() => setFormData({ ...formData, isOnline: !formData.isOnline })}
                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none ${formData.isOnline ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-700'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${formData.isOnline ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings Section - Clean Styled */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-bottom-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security Settings</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Update your password to keep your account secure.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-end">
                    {[
                        { label: 'Current Password', field: 'current' },
                        { label: 'New Password', field: 'new' },
                        { label: 'Confirm Password', field: 'confirm' }
                    ].map((item, idx) => (
                        <div key={idx} className="relative group">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 block">{item.label}</label>
                            <div className="relative">
                                <input
                                    type={showPasswords[item.field] ? "text" : "password"}
                                    value={passwordForm[item.field]}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, [item.field]: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 pr-12 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility(item.field)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                    {showPasswords[item.field] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex-1">
                        {passwordMessage && (
                            <p className={`text-sm font-bold flex items-center gap-2 animate-in slide-in-from-left ${passwordMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {passwordMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                                {passwordMessage.text}
                            </p>
                        )}
                    </div>
                    <button onClick={handlePasswordUpdate} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/20 tracking-widest text-xs uppercase">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. CATEGORY CARD COMPONENT ---
const CategoryCard = ({ category }) => {
    const Icon = ICON_MAP[category.icon_name] || ICON_MAP[category.icon] || LayoutGrid;
    const colorClasses = {
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        purple: "bg-purple-500",
        indigo: "bg-indigo-500"
    };

    return (
        <div className="relative group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="h-40 overflow-hidden relative">
                <img src={category.image_url || category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className={`p-2 ${colorClasses[category.color] || 'bg-slate-500'} text-white rounded-xl shadow-lg ring-4 ring-white/20`}>
                        <Icon size={18} />
                    </div>
                    <span className="text-white font-black text-lg tracking-tight">{category.name}</span>
                </div>
            </div>
        </div>
    );
};

// --- 3. ADD SERVICE VIEW (Simplified Search & Select) ---
// --- 2. HIERARCHICAL SERVICE MANAGEMENT HELPERS ---

const LevelTitle = ({ title, onBack, breadcrumbs }) => (
    <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                    <span className={i === breadcrumbs.length - 1 ? "text-indigo-500" : "cursor-pointer hover:text-slate-600"} onClick={b.onClick}>
                        {b.label}
                    </span>
                    {i < breadcrumbs.length - 1 && <ChevronRight size={12} />}
                </React.Fragment>
            ))}
        </div>
        <div className="flex items-center gap-4">
            {onBack && (
                <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <ChevronRight size={24} className="rotate-180 text-slate-600 dark:text-slate-400" />
                </button>
            )}
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        </div>
    </div>
);

const AddEntityCard = ({ label, onClick, icon: Icon = Plus }) => (
    <button
        onClick={onClick}
        className="group relative flex flex-col items-center justify-center p-8 bg-dashed border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all duration-300 h-full min-h-[220px]"
    >
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <Icon size={32} />
        </div>
        <span className="text-slate-600 dark:text-slate-400 font-bold group-hover:text-indigo-600 transition-colors uppercase tracking-widest text-xs">{label}</span>
    </button>
);

const EntityCard = ({ item, onClick, onDelete, onEdit, type = "category" }) => {
    const Icon = ICON_MAP[item.icon_name] || LayoutGrid;
    return (
        <div
            onClick={() => onClick(item)}
            className="group relative bg-white dark:bg-slate-800 rounded-3xl p-0 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2 h-full"
        >
            {/* Background Accent */}
            <div className={`absolute -right-12 -top-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />

            <div className="h-64 overflow-hidden relative">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                        {/* Fallback to first letter if no icon, or generic icon */}
                        {Icon ? <Icon size={64} /> : <span className="text-6xl font-black opacity-20">{item.name?.charAt(0)}</span>}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Management Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-xl transition-all border border-white/20"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            Swal.fire({
                                title: `Delete ${type}?`,
                                text: `Are you sure you want to delete "${item.name}"? This cannot be undone.`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#ef4444',
                                cancelButtonColor: '#64748b',
                                confirmButtonText: 'Yes, delete it!'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    onDelete(item.id);
                                }
                            });
                        }}
                        className="p-2 bg-rose-500/80 hover:bg-rose-600 backdrop-blur-md text-white rounded-xl transition-all border border-rose-400/20"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6">
                    <h3 className="text-2xl font-black text-white mb-2 leading-tight">{item.name}</h3>
                    <p className="text-slate-200/80 text-sm font-medium line-clamp-2">
                        {item.description || (type === "category" ? `Manage ${item.name} services` : (type === 'type' ? `Manage ${item.name} sub-types` : `Explore ${item.name} offerings`))}
                    </p>
                </div>
            </div>
        </div>
    );
};


const AddEntityForm = ({ type, label, onSave, onCancel, parentId, initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        price: initialData?.base_price || initialData?.price || "",
        image: null,
        preview: initialData?.image_url || null
    });

    const [descriptionPoints, setDescriptionPoints] = useState(() => {
        if (!initialData?.description) return [""];
        // Split by newline and remove starting bullets if present
        return initialData.description.split('\n').map(p => p.replace(/^[•\s-\*]+/, '')).filter(p => p.trim() !== "").length > 0
            ? initialData.description.split('\n').map(p => p.replace(/^[•\s-\*]+/, ''))
            : [""];
    });

    // Sync points to description
    useEffect(() => {
        const desc = descriptionPoints.filter(p => p.trim() !== "").map(p => `• ${p}`).join('\n');
        setFormData(prev => ({ ...prev, description: desc }));
    }, [descriptionPoints]);

    const handlePointChange = (index, value) => {
        const newPoints = [...descriptionPoints];
        newPoints[index] = value;
        setDescriptionPoints(newPoints);
    };

    const addPoint = () => {
        setDescriptionPoints([...descriptionPoints, ""]);
    };

    const removePoint = (index) => {
        if (descriptionPoints.length > 1) {
            setDescriptionPoints(descriptionPoints.filter((_, i) => i !== index));
        } else {
            setDescriptionPoints([""]); // Clear if last one
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                image: file,
                preview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.warning(`Please enter a ${label || type} name`);
        if (type === 'service' && !formData.price) return toast.warning("Please enter the service cost");
        if ((type === 'service' || type === 'sub-type') && !formData.description) return toast.warning("Please enter at least one description point");

        setIsLoading(true);

        try {
            let imageUrl = null;
            if (formData.image instanceof File) {
                imageUrl = await uploadToCloudinary(formData.image);
            }

            const payload = {
                ...initialData, // CRITICAL: Preserve IDs (service_id, type_id, etc.)
                ...formData,
                image_url: imageUrl || formData.preview || null,
            };

            if (type === 'type') {
                payload.category_id = parentId;
            } else if (type === 'sub-type') {
                payload.type_id = parentId;
            } else if (type === 'service') {
                payload.type_id = parentId;
            }

            await onSave(payload, initialData?.id);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 lg:pl-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" onClick={onCancel}>
            <div
                onClick={e => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col relative my-auto"
            >
                {/* Header */}
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-widest uppercase">
                            {initialData ? `EDIT ${label || type}` : `CREATE NEW ${label || type}`}
                        </h2>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full mt-2"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Left Column: Inputs */}
                        <div className="space-y-8">
                            {/* Name Input */}
                            <div className="group">
                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={`Enter ${label || type || 'name'}...`}
                                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all shadow-sm text-lg"
                                    autoFocus
                                />
                            </div>

                            {/* Service Specific Inputs */}
                            {type === 'service' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
                                    <div className="group">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">Service Cost</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-6 text-2xl font-black text-indigo-500 pointer-events-none">₹</span>
                                            <input
                                                type="number"
                                                required
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                placeholder="1500"
                                                onWheel={(e) => e.target.blur()}
                                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-black text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all shadow-sm text-2xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">Description (Key Points)</label>
                                        <div className="space-y-3">
                                            {descriptionPoints.map((point, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                                                    <input
                                                        value={point}
                                                        onChange={(e) => handlePointChange(index, e.target.value)}
                                                        placeholder={`Point ${index + 1}...`}
                                                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all shadow-sm"
                                                    />
                                                    {descriptionPoints.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removePoint(index)}
                                                            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addPoint}
                                                className="mt-2 w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 font-bold hover:border-indigo-500 hover:text-indigo-500 dark:hover:border-indigo-500 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={16} /> Add Point
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Image Upload */}
                        <div className="flex flex-col">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 block">Cover Image</label>
                            <div className="flex-1 relative group cursor-pointer">
                                <div className={`w-full h-full min-h-[300px] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden relative
                                    ${formData.preview ? 'border-indigo-500/50 bg-slate-50 dark:bg-slate-900' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />

                                    {formData.preview ? (
                                        <>
                                            <img src={formData.preview} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity duration-300" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                                                <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-indigo-400 font-bold border border-indigo-500/30 flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                                    <Camera size={18} /> Change Cover
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">
                                            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform duration-300">
                                                <Plus size={32} />
                                            </div>
                                            <span className="font-bold text-sm tracking-widest uppercase">Upload Cover Image</span>
                                            <span className="text-xs mt-2 opacity-50">JPG, PNG (Max 5MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-12 flex justify-end gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-8 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold tracking-widest text-xs uppercase hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs tracking-widest uppercase shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-95 transition-all flex items-center gap-2"
                        >
                            {isLoading ? <Loader className="animate-spin" size={16} /> : <Plus size={18} />}
                            {initialData ? `Save ${label || type}` : `Create ${label || type}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- 3. DASHBOARD VIEWS ---

// --- 4. BOOKINGS VIEW (Service Jobs Workflow) ---
const BookingsView = ({ bookings, onUpdateStatus }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'New Request': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Accepted': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300';
            case 'In Progress': return 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
            case 'Rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Service Bookings" />
            <div className="grid gap-6">
                {bookings.map(job => (
                    <div key={job.id} className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-5 rounded-[2rem] border border-slate-200/50 dark:border-white/10 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group relative overflow-hidden">
                        {/* Status Glow Background (Smaller) */}
                        <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none 
                            ${job.status === 'Accepted' || job.status === 'Completed' ? 'bg-emerald-500' :
                                job.status === 'Rejected' ? 'bg-rose-500' : 'bg-indigo-500'}`} />

                        <div className="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-1">
                                {/* Compact Image Section */}
                                <div className="relative shrink-0">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                        <img
                                            src={getServiceImage(job.service)}
                                            alt={job.service}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md 
                                        ${job.priority === 'Critical' ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white'}`}>
                                        {job.priority === 'Critical' ? <AlertCircle size={16} /> : <CalendarCheck size={16} />}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left min-w-0">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate max-w-full">
                                            {job.service || job.service_name}
                                        </h3>
                                        <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                                        {/* Column 1: Customer & Time */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</span>
                                                <p className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate">
                                                    {job.customer || "Unknown Customer"}
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scheduled Time</span>
                                                <p className="text-slate-800 dark:text-slate-200 font-bold text-[13px] flex items-center gap-2">
                                                    <Calendar size={14} className="text-indigo-500 shrink-0" />
                                                    <span className="truncate">
                                                        {job.booking_date ? new Date(job.booking_date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Date N/A'}
                                                        {job.booking_time ? <span className="text-slate-400 font-medium ml-1">at {job.booking_time}</span> : ''}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Column 2: Classification (Service Type & Category) */}
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Type</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm">
                                                        <Zap size={14} className="fill-current" />
                                                    </div>
                                                    <p className="text-slate-800 dark:text-slate-200 font-bold text-sm truncate uppercase tracking-tight">
                                                        {job.category_name || "General"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</span>
                                                <div className="mt-0.5 inline-flex">
                                                    <span className="px-2.5 py-1 bg-white dark:bg-slate-700/50 text-indigo-600 dark:text-indigo-300 rounded-full border border-indigo-100 dark:border-indigo-900/50 text-[10px] font-black uppercase tracking-wider shadow-sm">
                                                        {job.type_name || "Standard"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Column 3: Location */}
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                                            <p className="text-slate-500 dark:text-slate-400 font-bold text-[13px] leading-relaxed line-clamp-2">
                                                <MapPin size={12} className="text-slate-400 inline-block mr-1.5 relative -top-0.5" />
                                                {job.address || "No Address Provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:dark:border-slate-700/50 lg:pl-6 min-w-[200px]">
                                <div className="text-center lg:text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Payout</p>
                                    <div className="flex items-baseline justify-center lg:justify-end gap-0.5">
                                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{'\u20B9'}</span>
                                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{job.amount}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center lg:justify-end gap-2 w-full">
                                    {(job.status === 'Assigned' || job.status === 'Pending' || job.status === 'New Request') && (
                                        <>
                                            <button onClick={() => onUpdateStatus(job.id, 'Rejected')} className="px-4 py-2 text-slate-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10">
                                                Reject
                                            </button>
                                            <button onClick={() => onUpdateStatus(job.id, 'Accepted')} className="flex-1 lg:flex-none px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
                                                Accept Job
                                            </button>
                                        </>
                                    )}
                                    {job.status === 'Accepted' && (
                                        <button onClick={() => onUpdateStatus(job.id, 'In Progress')} className="w-full lg:w-auto px-6 py-2.5 bg-amber-500 text-white hover:bg-amber-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                            Start Work <ChevronRight size={14} />
                                        </button>
                                    )}
                                    {job.status === 'In Progress' && (
                                        <button onClick={() => onUpdateStatus(job.id, 'Completed')} className="w-full lg:w-auto px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                            <CheckCircle2 size={14} /> Complete
                                        </button>
                                    )}
                                    {job.status === 'Completed' && (
                                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                            <span className="text-emerald-700 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest">Finalized</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 5. EARNINGS VIEW (Stats & History) ---
const EarningsView = ({ stats, bookings }) => {
    const completedJobs = bookings.filter(b => b.status === "Completed");

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <SectionHeader title="Earnings & History" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Earnings" value={`\u20B9${stats.totalEarnings}`} icon={Wallet} color="indigo" trend="+5%" trendUp={true} />
                <StatCard label="Pending Jobs" value={stats.pendingJobs} icon={CreditCard} color="blue" sub="Upcoming" />
                <StatCard label="Total Services" value={stats.totalServices} icon={CheckCircle2} color="blue" />
            </div>

            {/* History Table */}
            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-xs uppercase text-slate-500 font-bold">
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {completedJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-bold">No completed jobs yet</td>
                                </tr>
                            ) : completedJobs.map(booking => (
                                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/10 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{booking.service || booking.service_name}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{booking.customer}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-700 dark:text-slate-200">{'\u20B9'}{booking.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- NEW SECTIONS COMPONENTS ---

const CustomerReviews = ({ reviews }) => {
    return (
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white">Customer Feedback</h3>
                <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
                    <Star size={14} className="fill-amber-500 text-amber-500" />
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-xs">4.8</span>
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[300px]">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                                    {review.avatar && review.avatar.startsWith('http') ? (
                                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                    ) : (
                                        (review.user && review.user[0]) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{review.user}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">
                                        {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} className={`${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed italic">"{review.comment}"</p>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-sm hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-500 transition-all">
                View All Reviews
            </button>
        </div>
    );
};

const UpcomingSchedule = ({ bookings }) => {
    const upcoming = bookings.filter(b => ["Assigned", "Accepted", "In Progress"].includes(b.status));

    return (
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white">Upcoming Schedule</h3>
                <button className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors">
                    <Calendar size={18} />
                </button>
            </div>

            <div className="relative pl-4 space-y-8 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {upcoming.length === 0 ? (
                    <p className="text-slate-400 text-sm font-bold py-10 text-center">No upcoming jobs scheduled</p>
                ) : upcoming.map((item, index) => (
                    <div className="relative pl-6 group">
                        {/* Timeline Dot */}
                        <span className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm z-10 
                                ${index === 0 ? 'bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30' : 'bg-slate-300 dark:bg-slate-600'}`}
                        />

                        <div className="bg-white dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:border-indigo-100 group-hover:translate-x-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider">{item.date}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Accepted' || item.status === 'In Progress' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white mb-1">{item.service}</h4>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <Clock size={12} /> {item.time}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <MapPin size={12} /> {item.address}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 5. MESSAGES VIEW (Mock Implementation) ---
const MessagesView = () => {
    // Mock Data
    const [conversations, setConversations] = useState([
        { id: 1, name: "Alice Johnson", lastMessage: "Is 2 PM okay for the visit?", time: "10:30 AM", unread: 2, avatar: null, online: true },
        { id: 2, name: "Rajesh Kumar", lastMessage: "Thanks for the quick service!", time: "Yesterday", unread: 0, avatar: null, online: false },
        { id: 3, name: "Sarah Williams", lastMessage: "Can you send the invoice?", time: "Yesterday", unread: 0, avatar: null, online: true },
        { id: 4, name: "Michael Chen", lastMessage: "I need to reschedule.", time: "Mon", unread: 0, avatar: null, online: false },
    ]);

    const [activeChat, setActiveChat] = useState(conversations[0]);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, sender: "other", text: "Hi, when can you come for the AC repair?", time: "10:00 AM" },
        { id: 2, sender: "me", text: "Hello! I can be there by 2 PM today.", time: "10:05 AM" },
        { id: 3, sender: "other", text: "Is 2 PM okay for the visit?", time: "10:30 AM" },
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeChat]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            sender: "me",
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessageInput("");

        // Mock reply
        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                sender: "other",
                text: "Sounds good, see you then!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 1500);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex gap-6 animate-in fade-in duration-500">
            {/* Chat List */}
            <div className="w-80 flex flex-col bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Messages</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 dark:text-slate-200"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map(chat => (
                        <div
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`p-4 flex items-center gap-3 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 ${activeChat?.id === chat.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                                    {chat.avatar ? <img src={chat.avatar} alt="" className="w-full h-full object-cover" /> : chat.name[0]}
                                </div>
                                {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h4 className={`font-bold text-sm truncate ${activeChat?.id === chat.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>{chat.name}</h4>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {chat.lastMessage}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden relative">
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white/50 dark:bg-slate-900/30 backdrop-blur-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-sm">
                                    {activeChat.avatar ? <img src={activeChat.avatar} alt="" className="w-full h-full object-cover" /> : activeChat.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h3>
                                    <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
                            <div className="text-center text-xs text-slate-400 my-4 font-bold uppercase tracking-widest opacity-60">Today</div>
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl p-3 shadow-md border ${msg.sender === 'me'
                                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-br-none border-indigo-600'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-none border-slate-200 dark:border-slate-700'
                                        }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] mt-1 block text-right font-medium opacity-70 ${msg.sender === 'me' ? 'text-amber-100' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all shadow-inner">
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 h-10"
                                />
                                <button
                                    type="submit"
                                    disabled={!messageInput.trim()}
                                    className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={40} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="font-bold">Select a chat to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReviewsFullView = ({ reviews }) => (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <SectionHeader title="Customer Reviews" action={
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="text-slate-500 text-sm font-bold">Overall Rating:</span>
                <div className="flex items-center gap-1">
                    <Star size={16} className="fill-amber-500 text-amber-500" />
                    <span className="font-black text-slate-800 dark:text-white">4.8</span>
                </div>
            </div>
        } />
        <div className="grid gap-4">
            {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-400 font-bold border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                    No reviews yet. Completed jobs with ratings will appear here.
                </div>
            ) : (
                reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                                    {review.avatar && review.avatar.startsWith('http') ? (
                                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                    ) : (
                                        (review.user && review.user[0]) || 'U'
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-800 dark:text-white">{review.user}</h4>
                                    <p className="text-sm text-slate-500 font-medium">
                                        {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">"{review.comment}"</p>
                    </div>
                )))}
        </div>
    </div>
);

const SupportView = () => (
    <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h2 className="text-3xl font-black mb-4 relative z-10">Need Help?</h2>
            <p className="text-indigo-100 mb-8 max-w-sm relative z-10 font-medium">Our support team is available 24/7 to assist you with any issues.</p>
            <div className="flex flex-col gap-4 relative z-10">
                <button className="flex items-center gap-3 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                    <Mail size={20} /> Email Us
                </button>
            </div>
        </div>
        <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-8">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Frequently Asked Questions</h3>
            <div className="space-y-4">
                {[
                    "How do I update my service pricing?",
                    "When will I receive my payouts?",
                    "How can I change my availability?",
                    "What happens if a customer cancels?"
                ].map((q, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 cursor-pointer transition-all">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{q}</span>
                            <ChevronRight size={16} className="text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- 3. THE HIERARCHICAL MANAGER ---
const HierarchicalServiceManager = ({
    categories,
    services,
    onRefreshCategories,
    onRefreshServices,
    onAddService,
    onUpdateService,
    onDeleteService,
    onToggleService,
    onEditService,
    refreshTrigger, // Receive trigger
    profile // Receive profile
}) => {
    const [view, setView] = useState({ depth: 'categories', category: null, type: null, subType: null });
    const [isAdding, setIsAdding] = useState(false);
    const [editingEntity, setEditingEntity] = useState(null);
    const [subTypes, setSubTypes] = useState([]);
    const [catalogServices, setCatalogServices] = useState([]);

    // Fetch sub-types when category selected
    useEffect(() => {
        if (view.depth === 'types' && view.category) {
            fetchSubTypes(view.category.id);
        }
    }, [view.depth, view.category, refreshTrigger]);

    // Fetch Services when a Type is selected
    useEffect(() => {
        if (view.depth === 'services' && view.type) {
            fetchCatalogServices(view.type.id);
        }
    }, [view.depth, view.type, refreshTrigger]);

    const fetchSubTypes = async (categoryId) => {
        try {
            const res = await api.get(`/catalog/types/${categoryId}`);
            setSubTypes(res.data);
        } catch (err) {
            toast.error("Failed to load Service Types");
        }
    };

    const fetchSubServiceTypes = async (typeId) => {
        try {
            const res = await api.get(`/catalog/sub-types/${typeId}`);
            setSubServiceTypes(res.data);
        } catch (err) {
            console.error("Failed to fetch sub-types", err);
            toast.error("Failed to load sub-service types");
        }
    };

    const fetchCatalogServices = async (typeId) => {
        try {
            const res = await api.get(`/catalog/services/${typeId}`);
            setCatalogServices(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load catalog services");
        }
    };

    const handleBack = () => {
        if (view.depth === 'services') setView({ ...view, depth: 'types', type: null, subType: null });
        else if (view.depth === 'types') setView({ depth: 'categories', category: null, type: null, subType: null });
        setIsAdding(false);
    };

    const handleCreateEntity = async (formData, id) => {
        try {
            if (view.depth === 'categories') {
                if (id) await api.put(`/catalog/category/${id}`, formData);
                else await api.post('/catalog/category', formData);
                onRefreshCategories();
            } else if (view.depth === 'types') {
                if (id) await api.put(`/catalog/type/${id}`, formData);
                else await api.post('/catalog/type', formData);
                fetchSubTypes(view.category.id);
            } else if (view.depth === 'sub-types') {
                if (id) await api.put(`/catalog/sub-type/${id}`, formData);
                else await api.post('/catalog/sub-type', formData);
                fetchSubServiceTypes(view.type.id);
            } else { // view.depth === 'services'
                const servicePayload = { ...formData };
                servicePayload.type_id = view.type.id;
                servicePayload.sub_type_id = null; // Ensuring no sub_type linked

                if (servicePayload.price) {
                    servicePayload.base_price = Number(servicePayload.price);
                }

                if (id) await onEditService({ ...servicePayload, id });
                else await api.post('/catalog/service', servicePayload);

                fetchCatalogServices(view.type.id);
            }
            setIsAdding(false);
            setEditingEntity(null);
            toast.success("Saved successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save");
        }
    };

    const handleDeleteCatalogEntity = async (id, type) => {
        try {
            const endpoint = type === 'category' ? `/catalog/category/${id}` :
                (type === 'type' ? `/catalog/type/${id}` : `/catalog/sub-type/${id}`);
            await api.delete(endpoint);
            toast.success(`${type} deleted successfully`);
            if (type === 'category') onRefreshCategories();
            else if (type === 'type') {
                fetchSubTypes(view.category.id);
            } else { // type === 'sub-type'
                fetchSubServiceTypes(view.type.id);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            if (errorMsg.includes("foreign key constraint") || errorMsg.includes("violates foreign key")) {
                toast.error(`Cannot delete this ${type} because it has associated services or bookings. Please hide or archive relevant services instead.`);
            } else {
                toast.error(errorMsg || "Delete failed");
            }
        }
    };

    const breadcrumbs = [
        { label: 'All Categories', onClick: () => setView({ depth: 'categories', category: null, type: null, subType: null }) },
        ...(view.category ? [{ label: view.category.name, onClick: () => setView({ depth: 'types', category: view.category, type: null, subType: null }) }] : []),
        ...(view.type ? [{ label: view.type.name, active: true }] : [])
    ];

    if (isAdding || editingEntity) {
        return (
            <AddEntityForm
                type={view.depth === 'categories' ? 'category' : (view.depth === 'types' ? 'type' : (view.depth === 'sub-types' ? 'sub-type' : 'service'))}
                label={view.depth === 'categories' ? 'Category' : (view.depth === 'types' ? 'Service Type' : (view.depth === 'sub-types' ? 'Sub-Service Type' : 'Service'))}
                initialData={editingEntity}
                parentId={view.depth === 'types' ? view.category.id : (view.depth === 'services' ? view.type.id : null)}
                onCancel={() => { setIsAdding(false); setEditingEntity(null); }}
                onSave={handleCreateEntity}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {view.depth === 'categories' && (
                <>
                    <LevelTitle title="Manage Service Categories" breadcrumbs={breadcrumbs} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(!profile?.service_type || profile.service_type === 'All in one') && (
                            <AddEntityCard label="Add Category" onClick={() => setIsAdding(true)} />
                        )}
                        {categories.map(cat => (
                            <EntityCard
                                key={cat.id}
                                item={cat}
                                type="category"
                                onClick={(item) => setView({ depth: 'types', category: item, type: null, subType: null })}
                                onEdit={(item) => { setEditingEntity(item); }}
                                onDelete={(id) => handleDeleteCatalogEntity(id, 'category')}
                            />
                        ))}
                    </div>

                    {/* All Services List Section */}
                    <div className="mt-10 animate-in slide-in-from-bottom-8 duration-700">
                        <SectionHeader title="All My Services" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.length === 0 ? (
                                <div className="col-span-full py-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                                    No services added yet. Browse Service Types to add services.
                                </div>
                            ) : services.map(svc => (
                                <div key={svc.id} className="group relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700 p-6 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                                     <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                                         <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 shadow-lg border-2 border-white dark:border-slate-700/50 group-hover:scale-105 transition-transform duration-500">
                                             {svc.image_url ? (
                                                 <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover" />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center text-slate-400"><Wrench size={32} /></div>
                                             )}
                                         </div>
                                         <div className="flex-1 min-w-0 text-center sm:text-left">
                                             <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-3 mb-2">
                                                 <h4 className="font-black text-xl text-slate-900 dark:text-white truncate">{svc.name}</h4>
                                                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${svc.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>
                                                     {svc.is_active ? 'Active' : 'Hidden'}
                                                 </span>
                                             </div>
                                             <div className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 italic font-medium">
                                                 {svc.description ? svc.description.split('\n').map(p => p.replace(/^[•\s-\*]+/, '')).join(', ') : "No description available."}
                                             </div>
                                             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                                 <div className="flex items-center gap-2">
                                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Cost:</span>
                                                     <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                                                         {'\u20B9'}{svc.base_price || svc.price || 0}
                                                     </span>
                                                 </div>
                                                 <div className="flex items-center gap-2">
                                                     <button
                                                         onClick={(e) => { e.stopPropagation(); onEditService(svc); }}
                                                         className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-emerald-500/20 shadow-sm"
                                                     >
                                                         <Edit2 size={14} /> Edit
                                                     </button>
                                                     <button
                                                         onClick={(e) => {
                                                             e.stopPropagation();
                                                             Swal.fire({
                                                                 title: 'Delete Service?',
                                                                 text: `Are you sure you want to delete "${svc.name}"?`,
                                                                 icon: 'warning',
                                                                 showCancelButton: true,
                                                                 confirmButtonColor: '#ef4444',
                                                                 cancelButtonColor: '#64748b',
                                                                 confirmButtonText: 'Yes, delete it!'
                                                             }).then((result) => {
                                                                 if (result.isConfirmed) {
                                                                     onDeleteService(svc.id);
                                                                 }
                                                             });
                                                         }}
                                                         className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-rose-500/20 shadow-sm"
                                                     >
                                                         <Trash2 size={14} /> Delete
                                                     </button>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {view.depth === 'types' && (
                <>
                    <LevelTitle
                        title={`Service Types in ${view.category.name}`}
                        onBack={handleBack}
                        breadcrumbs={breadcrumbs}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AddEntityCard label="Add Service Type" onClick={() => setIsAdding(true)} />
                        {subTypes.map(type => (
                            <EntityCard
                                key={type.id}
                                item={type}
                                type="type"
                                onClick={(item) => setView({ ...view, depth: 'services', type: item, subType: null })}
                                onEdit={(item) => { setEditingEntity(item); }}
                                onDelete={(item) => handleDeleteCatalogEntity(item.id, 'type')}
                            />
                        ))}
                    </div>
                </>
            )}



            {view.depth === 'services' && (
                <>
                    <LevelTitle
                        title={`Services in ${view.type.name}`}
                        onBack={handleBack}
                        breadcrumbs={breadcrumbs}
                    />

                    {/* Manual "Add Service" Form Integrated Here */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 dark:text-white">Services</h3>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                        >
                            <Plus size={18} /> Add Specific Service
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {catalogServices.map(svc => {
                            // Link check: Use backend link_id OR fallback to client-side services list
                            // This ensures if the catalog and services list are slightly out of sync (e.g. after add), we still show the correct state
                            const clientSideMatch = services.find(s => s.service_id === svc.id);
                            const isLinked = !!svc.link_id || !!clientSideMatch;

                            // Construct the service object expected by the handlers if linked
                            const myService = isLinked ? {
                                id: svc.link_id || clientSideMatch?.id, // Prefer backend ID, fallback to client match
                                service_id: svc.id,
                                name: svc.name,
                                description: svc.description,
                                image_url: svc.image_url,
                                price: svc.my_price || svc.provider_price || clientSideMatch?.price || svc.base_price || svc.price, // Cascade price preference
                                is_active: svc.is_linked ?? clientSideMatch?.is_active ?? true,
                                features: svc.features,
                                provider_id: svc.linked_provider_id || clientSideMatch?.provider_id,
                                type_id: svc.type_id,         // Ensure IDs are passed for potential updates
                                sub_type_id: svc.sub_type_id
                            } : null;

                            return (
                                <div
                                    key={svc.id}
                                    className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
                                >
                                    <div className="h-64 overflow-hidden relative">
                                        {svc.image_url ? (
                                            <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                                <Wrench size={64} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                                    </div>

                                    {/* Service Details Section below Image */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight flex-1 mr-4">{svc.name}</h3>
                                            {isLinked && (
                                                <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                                                    Added
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-slate-600 dark:text-slate-400 text-sm font-medium mb-3 min-h-[4.5em]">
                                            <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1 text-xs uppercase tracking-wider">Description:</span>
                                            {svc.description ? (
                                                <ul className="list-disc pl-4 space-y-1 marker:text-indigo-500">
                                                    {svc.description.split('\n').map((point, i) => (
                                                        <li key={i} className="leading-snug">{point.replace(/^[•\s-\*]+/, '')}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="italic text-slate-400">High quality service provided by professionals.</p>
                                            )}
                                        </div>
                                        <p className="text-slate-900 dark:text-white font-black text-lg">
                                            Price: <span className="text-indigo-600 dark:text-indigo-400">{'\u20B9'}{clientSideMatch?.price || svc.my_price || svc.base_price || svc.price || 0}</span>
                                        </p>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                            {isLinked ? (
                                                <div className="flex gap-2 w-full mt-4">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onEditService(myService); }}
                                                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Edit2 size={16} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            Swal.fire({
                                                                title: 'Delete Service?',
                                                                text: `Are you sure you want to delete "${svc.name}"?`,
                                                                icon: 'warning',
                                                                showCancelButton: true,
                                                                confirmButtonColor: '#ef4444',
                                                                cancelButtonColor: '#64748b',
                                                                confirmButtonText: 'Yes, delete it!'
                                                            }).then((result) => {
                                                                if (result.isConfirmed) {
                                                                    onDeleteService(myService.id);
                                                                }
                                                            });
                                                        }}
                                                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Trash2 size={16} /> Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAddService({
                                                            service_id: svc.id,
                                                            price: svc.base_price || 0,
                                                            name: svc.name,
                                                            description: svc.description,
                                                            features: svc.features
                                                        });
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 group/add"
                                                >
                                                    <Plus size={18} className="group-hover/add:rotate-90 transition-transform" /> Add to My Services
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </>
            )
            }
        </div >
    );
};

// --- 6. MAIN SERVICE PROVIDER PAGE ---
const ServiceProvider = () => {
    const navigate = useNavigate();
    const { "*": tabSlug } = useParams();
    const activeTab = tabSlug || 'overview';

    const setActiveTab = (tabName) => {
        navigate(`/service-provider/dashboard/${tabName}`);
    };
    const { user } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- APP STATE ---
    const [profile, setProfile] = useState(INITIAL_PROFILE || {});
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(INITIAL_STATS);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger for catalog refresh // Added reviews state

    // --- REJECTION STATE ---
    const [rejectionBookingId, setRejectionBookingId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    // --- FILTER CATEGORIES ---
    const filteredCategories = React.useMemo(() => {
        if (!profile?.service_type || profile.service_type === 'All in one') return categories;

        const providerType = profile.service_type.toLowerCase();

        const typeMap = {
            'plumbing': 'plumbing',
            'electrical': 'electrical',
            'cleaning': 'cleaning',
            'painting': 'painting',
            'carpentry': 'carpentry',
            'ac repair': 'ac and appliance repair',
            'maintenance': 'maintenance'
        };

        const targetCategory = typeMap[providerType] || providerType;

        return categories.filter(cat =>
            cat.name.toLowerCase().includes(targetCategory) ||
            targetCategory.includes(cat.name.toLowerCase())
        );
    }, [categories, profile?.service_type]);

    // --- DATA FETCHING ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const results = await Promise.allSettled([
                    api.get('/overview'),
                    api.get('/services'),
                    api.get('/bookings'),
                    api.get('/catalog/categories'),
                    api.get('/profile'),
                    api.get('/reviews') // Added reviews fetch
                ]);

                if (results[0].status === 'fulfilled') setStats(results[0].value.data);
                else console.error("Overview Fetch Error:", results[0].reason);

                if (results[1].status === 'fulfilled') setServices(results[1].value.data);
                else console.error("Services Fetch Error:", results[1].reason);

                if (results[2].status === 'fulfilled') setBookings(results[2].value.data);
                else console.error("Bookings Fetch Error:", results[2].reason);

                if (results[3].status === 'fulfilled') setCategories(results[3].value.data);
                else console.error("Categories Fetch Error:", results[3].reason);

                if (results[4].status === 'fulfilled') {
                    const profileData = results[4].value.data;
                    setProfile({
                        ...profileData,
                        about: profileData.about_us || profileData.about || "",
                        city: profileData.service_area || profileData.city || ""
                    });
                } else {
                    console.error("Profile Fetch Error:", results[4].reason);
                }

                if (results[5].status === 'fulfilled') setReviews(results[5].value.data);
                else console.error("Reviews Fetch Error:", results[5].reason);
            } catch (err) {
                console.error("Fetch Data Error:", err);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- HANDLERS ---
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
    };

    const handleUpdateProfile = async (newProfile) => {
        try {
            const res = await api.put('/profile', {
                company_name: newProfile.company_name,
                service_area: newProfile.city,
                phone: newProfile.phone,
                experience: newProfile.experience,
                about_us: newProfile.about,
                avatar_url: newProfile.avatar_url
            });
            setProfile({
                ...res.data,
                about: res.data.about_us,
                city: res.data.service_area
            });
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("Failed to update profile");
            throw err; // Re-throw to handle dependency calls (like handleImageUpload)
        }
    };

    const handleAddService = async (newServiceData) => {
        try {
            let imageUrl = null;
            if (newServiceData.image instanceof File) {
                imageUrl = await uploadToCloudinary(newServiceData.image);
            } else if (typeof newServiceData.image === 'string') {
                imageUrl = newServiceData.image;
            }

            const payload = { ...newServiceData, image_url: imageUrl };
            if (payload.image) delete payload.image; // Cleanup

            // Parse features if string
            if (typeof payload.features === 'string') {
                payload.features = payload.features.split(',').map(f => f.trim()).filter(f => f);
            }

            const res = await api.post('/services', payload);
            setServices([res.data, ...services]);
            setIsAddingService(false);
            setRefreshTrigger(prev => prev + 1); // Refresh catalog
            toast.success("Service added successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || "Failed to add service");
        }
    };

    const handleUpdateService = async (updatedServiceData) => {
        try {
            let imageUrl = updatedServiceData.image_url;
            if (updatedServiceData.image instanceof File) {
                imageUrl = await uploadToCloudinary(updatedServiceData.image);
            }

            const isCatalogTemplate = updatedServiceData.id && !services.find(s => s.id === updatedServiceData.id);

            const payload = { ...updatedServiceData, image_url: imageUrl };
            if (payload.image) delete payload.image;

            if (!updatedServiceData.id || isCatalogTemplate) {
                // If no ID or it's a catalog template, it's a new addition
                const addPayload = { ...payload };
                if (isCatalogTemplate) {
                    addPayload.service_id = updatedServiceData.id;
                    delete addPayload.id; // Backend expects service_id for catalog templates
                }
                return handleAddService(addPayload);
            }

            const res = await api.put(`/services/${updatedServiceData.id}`, payload);
            setServices(services.map(s => s.id === res.data.id ? res.data : s));
            setEditingService(null);
            setRefreshTrigger(prev => prev + 1); // Refresh catalog
            toast.success("Service updated successfully!");
        } catch (err) {
            toast.error(err.response?.data?.error || err.message || "Failed to update service");
        }
    };

    const handleToggleService = async (id) => {
        try {
            const res = await api.patch(`/services/${id}/toggle`);
            setServices(services.map(s => s.id === id ? res.data : s));
            setRefreshTrigger(prev => prev + 1); // Refresh catalog
        } catch (err) {
            toast.error("Failed to toggle service status");
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await api.delete(`/services/${id}`);
            setServices(services.filter(s => s.id !== id));
            setRefreshTrigger(prev => prev + 1); // Refresh catalog
            toast.success("Service deleted");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message;
            if (errorMsg.includes("foreign key constraint") || errorMsg.includes("violates foreign key")) {
                toast.error("Cannot delete service with active/past bookings. Please toggle its status to 'Hidden' instead.");
            } else {
                toast.error(errorMsg || "Failed to delete service");
            }
        }
    };

    const handleUpdateBookingStatus = async (id, newStatus, reason = null) => {
        if (newStatus === 'Rejected' && !reason) {
            setRejectionBookingId(id);
            return;
        }

        try {
            const payload = { status: newStatus };
            if (reason) payload.rejection_reason = reason;

            const res = await api.patch(`/bookings/${id}/status`, payload);
            setBookings(bookings.map(b => b.id === id ? { ...b, status: res.data.status } : b));
            toast.success(`Job status updated to ${newStatus}`);

            if (newStatus === 'Rejected') {
                setRejectionBookingId(null);
                setRejectionReason("");
            }

            // Refresh stats if status changed to Completed
            if (newStatus === 'Completed') {
                const statsRes = await api.get('/overview');
                setStats(statsRes.data);
            }
        } catch (err) {
            console.error("Status Update Error:", err);
            toast.error("Failed to update job status");
        }
    };

    // --- RENDER HELPERS ---
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard label="Total Services" value={stats.totalServices} icon={Briefcase} color="indigo" />
                            <StatCard label="Active Services" value={stats.activeServices} icon={Zap} color="emerald" sub="Online" />
                            <StatCard label="Pending Jobs" value={stats.pendingJobs} icon={Hourglass} color="blue" sub="Action Needed" />
                            <StatCard label="Total Earnings" value={`\u20B9${stats.totalEarnings}`} icon={IndianRupee} color="indigo" trend="+5%" trendUp={true} sub="Total" />
                        </div>

                        {/* Graphs Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Stock Level Graph */}
                            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 overflow-hidden flex flex-col">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6">Essential Supplies</h3>
                                <div className="w-full flex-1" style={{ height: '300px', minHeight: '300px' }}>
                                    <LazyChart>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={MOCK_STOCK_DATA} layout="vertical" margin={{ left: -20, right: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b8" opacity={0.3} />
                                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                                                />
                                                <Bar
                                                    dataKey="available"
                                                    name="Available"
                                                    fill="#6366f1"
                                                    radius={[0, 4, 4, 0]}
                                                    barSize={20}
                                                    isAnimationActive={true}
                                                    animationDuration={1500}
                                                    animationBegin={200}
                                                >
                                                    {MOCK_STOCK_DATA.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={['#0ea5e9', '#6366f1', '#3b82f6', '#10b981', '#4f46e5'][index % 5]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </LazyChart>
                                </div>
                            </div>

                            {/* Weekly Activity Bar Chart */}
                            <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6 overflow-hidden flex flex-col">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-6">This Week's Activity</h3>
                                <div className="w-full flex-1" style={{ height: '300px', minHeight: '300px' }}>
                                    <LazyChart>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={MOCK_WEEKLY_ACTIVITY} margin={{ bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.3} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                                    cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                                                />
                                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                                <Bar
                                                    dataKey="completed"
                                                    name="Completed"
                                                    fill="#10b981"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={20}
                                                    isAnimationActive={true}
                                                    animationDuration={1500}
                                                    animationBegin={300}
                                                />
                                                <Bar
                                                    dataKey="pending"
                                                    name="Pending"
                                                    fill="#6366f1"
                                                    radius={[4, 4, 0, 0]}
                                                    barSize={20}
                                                    isAnimationActive={true}
                                                    animationDuration={1500}
                                                    animationBegin={500}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </LazyChart>
                                </div>
                            </div>
                        </div>

                        {/* Service Categories Grid */}
                        <div>
                            <SectionHeader title="Service Domains" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {categories.map((cat, idx) => (
                                    <CategoryCard key={cat.id || idx} category={cat} />
                                ))}
                            </div>
                        </div>

                        {/* Main Interaction Area: Schedule & Reviews */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
                            <div className="lg:col-span-2">
                                <UpcomingSchedule bookings={bookings} />
                            </div>
                            <div className="lg:col-span-1">
                                <CustomerReviews reviews={reviews} />
                            </div>
                        </div>

                        {/* Recent Activity (Full Width) */}
                        <div className="grid grid-cols-1 gap-6">
                            <div className="w-full bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">Recent Activity</h3>
                                    <button onClick={() => setActiveTab('requests')} className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
                                </div>
                                <div className="space-y-4">
                                    {bookings.slice(0, 4).map(job => (
                                        <div key={job.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                                                    <img src={getServiceImage(job.service)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-bold text-slate-900 dark:text-white">{job.service || job.service_name || `Service #${job.service_id}`}</h3>
                                                        {job.priority && (
                                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider 
                                                            ${job.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                                                    job.priority === 'Medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/30'}`}>
                                                                {job.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-slate-500 font-medium">{job.customer}</div>
                                                    {job.service_type && (
                                                        <div className="text-xs text-slate-400 mt-0.5">{job.service_type}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{'\u20B9'}{job.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                );

            case 'profile':
                return <ProfileView user={user} profile={profile} onUpdate={handleUpdateProfile} />;
            case 'services':
                return (
                    <HierarchicalServiceManager
                        categories={filteredCategories}
                        services={services}
                        onRefreshCategories={async () => {
                            const res = await api.get('/catalog/categories');
                            setCategories(res.data);
                        }}
                        onRefreshServices={async () => {
                            const res = await api.get('/services');
                            setServices(res.data);
                        }}
                        onAddService={handleAddService}
                        onUpdateService={handleUpdateService}
                        onDeleteService={handleDeleteService}
                        onToggleService={handleToggleService}
                        onEditService={(svc) => setEditingService(svc)}
                        profile={profile}
                        refreshTrigger={refreshTrigger}
                    />
                );
            case 'requests':
                return <BookingsView bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
            case 'earnings':
                return <EarningsView stats={stats} bookings={bookings} />;
            case 'reviews':
                return <ReviewsFullView reviews={reviews} />;
            case 'support':
                return <SupportView />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex font-sans selection:bg-indigo-200 dark:selection:bg-indigo-900/30 text-slate-900 dark:text-slate-100">
            {/* Edit Service Modal */}
            {editingService && (
                <AddEntityForm
                    key={editingService.id}
                    type="service"
                    initialData={editingService}
                    categories={categories}
                    onSave={handleUpdateService}
                    onCancel={() => setEditingService(null)}
                />
            )}

            {/* Rejection Reason Modal */}
            {rejectionBookingId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-slate-950 rounded-3xl shadow-2xl shadow-rose-900/20 max-w-lg w-full p-8 border border-rose-500/20 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex items-center gap-5 mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500/30 text-rose-500 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                <XCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight uppercase">Reject Request</h3>
                                <p className="text-xs text-rose-400 font-bold tracking-widest uppercase mt-1">Action cannot be undone</p>
                            </div>
                        </div>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Tell the user why you're rejecting this service... (e.g., Time slot unavailable, outside service area)"
                            className="w-full h-40 p-5 bg-slate-900 rounded-2xl border border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all text-white placeholder:text-slate-600 font-medium resize-none shadow-inner text-sm leading-relaxed"
                        />

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => { setRejectionBookingId(null); setRejectionReason(""); }}
                                className="flex-1 py-3 text-slate-500 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-all text-xs uppercase tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleUpdateBookingStatus(rejectionBookingId, 'Rejected', rejectionReason)}
                                disabled={!rejectionReason.trim()}
                                className="flex-[2] px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] transition-all disabled:opacity-50 disabled:shadow-none"
                            >
                                Submit Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-slate-50/0 to-slate-50/0 dark:from-indigo-900/20 dark:via-slate-900/0 dark:to-slate-900/0" />
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* SIDEBAR */}
            <aside className={`w-72 bg-white/95  dark:bg-slate-900/95 backdrop-blur-xl h-screen fixed left-0 top-0 flex flex-col text-slate-600 dark:text-slate-300 z-50 border-r border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-300 transform lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="p-8 border-b border-slate-200 dark:border-white/10">
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-sky-500 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                                <img src="/favicon.png" alt="RentEase" className="min-w-15 min-h-15 object-contain relative right-2 top-0.5 z-10 drop-shadow-lg" />
                            </div>
                            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter relative right-9">RentEase</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 block relative left-14 bottom-1">Service Provider Dashboard</span>
                    </div>
                </div>

                {/* Partner Status Card - REMOVED */}

                <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'profile', label: 'Profile', icon: UserCircle },
                        { id: 'services', label: 'Manage Services', icon: LayoutGrid },
                        { id: 'requests', label: 'Service Jobs', icon: ClipboardList },
                        { id: 'earnings', label: 'Earnings', icon: Wallet },
                        { id: 'reviews', label: 'My Reviews', icon: Star },
                        { id: 'support', label: 'Help & Support', icon: LifeBuoy },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); if (item.id === 'services') setIsAddingService(false); }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden text-sm font-bold ${activeTab === item.id
                                ? 'text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.5)] scale-[1.02]'
                                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                        >
                            {activeTab === item.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-600 animate-in fade-in duration-300"></div>
                            )}
                            <item.icon size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? "text-white" : ""}`} />
                            <span className="relative z-10">{item.label}</span>
                            {activeTab === item.id && (
                                <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white] relative z-20"></span>
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 hover:text-rose-600 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={18} className="transition-transform duration-300" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 lg:ml-72 flex flex-col h-screen relative z-10 transition-all duration-300">
                {/* Top Navbar */}
                <header className="h-20 px-8 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
                    {/* Left: Check for Mobile Menu + Title */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"><Menu size={20} /></button>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 dark:from-sky-400 dark:to-indigo-500 tracking-tight leading-tight">Service Provider Dashboard</h2>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, <span className="text-sky-500 dark:text-sky-400 font-bold">{profile?.company_name || user?.company_name || user?.name || user?.first_name || user?.email?.split('@')[0] || 'Partner'}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button className="p-2 rounded-full text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                                <Bell size={20} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                            </button>
                        </div>
                        <div className="scale-90"><ThemeToggle /></div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

                        {/* User Profile */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white leading-none">{user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}` : null) || user?.email?.split('@')[0] || 'Partner'}</p>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{user?.email}</p>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-offset-2 ring-transparent dark:ring-slate-900 group-hover:ring-indigo-500/20 transition-all overflow-hidden border border-white/20">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (user?.name?.[0] || user?.first_name?.[0] || user?.email?.[0] || 'P').toUpperCase()
                                    )}
                                </div>
                                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 translate-y-2 group-hover:translate-y-0">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1 lg:hidden">
                                        <p className="font-bold text-slate-800 dark:text-white truncate">{user?.name || user?.first_name || 'Partner'}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <button onClick={() => setActiveTab('profile')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl font-medium text-sm transition-colors">
                                        <UserCircle size={16} /> Profile
                                    </button>
                                </div>
                            </div>


                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto scroll-smooth p-6 lg:p-10 z-10 relative">
                    {renderContent()}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" />}
        </div>
    );
};

export default ServiceProvider;
