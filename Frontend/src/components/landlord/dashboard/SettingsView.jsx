import React, { useState } from 'react';
import { Settings, Edit2, LogOut, User, Phone, Mail, Camera, Save, X, Lock, Eye, EyeOff, Globe } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import { toast } from 'react-toastify';
import axios from 'axios';

const SettingsView = ({ user, isDarkMode, handleLogout, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    const nameParts = user.name ? user.name.split(' ') : ['', ''];
    const [formData, setFormData] = useState({
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar_url: user.avatar_url || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadToCloudinary = async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("upload_preset", "First_project");
        const res = await fetch("https://api.cloudinary.com/v1_1/dghdwtef5/image/upload", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Cloudinary upload failed");
        const data = await res.json();
        return data.secure_url;
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, avatar_url: url }));
            toast.success("Profile photo updated. Save to apply.");
        } catch (err) {
            toast.error("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        try {
            const response = await axios.put("/api/auth/update-profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                const updatedUser = {
                    ...user,
                    name: `${formData.first_name} ${formData.last_name}`,
                    email: formData.email,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                };
                onUpdateUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update profile");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setChangingPassword(true);
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post("/api/auth/change-password", {
                currentPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Password changed successfully!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    const inputBase = `w-full pl-10 pr-4 py-3.5 rounded-2xl border outline-none transition-all duration-300 text-sm font-medium
        ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-violet-500 focus:bg-slate-900 focus:ring-4 focus:ring-violet-500/10' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5'}`;

    const passInputBase = `w-full pl-10 pr-12 py-3.5 rounded-2xl border outline-none transition-all duration-300 text-sm font-medium
        ${isDarkMode ? 'bg-slate-900/50 border-slate-700/50 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5'}`;

    const infoRow = (label, value, icon, color) => (
        <div className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${isDarkMode ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60' : 'border-slate-100 bg-white hover:border-violet-100 hover:shadow-sm'}`}>
            <div className={`p-3 rounded-xl ${isDarkMode ? `bg-${color}-500/10 text-${color}-400` : `bg-${color}-50 text-${color}-600`}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-black uppercase tracking-[0.1em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                <p className={`text-base font-bold mt-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value || 'Not provided'}</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">

            {/* Header Area */}
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Settings</h2>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Manage your private information and security</p>
                </div>
                <div className="flex gap-4">
                    {!isEditing && (
                        <LandlordButton isDarkMode={isDarkMode} icon={Edit2} onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </LandlordButton>
                    )}
                    <LandlordButton isDarkMode={isDarkMode} variant="danger" icon={LogOut} onClick={handleLogout}>
                        Sign Out
                    </LandlordButton>
                </div>
            </div>

            {/* Profile Section */}
            <Card isDarkMode={isDarkMode} className="p-10 border-none shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar Container */}
                    <div className="relative">
                        <div className="w-40 h-40 rounded-[2.5rem] border-8 border-slate-100 dark:border-slate-800 overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (formData.first_name?.charAt(0) || user.name?.charAt(0) || 'U').toUpperCase()
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute -bottom-2 -right-2 p-4 bg-violet-600 text-white rounded-2xl cursor-pointer hover:bg-violet-700 transition-all shadow-xl border-4 border-white dark:border-slate-800">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
                            </label>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/60 rounded-[2.5rem] flex items-center justify-center backdrop-blur-sm">
                                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Basic Info or Edit Form */}
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <form onSubmit={handleSaveChanges} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-2">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First Name" className={inputBase} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-2">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last Name" className={inputBase} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={inputBase} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-2">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className={inputBase} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <LandlordButton type="button" className="flex-1 justify-center py-4 rounded-2xl" variant="secondary" isDarkMode={isDarkMode} onClick={() => setIsEditing(false)} icon={X}>
                                        Cancel
                                    </LandlordButton>
                                    <LandlordButton type="submit" className="flex-1 justify-center py-4 rounded-2xl" isDarkMode={isDarkMode} icon={Save}>
                                        Save Changes
                                    </LandlordButton>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div>
                                    <h3 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                                    <p className="text-violet-500 font-bold tracking-widest uppercase text-xs mt-2 italic">Professional Landlord</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {infoRow("Email Address", user.email, <Mail size={20} />, "blue")}
                                    {infoRow("Phone Number", user.phone, <Phone size={20} />, "indigo")}
                                    {infoRow("Region / Locale", "India", <Globe size={20} />, "violet")}
                                    {infoRow("Account Status", "Fully Verified", <User size={20} />, "purple")}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Security Section */}
            <Card isDarkMode={isDarkMode} className="p-8 border-none shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            <Lock size={24} />
                        </div>
                        <div>
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security Settings</h4>
                            <p className="text-sm text-slate-500 font-medium">Keep your account safe by updating your password regularly</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPasswordSection(p => !p)}
                        className={`text-sm font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all ${isDarkMode ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20' : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'}`}
                    >
                        {showPasswordSection ? 'Dismiss' : 'Update Password'}
                    </button>
                </div>

                {showPasswordSection && (
                    <form onSubmit={handleChangePassword} className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {[
                                { label: 'Current Password', key: 'oldPassword', show: showOldPass, setShow: setShowOldPass },
                                { label: 'New Password', key: 'newPassword', show: showNewPass, setShow: setShowNewPass },
                                { label: 'Confirm Password', key: 'confirmPassword', show: showConfirmPass, setShow: setShowConfirmPass }
                            ].map(({ label, key, show, setShow }) => (
                                <div key={key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 ml-2">{label}</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type={show ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={passwordData[key]}
                                            onChange={e => setPasswordData(prev => ({ ...prev, [key]: e.target.value }))}
                                            className={passInputBase}
                                            required
                                        />
                                        <button type="button" onClick={() => setShow(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <LandlordButton type="submit" isDarkMode={isDarkMode} icon={Lock} className="w-full justify-center py-4 rounded-2xl shadow-xl shadow-amber-500/10" disabled={changingPassword}>
                            {changingPassword ? 'Processing Request...' : 'Apply New Password'}
                        </LandlordButton>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default SettingsView;
