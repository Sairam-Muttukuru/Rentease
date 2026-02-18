import React, { useState } from 'react';
import { Settings, Edit2, BellRing, Shield, LogOut, User, Phone, Mail, Camera, Save, X } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import { toast } from 'react-toastify';
import axios from 'axios';

const SettingsView = ({ user, isDarkMode, handleLogout, onUpdateUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Parse first and last name from user.name if possible
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
            toast.success("Profile image uploaded locally. Save changes to apply.");
        } catch (err) {
            console.error(err);
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
            const response = await axios.put("http://localhost:5000/api/auth/update-profile", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);

                // Construct updated user object for the parent
                const updatedUser = {
                    ...user,
                    name: `${formData.first_name} ${formData.last_name}`,
                    email: formData.email,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                };

                // Update parent state and localStorage
                onUpdateUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error("Update failed:", err);
            toast.error(err.response?.data?.error || "Failed to update profile");
        }
    };

    const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 focus:border-violet-500'}`;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white shadow-sm border text-black'}`}>
                        <Settings size={24} />
                    </div>
                    <div>
                        <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Settings</h2>
                        <p className={`font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Manage your account preferences</p>
                    </div>
                </div>
                {!isEditing && (
                    <LandlordButton
                        isDarkMode={isDarkMode}
                        icon={Edit2}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </LandlordButton>
                )}
            </div>

            <Card isDarkMode={isDarkMode} className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-800/50">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-violet-500/20 overflow-hidden bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                            {formData.avatar_url ? (
                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                (formData.first_name?.charAt(0) || user.name?.charAt(0))
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 p-2 bg-violet-600 text-white rounded-full cursor-pointer hover:bg-violet-700 transition-colors shadow-lg border-2 border-slate-950">
                                <Camera size={18} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
                            </label>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
                                <div className="flex flex-col md:flex-row gap-4 mt-2 text-slate-500 font-medium">
                                    <span className="flex items-center gap-2 justify-center md:justify-start"><Mail size={16} /> {user.email}</span>
                                    {user.phone && <span className="flex items-center gap-2 justify-center md:justify-start"><Phone size={16} /> {user.phone}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex gap-4">
                        <LandlordButton
                            className="flex-1 justify-center"
                            variant="secondary"
                            isDarkMode={isDarkMode}
                            onClick={() => setIsEditing(false)}
                            icon={X}
                        >
                            Cancel
                        </LandlordButton>
                        <LandlordButton
                            className="flex-1 justify-center"
                            isDarkMode={isDarkMode}
                            onClick={handleSaveChanges}
                            icon={Save}
                        >
                            Save Changes
                        </LandlordButton>
                    </div>
                )}

                <div className="space-y-4">
                    <h4 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Security & Preferences</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500"><BellRing size={20} /></div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Notifications</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Payments & maintenance</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-violet-600/20 border border-violet-600/50 relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-violet-500 shadow-lg"></div>
                            </div>
                        </div>
                        <div className={`flex items-center justify-between p-5 rounded-2xl border ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500"><Shield size={20} /></div>
                                <div>
                                    <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Account Security</h4>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Two-Factor Protected</p>
                                </div>
                            </div>
                            <div className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 relative cursor-pointer">
                                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-slate-500"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-800/50">
                    <LandlordButton
                        isDarkMode={isDarkMode}
                        onClick={handleLogout}
                        variant="danger"
                        icon={LogOut}
                        className="w-full justify-center"
                    >
                        Sign Out
                    </LandlordButton>
                </div>
            </Card>
        </div>
    );
};
export default SettingsView;
