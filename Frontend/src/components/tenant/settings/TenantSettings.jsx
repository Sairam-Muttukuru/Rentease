import React, { useState, useEffect } from 'react';
import { UserCircle, Plus, Bell, Globe, Sun, Moon, Settings } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";
import { toast } from "react-toastify";
import axios from "axios";

const TenantSettings = ({
    user,
    setUser,
    isDarkMode,
    setShowChangePasswordModal,
    handleUpdateProfile,
    isUpdatingProfile,
    t,
    i18n
}) => {
    const { setTheme, theme } = useTheme();

    // Notification State
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('notification_preferences');
        return saved ? JSON.parse(saved) : {
            rentReminders: true,
            maintenanceUpdates: true,
            communityNews: true
        };
    });

    // Save functionality
    useEffect(() => {
        localStorage.setItem('notification_preferences', JSON.stringify(notifications));
    }, [notifications]);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
        toast.info("Preference updated");
    };

    const handleSystemTheme = () => {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(isSystemDark ? 'dark' : 'light');
        toast.success("Applied System Theme");
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('common.settings')}</h2>
                <p className={`text-sm mt-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.manage_preferences')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">

                    {/* Profile Section */}
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById('profile-upload').click()}>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const toastId = toast.loading("Uploading image...");
                                        try {
                                            // Upload to Cloudinary
                                            const fd = new FormData();
                                            fd.append("file", file);
                                            fd.append("upload_preset", "First_project");
                                            fd.append("cloud_name", "dghdwtef5");

                                            const res = await fetch(
                                                "https://api.cloudinary.com/v1_1/dghdwtef5/image/upload",
                                                { method: "POST", body: fd }
                                            );

                                            if (!res.ok) throw new Error("Upload failed");
                                            const data = await res.json();
                                            const secureUrl = data.secure_url;

                                            // Update State immediately for preview
                                            setUser(prev => ({ ...prev, avatar_url: secureUrl }));

                                            // Save to Database via Profile Update
                                            const token = localStorage.getItem("accessToken");
                                            await axios.put("https://rentease-1-pwm5.onrender.com/api/tenants/profile", {
                                                full_name: user.name,
                                                email: user.email,
                                                phone: user.phone,
                                                avatar_url: secureUrl
                                            }, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });

                                            toast.update(toastId, { render: "Profile picture updated!", type: "success", isLoading: false, autoClose: 3000 });
                                        } catch (err) {
                                            console.error(err);
                                            toast.update(toastId, { render: "Failed to upload image", type: "error", isLoading: false, autoClose: 3000 });
                                        }
                                    }}
                                />
                                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${isDarkMode ? 'border-violet-500/50 group-hover:border-violet-400' : 'border-violet-200 group-hover:border-violet-300'}`}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                                            <UserCircle size={40} />
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute bottom-0 right-0 p-1.5 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-violet-600 text-white border-2 border-slate-800' : 'bg-violet-600 text-white border-2 border-white'}`}>
                                    <Plus size={14} strokeWidth={3} />
                                </div>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings.profile_info')}</h3>
                                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.update_personal_details')}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('settings.full_name')}</label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('settings.email_address')}</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t('settings.phone_number')}</label>
                                    <input
                                        type="tel"
                                        value={user.phone}
                                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                        className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-violet-500 outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <Button onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                                    {isUpdatingProfile ? t('common.saving') : t('settings.save_changes')}
                                </Button>
                                <Button variant="secondary" onClick={() => setShowChangePasswordModal(true)}>
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </Card>

                </div>

                <div className="space-y-6">
                    {/* Notification Preferences */}
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                <Bell size={24} />
                            </div>
                            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Rent Reminders', key: 'rentReminders' },
                                { label: 'Maintenance Updates', key: 'maintenanceUpdates' },
                                { label: 'Community News', key: 'communityNews' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-transparent">
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.key]}
                                            onChange={() => toggleNotification(item.key)}
                                            className="sr-only peer"
                                        />
                                        <div className={`w-11 h-6 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isDarkMode ? 'bg-slate-700 peer-checked:bg-violet-600' : 'bg-slate-200 peer-checked:bg-violet-600'}`}></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Appearance */}
                    <Card className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                                <Globe size={24} />
                            </div>
                            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings.preferences')}</h3>
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

                            <div className="pt-2 border-t dark:border-slate-800">
                                <div className="flex justify-between items-center mt-3">
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('settings.language')}</span>
                                    <select
                                        value={i18n.language}
                                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                                    >
                                        <option value="en">English (US)</option>
                                        <option value="hi">Hindi (हिंदी)</option>
                                        <option value="te">Telugu (తెలుగు)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TenantSettings;
