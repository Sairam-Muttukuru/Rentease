import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Megaphone, Trash2, Calendar, AlertCircle, Plus, X } from 'lucide-react';

const LandlordAnnouncementsView = ({ isDarkMode, properties = [] }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // New State for Targeting
    // Properties are now passed as props
    const [tenants, setTenants] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        category: 'General',
        priority: 'medium',
        content: '',
        audience: 'all',
        property_id: '',
        target_type: 'all',
        target_tenant_id: ''
    });

    useEffect(() => {
        fetchAnnouncements();
        // Properties are passed from parent
    }, []);

    const handlePropertyChange = async (propertyId) => {
        setFormData(prev => ({ ...prev, property_id: propertyId, target_tenant_id: '' }));
        if (!propertyId) {
            setTenants([]);
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`https://rentease-1-pwm5.onrender.com/api/tenants/property/${propertyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTenants(res.data);
        } catch (error) {
            console.error("Failed to fetch tenants:", error);
            // toast.error("Could not load tenants for selected property");
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/announcement/landlord', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
            // toast.error("Failed to load announcements");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post('https://rentease-1-pwm5.onrender.com/api/announcement', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Announcement posted successfully!");
            setShowForm(false);
            setFormData({ title: '', category: 'General', priority: 'medium', content: '', audience: 'all' });
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            toast.error("Failed to post announcement");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed', // violet-600
            cancelButtonColor: '#ef4444', // rose-500
            confirmButtonText: 'Yes, delete it!',
            background: isDarkMode ? '#1e293b' : '#ffffff',
            color: isDarkMode ? '#f8fafc' : '#0f172a',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("accessToken");
                await axios.delete(`https://rentease-1-pwm5.onrender.com/api/announcement/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnnouncements(prev => prev.filter(a => a.id !== id));

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your announcement has been deleted.',
                    icon: 'success',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                    confirmButtonColor: '#7c3aed'
                });
            } catch (error) {
                console.error("Error deleting announcement:", error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete announcement.',
                    icon: 'error',
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    color: isDarkMode ? '#f8fafc' : '#0f172a',
                    confirmButtonColor: '#7c3aed'
                });
            }
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Announcements</h1>
                    <p className={`mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage notices and updates for your tenants.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/20"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'New Announcement'}
                </button>
            </div>

            {showForm && (
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} animate-in slide-in-from-top-4 duration-300`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 focus:border-violet-500'} focus:ring-1 focus:ring-violet-500 outline-none transition-all`}
                                    placeholder="e.g. Scheduled Maintenance"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} outline-none`}
                                    >
                                        <option value="General">General</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Event">Event</option>
                                        <option value="Emergency">Emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} outline-none`}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Targeting Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select Property</label>
                                <select
                                    required
                                    value={formData.property_id}
                                    onChange={e => handlePropertyChange(e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} outline-none`}
                                >
                                    <option value="">-- Choose Property --</option>
                                    {properties.map(prop => (
                                        <option key={prop.id} value={prop.id}>{prop.title}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.property_id && (
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Target Audience</label>
                                    <div className="flex gap-4 mt-2">
                                        <label className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <input
                                                type="radio"
                                                name="target_type"
                                                checked={formData.target_type === 'all'}
                                                onChange={() => setFormData(prev => ({ ...prev, target_type: 'all', target_tenant_id: '' }))}
                                                className="accent-violet-600"
                                            />
                                            All Tenants
                                        </label>
                                        <label className={`flex items-center gap-2 cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <input
                                                type="radio"
                                                name="target_type"
                                                checked={formData.target_type === 'specific'}
                                                onChange={() => setFormData(prev => ({ ...prev, target_type: 'specific' }))}
                                                className="accent-violet-600"
                                            />
                                            Specific Tenant
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {formData.target_type === 'specific' && (
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Select Tenant</label>
                                <select
                                    required
                                    value={formData.target_tenant_id}
                                    onChange={e => setFormData({ ...formData, target_tenant_id: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} outline-none`}
                                >
                                    <option value="">-- Choose Tenant --</option>
                                    {tenants.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.name || "Unknown Tenant"}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Content</label>
                            <textarea
                                required
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                rows="4"
                                className={`w-full px-4 py-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 focus:border-violet-500'} focus:ring-1 focus:ring-violet-500 outline-none transition-all resize-none`}
                                placeholder="Write the details of the announcement here..."
                            ></textarea>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="px-8 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-violet-500/25"
                            >
                                Post Announcement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : announcements.length === 0 ? (
                    <div className={`text-center py-20 rounded-2xl border border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
                        <Megaphone className={`mx-auto h-12 w-12 mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>No Announcements Yet</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Create your first announcement to notify tenants.</p>
                    </div>
                ) : (
                    announcements.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-violet-200'}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(item.priority)}`}>
                                            {item.priority.toUpperCase()}
                                        </span>
                                        <span className={`flex items-center gap-1.5 text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            <Calendar size={14} />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.content}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Announcement"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LandlordAnnouncementsView;
