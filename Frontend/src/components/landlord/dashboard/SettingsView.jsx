import React, { useState } from 'react';
import { UserCircle, Plus, Globe, Sun, Moon, Settings, Lock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';
import { toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from '../../../utils/apiConfig';
import { useTheme } from '../../../context/ThemeContext';

const SettingsView = ({ user, handleLogout, onUpdateUser }) => {
    const { theme, setTheme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    
    const [showOldPass, setShowOldPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

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
        if (name === 'phone') {
            // Only allow digits and max 10 chars
            const cleaned = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSystemTheme = () => {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(isSystemDark ? 'dark' : 'light');
        toast.success("Applied System Theme");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        
        if (formData.phone && formData.phone.length !== 10) {
            toast.error("Phone number must be exactly 10 digits");
            return;
        }

        setIsUpdatingProfile(true);
        try {
            const response = await axios.put(`${BASE_URL}/api/auth/update-profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                toast.success("Profile updated successfully!");
                const updatedUser = {
                    ...user,
                    name: `${formData.first_name} ${formData.last_name}`.trim(),
                    email: formData.email,
                    phone: formData.phone,
                    avatar_url: formData.avatar_url
                };
                onUpdateUser(updatedUser);
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match"); return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters"); return;
        }
        setChangingPassword(true);
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(`${BASE_URL}/api/auth/change-password`, {
                currentPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Password changed successfully!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    const inputBaseStyle = `w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;
    const passInputBase = `w-full pl-4 pr-10 py-2 rounded-lg border outline-none transition-colors duration-500 text-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-violet-500' : 'bg-white border-slate-300 text-slate-900 focus:border-violet-500'}`;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Settings</h2>
                <p className={`text-sm mt-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage your preferences and profile details</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile */}
                <div className="lg:col-span-2 space-y-6">
                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('landlord-profile-upload').click()}>
                                <input
                                    type="file"
                                    id="landlord-profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const toastId = toast.loading("Uploading image...");
                                        try {
                                            const fd = new FormData();
                                            fd.append("file", file);
                                            fd.append("upload_preset", "First_project");
                                            const res = await fetch("https://api.cloudinary.com/v1_1/dghdwtef5/image/upload", { method: "POST", body: fd });
                                            if (!res.ok) throw new Error("Upload failed");
                                            const data = await res.json();
                                            setFormData(prev => ({ ...prev, avatar_url: data.secure_url }));
                                            toast.update(toastId, { render: "Profile picture uploaded! Click Save to apply.", type: "success", isLoading: false, autoClose: 3000 });
                                        } catch (err) {
                                            toast.update(toastId, { render: "Failed to upload image", type: "error", isLoading: false, autoClose: 3000 });
                                        }
                                    }}
                                />
                                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isDarkMode ? 'border-violet-500/50 group-hover:border-violet-400' : 'border-violet-200 group-hover:border-violet-300'}`}>
                                    {formData.avatar_url ? (
                                        <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                                            <UserCircle size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-0 p-1.5 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-violet-600 text-white border-slate-800' : 'bg-violet-600 text-white border-white'}`}>
                                    <Plus size={14} strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Profile Information</h3>
                                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Update your personal details</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>First Name</label>
                                    <input name="first_name" value={formData.first_name} onChange={handleInputChange} className={inputBaseStyle} />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Last Name</label>
                                    <input name="last_name" value={formData.last_name} onChange={handleInputChange} className={inputBaseStyle} />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                                    <input name="email" value={formData.email} onChange={handleInputChange} className={inputBaseStyle} />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Phone Number</label>
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} className={inputBaseStyle} />
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <LandlordButton type="submit" disabled={isUpdatingProfile} isDarkMode={isDarkMode}>
                                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                </LandlordButton>
                                <LandlordButton type="button" variant="secondary" onClick={() => setShowPasswordSection(!showPasswordSection)} isDarkMode={isDarkMode}>
                                    {showPasswordSection ? 'Cancel Password Change' : 'Change Password'}
                                </LandlordButton>
                            </div>
                        </form>
                    </Card>

                    {showPasswordSection && (
                        <Card isDarkMode={isDarkMode} className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                    <Lock size={20} />
                                </div>
                                <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security</h3>
                            </div>
                            <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { label: 'Current Password', key: 'oldPassword', show: showOldPass, setShow: setShowOldPass },
                                    { label: 'New Password', key: 'newPassword', show: showNewPass, setShow: setShowNewPass },
                                    { label: 'Confirm Password', key: 'confirmPassword', show: showConfirmPass, setShow: setShowConfirmPass }
                                ].map(({ label, key, show, setShow }) => (
                                    <div key={key}>
                                        <label className={`block text-xs font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
                                        <div className="relative">
                                            <input
                                                type={show ? 'text' : 'password'}
                                                value={passwordData[key]}
                                                onChange={e => setPasswordData(prev => ({ ...prev, [key]: e.target.value }))}
                                                className={passInputBase}
                                                required
                                            />
                                            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div className="md:col-span-3 pt-2">
                                    <LandlordButton type="submit" disabled={changingPassword} isDarkMode={isDarkMode}>
                                        {changingPassword ? 'Updating...' : 'Apply New Password'}
                                    </LandlordButton>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>

                {/* Right Column: Preferences */}
                <div className="space-y-6">
                    <Card isDarkMode={isDarkMode} className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                <Globe size={24} />
                            </div>
                            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Preferences</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className={`text-sm mb-3 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>App Theme</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`p-2 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'light' ? 'bg-violet-100 border-violet-500 text-violet-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                    >
                                        <Sun size={20} />
                                        <span className="text-xs">Light</span>
                                    </button>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`p-2 rounded-lg border flex flex-col items-center gap-2 transition-all ${theme === 'dark' ? 'bg-violet-500/20 border-violet-500 text-violet-400' : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                                    >
                                        <Moon size={20} />
                                        <span className="text-xs">Dark</span>
                                    </button>
                                    <button
                                        onClick={handleSystemTheme}
                                        className={`p-2 rounded-lg border flex flex-col items-center gap-2 transition-all border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800`}
                                    >
                                        <Settings size={20} />
                                        <span className="text-xs">System</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsView;
