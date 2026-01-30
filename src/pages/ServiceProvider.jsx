import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    ClipboardList,
    Wallet,
    UserCircle,
    BarChart3,
    Bell,
    CheckCircle2,
    Clock,
    AlertCircle,
    MapPin,
    Phone,
    Calendar,
    ChevronRight,
    Menu,
    X,
    TrendingUp,
    TrendingDown,
    Star,
    MessageSquare,
    Search,
    LogOut,
    CreditCard,
    Zap,
    CalendarCheck,
    Mail,
    LifeBuoy,
    Building2,
    Sun,
    Moon,
    LayoutGrid,
    Plus,
    Edit2,
    Trash2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none shadow-inner border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"}`}
        >
            <div
                className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center ${theme === "dark" ? "translate-x-7 bg-slate-900" : "translate-x-0 bg-white"}`}
            >
                {theme === "dark" ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-orange-500" />}
            </div>
        </button>
    );
};

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Mock Data ---
const INITIAL_JOBS = [
    {
        id: "RQ-9012",
        address: "123 Maple Ave, Apt 4B",
        type: "Plumbing",
        issue: "Leaking kitchen sink and low water pressure",
        priority: "High",
        date: "2024-05-20",
        status: "Assigned", // ASSIGNED -> ACCEPTED -> SCHEDULED -> IN_PROGRESS -> COMPLETED
        tenant: "Sarah Johnson",
        contact: "+1 (555) 123-4567",
        scheduledTime: null,
        notes: ""
    },
    {
        id: "RQ-8841",
        address: "782 Pine St, Unit 12",
        type: "Electrical",
        issue: "Bedroom circuit breaker keeps tripping",
        priority: "Critical",
        date: "2024-05-19",
        status: "Scheduled",
        tenant: "Michael Chen",
        contact: "+1 (555) 987-6543",
        scheduledTime: "Tomorrow, 10:00 AM - 11:00 AM",
        notes: "Ordered replacement breaker."
    },
    {
        id: "RQ-8722",
        address: "45 Oak Lane",
        type: "Appliance",
        issue: "Dishwasher not draining",
        priority: "Medium",
        date: "2024-05-18",
        status: "Completed",
        tenant: "Emily Davis",
        contact: "+1 (555) 456-7890",
        scheduledTime: "May 18, 02:00 PM",
        notes: "Removed blockage from drain pump."
    },
    {
        id: "RQ-9055",
        address: "210 Cedar Blvd",
        type: "General",
        issue: "Front door lock replacement",
        priority: "Low",
        date: "2024-05-21",
        status: "Assigned",
        tenant: "Robert Wilson",
        contact: "+1 (555) 222-3333",
        scheduledTime: null,
        notes: ""
    }
];

const INITIAL_SERVICES = [
    // --- AC Services ---
    {
        id: "SVC-AC-1",
        name: "AC Installation/Uninstallation",
        price: 1500,
        originalPrice: 1800,
        description: "Professional installation or uninstallation of Split/Window AC.",
        category: "AC",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-AC-2",
        name: "AC Service",
        price: 599,
        originalPrice: 799,
        description: "Deep jet cleaning of indoor and outdoor units.",
        category: "AC",
        image: "https://images.unsplash.com/photo-1621905252507-b35a830137d3?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-AC-3",
        name: "AC Repair",
        price: 299,
        originalPrice: 349,
        description: "Diagnosis and repair of cooling issues, noise, or water leakage.",
        category: "AC",
        image: "https://plus.unsplash.com/premium_photo-1663013289069-b5860c451da7?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-AC-4",
        name: "Gas Charging",
        price: 2500,
        originalPrice: 2800,
        description: "Complete gas top-up for Split/Window AC (up to 2 tons).",
        category: "AC",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600"
    },

    // --- Home Cleaning ---
    {
        id: "SVC-HC-1",
        name: "Full House Cleaning",
        price: 2999,
        originalPrice: 3999,
        description: "Deep cleaning of all rooms, bathroom, and kitchen.",
        category: "Home Cleaning",
        image: "https://images.unsplash.com/photo-1581578731117-10d52143b0d4?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HC-2",
        name: "Kitchen Cleaning",
        price: 999,
        originalPrice: 1299,
        description: "Oil and grease removal from slabs, cabinents, and appliances.",
        category: "Home Cleaning",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HC-3",
        name: "Sofa Cleaning",
        price: 599,
        originalPrice: 799,
        description: "Shampooing and vacuuming of sofa seats and cushions.",
        category: "Home Cleaning",
        image: "https://images.unsplash.com/photo-1540573133985-1153bc681b49?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HC-4",
        name: "Weekly Cleaning",
        price: 1499,
        originalPrice: 1999,
        description: "Regular maintenance cleaning plan for your home.",
        category: "Home Cleaning",
        image: "https://images.unsplash.com/photo-1527513984046-12475d53fdae?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HC-5",
        name: "Bathroom Cleaning",
        price: 499,
        originalPrice: 699,
        description: "Stain removal and sanitization of tiles, adjusting, and sink.",
        category: "Home Cleaning",
        image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=600"
    },

    // --- Interior & Renovation ---
    {
        id: "SVC-IR-1",
        name: "Home Interiors",
        price: 150000,
        originalPrice: 180000,
        description: "Full home interior design and execution services.",
        category: "Interior & Renovation",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-IR-2",
        name: "Home Renovation",
        price: 50000,
        originalPrice: 65000,
        description: "Renovation services for kitchens, bathrooms, or full homes.",
        category: "Interior & Renovation",
        image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600"
    },

    // --- Home Repair (Electrical, Plumbing, Carpentry) ---
    {
        id: "SVC-HR-1",
        name: "Electrician",
        price: 199,
        originalPrice: 299,
        description: "Switch repair, fan installation, wiring, and diagnosis.",
        category: "Home Repair",
        image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HR-2",
        name: "Plumbing",
        price: 199,
        originalPrice: 299,
        description: "Leak repair, tap installation, pipe fitting, and blockage removal.",
        category: "Home Repair",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600"
    },
    {
        id: "SVC-HR-3",
        name: "Carpentry",
        price: 299,
        originalPrice: 399,
        description: "Furniture repair, door lock installation, and custom woodwork.",
        category: "Home Repair",
        image: "https://images.unsplash.com/photo-1601058268499-e52642d41a3d?auto=format&fit=crop&q=80&w=600"
    }
];

const NOTIFICATIONS = [
    { id: 1, text: "New Job Assigned: RQ-9055", time: "10 mins ago", type: "new" },
    { id: 2, text: "Payment of $450.00 credited to your account", time: "2 hours ago", type: "payment" },
    { id: 3, text: "Job RQ-8841 updated by Admin", time: "5 hours ago", type: "update" },
];

const DETAILED_EARNINGS = [
    { id: "RQ-8722", type: "Plumbing", amount: 150.00, commission: 22.50, date: "2024-05-18", status: "Paid" },
    { id: "RQ-8611", type: "Electrical", amount: 100.00, commission: 15.00, date: "2024-05-15", status: "Paid" },
    { id: "RQ-8590", type: "Appliance", amount: 250.00, commission: 37.50, date: "2024-05-12", status: "Pending" },
    { id: "RQ-8442", type: "General", amount: 120.00, commission: 18.00, date: "2024-05-10", status: "Paid" },
];

const TIME_SLOTS = [
    "Today, 02:00 PM - 03:00 PM",
    "Today, 04:00 PM - 05:00 PM",
    "Tomorrow, 09:00 AM - 10:00 AM",
    "Tomorrow, 11:00 AM - 12:00 PM",
    "Tomorrow, 02:00 PM - 03:00 PM"
];

const REVIEWS = [
    { id: 1, tenant: "Sarah Johnson", rating: 5, comment: "Excellent service! Fixed the leak very quickly and was very polite.", date: "2 days ago", avatar: "SJ" },
    { id: 2, tenant: "Michael Chen", rating: 4, comment: "Good work, but arrived 10 minutes late. The issue is resolved though.", date: "1 week ago", avatar: "MC" },
    { id: 3, tenant: "Emily Davis", rating: 5, comment: "Very professional. Cleaned up everything after the repair. Highly recommended!", date: "2 weeks ago", avatar: "ED" }
];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group flex flex-col gap-3">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {trend}
                </div>
            )}
        </div>
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-1 tracking-tight">{value}</h3>
        </div>
    </div>
);

// --- Service Modal ---
const ServiceModal = ({ isOpen, onClose, onSave, service }) => {
    if (!isOpen) return null;
    const [formData, setFormData] = useState(service || { name: '', price: '', originalPrice: '', category: 'AC', description: '', image: '' });

    useEffect(() => {
        setFormData(service || { name: '', price: '', originalPrice: '', category: 'AC', description: '', image: '' });
    }, [service]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 m-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">{service ? 'Edit Service' : 'Add New Service'}</h3>
                    <button onClick={onClose}><X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Service Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white"
                            placeholder="e.g. Fan Repair"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Price (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white"
                                placeholder="199"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Original Price</label>
                            <input
                                type="number"
                                value={formData.originalPrice}
                                onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white"
                                placeholder="249"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white"
                        >
                            <option>AC</option>
                            <option>Home Cleaning</option>
                            <option>Interior & Renovation</option>
                            <option>Home Repair</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white h-24 text-sm"
                            placeholder="Describe what's included..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Image URL (Optional)</label>
                        <input
                            type="text"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white"
                            placeholder="e.g. https://example.com/image.jpg"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all text-sm uppercase tracking-wide">
                        Save Service
                    </button>
                </form>
            </div>
        </div>
    );
};

const ServiceProvider = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [jobs, setJobs] = useState(INITIAL_JOBS);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false); // For time slot selection
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [workStatus, setWorkStatus] = useState('Available');
    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

    // --- Actions ---
    const showToast = (txt) => {
        setMessage(txt);
        setTimeout(() => setMessage(null), 3500);
    };

    const handleUpdateStatus = (id, newStatus, extraData = {}) => {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus, ...extraData } : j));
        if (selectedJob && selectedJob.id === id) {
            setSelectedJob({ ...selectedJob, status: newStatus, ...extraData });
        }
    };

    const handleAcceptJob = () => {
        handleUpdateStatus(selectedJob.id, 'Accepted');
        // Automatically open the schedule modal after acceptance to guide flow
        setTimeout(() => setModalOpen(true), 500);
        showToast(`Job Accepted. Please schedule a visit time.`);
    };

    const handleScheduleVisit = () => {
        if (!selectedTimeSlot) return;
        handleUpdateStatus(selectedJob.id, 'Scheduled', { scheduledTime: selectedTimeSlot });
        setModalOpen(false);
        // Important: Mock email notification
        showToast(`Visit Confirmed. Email sent to tenant notifying arrival time: ${selectedTimeSlot}.`);
    };

    const handleAddService = (newService) => {
        const service = { ...newService, id: `SVC-${Date.now()}` };
        setServices([...services, service]);
        setIsServiceModalOpen(false);
        showToast("Service added successfully!");
    };

    const handleEditService = (updatedService) => {
        setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
        setIsServiceModalOpen(false);
        setEditingService(null);
        showToast("Service updated successfully!");
    };

    const handleDeleteService = (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            setServices(services.filter(s => s.id !== id));
            showToast("Service deleted successfully!");
        }
    };

    // --- Helpers ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'Assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Accepted': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'Scheduled': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'text-rose-600 font-bold';
            case 'High': return 'text-orange-600 font-semibold';
            case 'Medium': return 'text-amber-600';
            default: return 'text-slate-600';
        }
    };

    // --- Views ---

    const Overview = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Assigned Jobs" value={jobs.length} icon={ClipboardList} color="bg-gradient-to-br from-blue-500 to-blue-600" />
                <StatCard title="Pending Acceptance" value={jobs.filter(j => j.status === 'Assigned').length} icon={AlertCircle} color="bg-gradient-to-br from-indigo-500 to-purple-600" />
                <StatCard title="Scheduled" value={jobs.filter(j => j.status === 'Scheduled').length} icon={CalendarCheck} color="bg-gradient-to-br from-purple-500 to-pink-500" />
                <StatCard title="Completed" value={jobs.filter(j => j.status === 'Completed').length} icon={CheckCircle2} color="bg-gradient-to-br from-emerald-500 to-teal-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Action Required: Assigned Jobs */}
                    {jobs.some(j => j.status === 'Assigned') && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden animate-in slide-in-from-top-4">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ClipboardList className="w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8" />
                            </div>
                            <div className="relative z-10">
                                <div className="mb-6 border-b border-white/20 pb-4">
                                    <h1 className="text-2xl font-black text-white tracking-tight">Welcome to ProHome Services Ltd.</h1>
                                    <p className="text-blue-100 text-sm font-medium">You have new assignments waiting for your action.</p>
                                </div>
                                <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
                                    <AlertCircle className="w-5 h-5 text-amber-300" /> Action Required: New Assignments
                                </h2>
                                <div className="space-y-3">
                                    {jobs.filter(j => j.status === 'Assigned').map(job => (
                                        <div key={job.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-white text-sm tracking-wide">{job.type}</span>
                                                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{job.id}</span>
                                                </div>
                                                <p className="text-blue-100 text-xs flex items-center gap-1.5 opacity-90">
                                                    <MapPin className="w-3 h-3" /> {job.address}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 w-full md:w-auto">
                                                <button onClick={() => { setSelectedJob(job); handleAcceptJob(); }} className="flex-1 md:flex-none px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                                    Accept Job
                                                </button>
                                                <button onClick={() => { setSelectedJob(job); setActiveTab('details'); }} className="flex-1 md:flex-none px-4 py-2 bg-blue-700/50 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors border border-blue-500/30">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Today's Schedule Panel */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-500" /> Today's Work Schedule
                            </h2>
                            <button onClick={() => setActiveTab('requests')} className="text-xs text-blue-600 font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {jobs.filter(j => j.status === 'Scheduled' || j.status === 'In Progress').length > 0 ? (
                                jobs.filter(j => j.status === 'Scheduled' || j.status === 'In Progress').map(job => (
                                    <div key={job.id} onClick={() => { setSelectedJob(job); setActiveTab('details'); }} className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all cursor-pointer group">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shrink-0 text-xs text-center leading-tight">
                                            {job.scheduledTime ? job.scheduledTime.split(',')[0].substring(0, 3) : 'Now'}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400">{job.type} - {job.id}</h4>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                                <MapPin className="w-3 h-3" /> {job.address}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p>No scheduled jobs for today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Panel */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6">
                        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg text-emerald-600 dark:text-emerald-400"><Wallet className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase">Earnings (May)</p>
                                        <p className="text-lg font-black text-emerald-900 dark:text-emerald-200">$845.00</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded-lg text-amber-600 dark:text-amber-400"><Star className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-xs text-amber-800 dark:text-amber-300 font-bold uppercase">Avg Rating</p>
                                        <p className="text-lg font-black text-amber-900 dark:text-amber-200">4.9 / 5.0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ServiceRequests = () => (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-slate-50/30 dark:bg-slate-800/50">
                <h2 className="font-bold text-xl text-slate-800 dark:text-white">Assigned Service Requests</h2>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search ID, type..." className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 dark:text-white" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                            <th className="px-6 py-4">Request ID</th>
                            <th className="px-6 py-4">Service & Address</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Schedule</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                        {jobs.map(job => (
                            <tr key={job.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-6 py-4 font-mono text-sm font-bold text-slate-800 dark:text-white">{job.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{job.type}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.address}</div>
                                </td>
                                <td className={`px-6 py-4 text-xs ${getPriorityColor(job.priority)}`}>{job.priority}</td>
                                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {job.scheduledTime || <span className="text-slate-400 italic">Not scheduled</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide shadow-sm ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {job.status === 'Assigned' && (
                                            <>
                                                <button onClick={() => { setSelectedJob(job); handleAcceptJob(); }} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Accept"><CheckCircle2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleUpdateStatus(job.id, 'Rejected')} className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm" title="Reject"><X className="w-4 h-4" /></button>
                                            </>
                                        )}
                                        <button onClick={() => { setSelectedJob(job); setActiveTab('details'); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><ChevronRight className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const JobDetails = () => {
        if (!selectedJob) return <div className="p-12 text-center text-slate-500 font-medium">Select a job to view details</div>;

        return (
            <div className="max-w-4xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
                <button onClick={() => setActiveTab('requests')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Requests
                </button>

                {/* Job Details Header */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{selectedJob.type} Service</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase shadow-sm ${getStatusColor(selectedJob.status)}`}>
                                    {selectedJob.status}
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2 text-sm">
                                Request ID: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{selectedJob.id}</span>
                            </p>
                        </div>
                        {selectedJob.scheduledTime && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800 text-right">
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Scheduled Visit</p>
                                <p className="text-blue-900 dark:text-blue-100 font-bold text-sm flex items-center gap-2 justify-end">
                                    <CalendarCheck className="w-4 h-4" /> {selectedJob.scheduledTime}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Info Blocks */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Issue Description</h3>
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                    {selectedJob.issue}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Property & Tenant</h3>
                                <div className="p-4 bg-white dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600">
                                    <div className="flex items-start gap-3 mb-3">
                                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedJob.address}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Property Address</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <UserCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedJob.tenant}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Tenant Contact: {selectedJob.contact}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Panel */}
                        <div className="lg:w-80 space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-700/20 p-5 rounded-2xl border border-slate-200 dark:border-slate-600">
                                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Actions</h3>
                                <div className="space-y-3">
                                    {selectedJob.status === 'Assigned' && (
                                        <>
                                            <button onClick={handleAcceptJob} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">Accept Job</button>
                                            <button onClick={() => handleUpdateStatus(selectedJob.id, 'Rejected')} className="w-full py-3 bg-white text-rose-600 border border-slate-200 rounded-xl font-bold hover:bg-rose-50 hover:border-rose-200 transition-all">Reject Request</button>
                                        </>
                                    )}

                                    {selectedJob.status === 'Accepted' && (
                                        <button onClick={() => setModalOpen(true)} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 animate-pulse">
                                            <Calendar className="w-4 h-4" /> Schedule Visit Time
                                        </button>
                                    )}

                                    {selectedJob.status === 'Scheduled' && (
                                        <button onClick={() => handleUpdateStatus(selectedJob.id, 'In Progress')} className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30">
                                            Start Job
                                        </button>
                                    )}

                                    {selectedJob.status === 'In Progress' && (
                                        <div className="space-y-3">
                                            <textarea placeholder="Completion notes..." className="w-full p-3 text-sm border border-slate-200 dark:border-slate-600 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 h-24 dark:text-white" defaultValue={selectedJob.notes}></textarea>
                                            <button onClick={() => handleUpdateStatus(selectedJob.id, 'Completed')} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30">
                                                Mark as Completed
                                            </button>
                                        </div>
                                    )}

                                    {selectedJob.status === 'Completed' && (
                                        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center dark:bg-emerald-900/20 dark:border-emerald-800">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                            <p className="text-emerald-800 dark:text-emerald-200 font-bold text-sm">Job Completed</p>
                                            <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1">Payment will be processed shortly.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const EarningsView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Earnings" value="$4,250" icon={Wallet} color="bg-slate-800" />
                <StatCard title="This Month" value="$845" icon={TrendingUp} color="bg-emerald-600" trend="12%" trendUp={true} />
                <StatCard title="Pending Payout" value="$250" icon={Clock} color="bg-amber-500" />
                <StatCard title="Avg per Job" value="$145" icon={CreditCard} color="bg-blue-500" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white">Earnings History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                                <th className="px-6 py-4">Job ID</th>
                                <th className="px-6 py-4">Service Type</th>
                                <th className="px-6 py-4">Full Amount</th>
                                <th className="px-6 py-4">Commission (15%)</th>
                                <th className="px-6 py-4">Net Earned</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {DETAILED_EARNINGS.map((e, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{e.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{e.type}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-white">${e.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-rose-500">-${e.commission.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm font-black text-emerald-600 dark:text-emerald-400">${(e.amount - e.commission).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${e.status === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'}`}>{e.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ProfileView = () => (
        <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                <div className="px-8 pb-8 relative">
                    <div className="absolute -top-12 left-8 w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-md">
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-3xl font-black text-blue-500">JD</div>
                    </div>
                    <div className="pt-16 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">John Doe</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">ProHome Services Ltd.</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Verified Service Partner</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full border border-emerald-100 dark:border-emerald-800">Active</span>
                        </div>
                    </div>

                    <div className="mt-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Services Offered</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Plumbing', 'Electrical', 'General Repair', 'Locks'].map(s => (
                                        <span key={s} className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Availability Status</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setWorkStatus('Available')} className={`flex-1 py-1 text-xs font-bold rounded ${workStatus === 'Available' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>Online</button>
                                    <button onClick={() => setWorkStatus('Busy')} className={`flex-1 py-1 text-xs font-bold rounded ${workStatus === 'Busy' ? 'bg-amber-500 text-white' : 'bg-white dark:bg-slate-800 border dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>Busy</button>
                                    <button onClick={() => setWorkStatus('Offline')} className={`flex-1 py-1 text-xs font-bold rounded ${workStatus === 'Offline' ? 'bg-slate-500 text-white' : 'bg-white dark:bg-slate-800 border dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}>Off</button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Contact Details</h3>
                            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between">
                                    <span>Email</span>
                                    <span className="font-medium text-slate-900 dark:text-white">john.doe@rentease.com</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phone</span>
                                    <span className="font-medium text-slate-900 dark:text-white">+1 (555) 012-3456</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Joined</span>
                                    <span className="font-medium text-slate-900 dark:text-white">March 2023</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const PerformanceView = () => {
        const data = [
            { name: 'Mon', revenue: 400, jobs: 2 },
            { name: 'Tue', revenue: 300, jobs: 1 },
            { name: 'Wed', revenue: 550, jobs: 3 },
            { name: 'Thu', revenue: 450, jobs: 2 },
            { name: 'Fri', revenue: 700, jobs: 4 },
            { name: 'Sat', revenue: 900, jobs: 5 },
            { name: 'Sun', revenue: 0, jobs: 0 },
        ];

        const pieData = [
            { name: 'Plumbing', value: 45 },
            { name: 'Electrical', value: 30 },
            { name: 'General', value: 15 },
            { name: 'Other', value: 10 },
        ];
        const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Revenue Trend</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-xs">Weekly income overview</p>
                            </div>
                            <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                                <button className="px-3 py-1 bg-white dark:bg-slate-600 text-xs font-bold rounded shadow-sm text-slate-800 dark:text-white">Week</button>
                                <button className="px-3 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Month</button>
                            </div>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Service Distribution Pie */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm flex flex-col">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">Service Mix</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-6">Revenue by category</p>
                        <div className="flex-1 flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-black text-slate-800 dark:text-white">45%</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Plumbing</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {pieData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-lg shadow-emerald-500/20 flex flex-col justify-between">
                        <div>
                            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Response Rate</p>
                            <h3 className="text-3xl font-black">98%</h3>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold bg-white/20 w-fit px-2 py-0.5 rounded mt-2">
                            <TrendingUp className="w-3 h-3" /> +2.4%
                        </div>
                    </div>
                    <div className="bg-blue-500 text-white p-5 rounded-2xl shadow-lg shadow-blue-500/20 flex flex-col justify-between">
                        <div>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Job Completion</p>
                            <h3 className="text-3xl font-black">100%</h3>
                        </div>
                        <div className="w-full bg-blue-400/50 h-1.5 rounded-full mt-3">
                            <div className="bg-white h-full rounded-full w-full"></div>
                        </div>
                    </div>
                    <div className="bg-indigo-500 text-white p-5 rounded-2xl shadow-lg shadow-indigo-500/20 flex flex-col justify-between">
                        <div>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Repeat Clients</p>
                            <h3 className="text-3xl font-black">24</h3>
                        </div>
                        <p className="text-xs text-indigo-200 mt-1">4 this month</p>
                    </div>
                    <div className="bg-amber-500 text-white p-5 rounded-2xl shadow-lg shadow-amber-500/20 flex flex-col justify-between">
                        <div>
                            <p className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Avg Rating</p>
                            <h3 className="text-3xl font-black">4.9</h3>
                        </div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-white text-white" />)}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 dark:border-slate-700">
                        <h2 className="font-bold text-lg text-slate-800 dark:text-white">Tenant Reviews</h2>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-700">
                        {REVIEWS.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 shrink-0">
                                        {review.avatar}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-white">{review.tenant}</h4>
                                                <div className="flex items-center gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">{review.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">"{review.comment}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

    };

    const ServicesView = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">My Services</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your service catalog and pricing</p>
                </div>
                <button
                    onClick={() => { setEditingService(null); setIsServiceModalOpen(true); }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                >
                    <Plus className="w-5 h-5" /> Add New Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="h-40 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                            <img src={service.image || "https://images.unsplash.com/photo-1581578731117-10d52143b0d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }}
                                    className="p-2 bg-white/90 dark:bg-slate-800/90 text-blue-600 rounded-lg shadow-lg hover:bg-blue-50"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteService(service.id)}
                                    className="p-2 bg-white/90 dark:bg-slate-800/90 text-rose-500 rounded-lg shadow-lg hover:bg-rose-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-md">
                                {service.category}
                            </span>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">{service.name}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 h-8">{service.description}</p>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4">
                                <div>
                                    {service.originalPrice && <span className="text-xs text-slate-400 line-through mr-2">₹{service.originalPrice}</span>}
                                    <span className="text-lg font-black text-slate-900 dark:text-white">₹{service.price}</span>
                                </div>
                                <button className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg border border-blue-100 dark:border-blue-800">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const SupportView = () => (
        <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <LifeBuoy className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">Need Help?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Have an issue with a job, payment, or the app? Let us know.</p>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Issue Type</label>
                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-white">
                            <option>Payment Dispute</option>
                            <option>App Technical Issue</option>
                            <option>Job Scheduling Problem</option>
                            <option>Report a Tenant</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Description</label>
                        <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 h-32 text-sm dark:text-white" placeholder="Describe your issue in detail..."></textarea>
                    </div>
                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                        Submit Ticket
                    </button>
                    <div className="text-center pt-4 border-t border-slate-50 dark:border-slate-700">
                        <p className="text-xs text-slate-400 font-bold uppercase">Or Call Support</p>
                        <p className="text-lg font-black text-blue-600 mt-1">+1 (800) 123-4567</p>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Time Slot Modal ---
    const TimeSlotModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 m-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Select Visit Time</h3>
                    <button onClick={() => setModalOpen(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" /></button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-100 text-sm rounded-xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                    <Mail className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold mb-1">Tenant Notification</p>
                        <p className="text-xs opacity-80">Once you confirm the slot, an automatic email will be sent to the tenant with your arrival time.</p>
                    </div>
                </div>

                <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Available Slots</p>
                <div className="space-y-3 mb-6">
                    {TIME_SLOTS.map((slot) => (
                        <button
                            key={slot}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${selectedTimeSlot === slot ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]' : 'bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500'}`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleScheduleVisit}
                    disabled={!selectedTimeSlot}
                    className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                    Confirm & Email Tenant
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 dark:text-slate-200 flex font-sans text-slate-900 transition-colors duration-300">
            {/* Sidebar */}
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDesktopSidebarOpen ? 'lg:translate-x-0 lg:w-72' : 'lg:hidden lg:w-0'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-10 pl-2">
                        <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20"><LayoutDashboard className="w-6 h-6 text-blue-400" /></div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight text-white leading-none">RentEase</h1>
                            <div className="flex items-center gap-1.5 mt-1 bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-blue-200 border border-white/5">
                                <Building2 className="w-3 h-3" /> ProHome Services
                            </div>
                        </div>
                    </div>
                    <nav className="space-y-2 flex-1">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'requests', icon: ClipboardList, label: 'Service Requests' },
                            { id: 'my-services', icon: LayoutGrid, label: 'My Services' },
                            { id: 'earnings', icon: Wallet, label: 'Earnings & Payouts' },
                            { id: 'profile', icon: UserCircle, label: 'Profile' },
                            { id: 'performance', icon: BarChart3, label: 'Analytics' },
                            { id: 'support', icon: LifeBuoy, label: 'Support' },
                        ].map(item => (
                            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                                <item.icon className="w-5 h-5" /> {item.label}
                            </button>
                        ))}
                    </nav>
                    <div className="pt-6 border-t border-slate-800">
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors text-sm font-bold">
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Menu className="w-6 h-6" /></button>
                        <button onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} className="hidden lg:block p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><Menu className="w-6 h-6" /></button>
                        <h2 className="font-bold text-slate-800 dark:text-white hidden sm:block capitalize">{activeTab.replace('-', ' ')}</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider leading-none mb-0.5">Company</p>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-300 leading-none">ProHome Services Ltd.</p>
                            </div>
                        </div>

                        <ThemeToggle />

                        <div className="relative">
                            <button onClick={() => setShowNotification(!showNotification)} className="p-2 text-slate-400 hover:text-blue-600 relative">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </button>
                            {showNotification && (
                                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                                        <button onClick={() => setShowNotification(false)}><X className="w-4 h-4 text-slate-400" /></button>
                                    </div>
                                    <div className="space-y-3">
                                        {NOTIFICATIONS.map(n => (
                                            <div key={n.id} className="text-xs p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg">
                                                <p className="font-bold text-slate-700 dark:text-slate-300">{n.text}</p>
                                                <p className="text-slate-400 mt-1">{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">John Doe</p>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${workStatus === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{workStatus}</span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">JD</div>
                        </div>
                    </div>
                </header>

                <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'requests' && <ServiceRequests />}
                    {activeTab === 'details' && <JobDetails />}
                    {activeTab === 'my-services' && <ServicesView />}
                    {activeTab === 'earnings' && <EarningsView />}
                    {activeTab === 'profile' && <ProfileView />}
                    {activeTab === 'performance' && <PerformanceView />}
                    {activeTab === 'support' && <SupportView />}
                </div>
            </main>

            {/* Modals & Overlays */}
            <ServiceModal
                isOpen={isServiceModalOpen}
                onClose={() => { setIsServiceModalOpen(false); setEditingService(null); }}
                onSave={editingService ? handleEditService : handleAddService}
                service={editingService}
            />
            {modalOpen && <TimeSlotModal />}
            {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
            {message && (
                <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 z-[100]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-sm">{message}</span>
                </div>
            )}
        </div>
    );
};
export default ServiceProvider;
