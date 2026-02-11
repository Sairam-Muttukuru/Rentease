import React from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const ChangePasswordModal = ({
    isDarkMode,
    setShowChangePasswordModal,
    handlePasswordUpdate,
    passwordForm,
    setPasswordForm,
    isUpdatingPassword,
    t
}) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

            <div className={`p-6 border-b flex justify-between items-center transition-colors duration-500 backdrop-blur-md ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white/50'}`}>
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Change Password</h3>
                <button onClick={() => setShowChangePasswordModal(false)} className={`transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Current Password</label>
                    <input
                        required
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>New Password</label>
                    <input
                        required
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                </div>
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Confirm New Password</label>
                    <input
                        required
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-violet-500 transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
                    />
                </div>
                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isUpdatingPassword}>
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    </div>
);

export default ChangePasswordModal;
