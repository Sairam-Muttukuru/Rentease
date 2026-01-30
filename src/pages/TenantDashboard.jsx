/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
import React, { useState, useEffect } from 'react';
import {
  Home,
  CreditCard,
  MessageSquare,
  FileText,
  User,
  Bell,
  LogOut,
  Plus,
  Wrench,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  Menu,
  X,
  DollarSign,
  Calendar,
  Users,
  Settings,
  Building,
  Sparkles,
  Sun,
  Moon,
  Shield,
  BellRing,
  Globe,
  UserCircle,
  Camera,
  CheckCircle2
} from 'lucide-react';
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from '../context/ThemeContext';
import { Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/RentPayment";
import TenantHomeServices from './TenantHomeServices';
import { useTranslation } from 'react-i18next';

// Initialize Stripe with your Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const handleLogout = async () => {
  console.log("Logout clicked");

  try {
    await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTenantId");
    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);

  } catch (err) {
    console.error("Logout error:", err);
    // Even if server logout fails, clear local state and redirect
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTenantId");
    window.location.href = "/";
  }
};


// --- Mock Data & Constants ---


// --- Utility Components ---

const StatusBadge = ({ status }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Normalize status to Title Case for consistent styling
  const normalize = (str) => {
    if (!str) return "Open";
    if (str.toLowerCase() === 'in progress') return 'In Progress';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const normalizedStatus = normalize(status);

  const styles = {
    Paid: isDarkMode
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: isDarkMode
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : "bg-amber-100 text-amber-700 border-amber-200",
    Overdue: isDarkMode
      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
      : "bg-rose-100 text-rose-700 border-rose-200",
    "In Progress": isDarkMode
      ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
      : "bg-blue-100 text-blue-700 border-blue-200",
    Resolved: isDarkMode
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-emerald-100 text-emerald-700 border-emerald-200",
    Open: isDarkMode
      ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
      : "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-sm transition-colors duration-500 ${styles[normalizedStatus] || styles.Open}`}>
      {normalizedStatus}
    </span>
  );
};

const Card = ({ children, className = "" }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <div className={`
      backdrop-blur-md rounded-xl shadow-xl border transition-all duration-500 ease-in-out
      ${isDarkMode
        ? 'bg-slate-900/50 border-slate-800'
        : 'bg-white/80 border-slate-200 shadow-slate-200/50'} 
      ${className}
    `}>
      {children}
    </div>
  );
};

const Button = ({ children, variant = "primary", onClick, className = "", disabled = false, icon: Icon, type = "button" }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] border border-white/10",
    secondary: isDarkMode
      ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
    ghost: isDarkMode
      ? "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
      : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    outline: isDarkMode
      ? "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
      : "bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900",
    icon: "p-2 aspect-square rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm border border-white/10"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:scale-105
        ${isDarkMode ? 'bg-slate-700 ring-offset-slate-900' : 'bg-slate-200 ring-offset-white'}
      `}
    >
      <span
        className={`
          inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-all duration-500 ease-in-out
          ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}
        `}
      >
        <span className={`absolute transition-all duration-500 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}>
          <Moon size={14} className="text-violet-600" />
        </span>
        <span className={`absolute transition-all duration-500 ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
          <Sun size={14} className="text-orange-500" />
        </span>
      </span>
    </button>
  );
};

// --- Main Application Component ---

const SettingsView = ({
  user,
  setUser,
  isDarkMode,
  setShowChangePasswordModal,
  handleUpdateProfile,
  isUpdatingProfile,
  t,
  i18n
}) => (
  <div className="space-y-8">
    <div>
      <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('common.settings')}</h2>
      <p className={`text-sm mt-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('settings.manage_preferences')}</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">

        {/* Profile Section */}
        <Card isDarkMode={isDarkMode} className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
              <UserCircle size={24} />
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
            <div className="pt-2">
              <Button isDarkMode={isDarkMode} onClick={handleUpdateProfile} disabled={isUpdatingProfile}>
                {isUpdatingProfile ? t('common.saving') : t('settings.save_changes')}
              </Button>
            </div>
          </div>
        </Card>

      </div>

      <div className="space-y-6">
        {/* Account Security */}
        <Card isDarkMode={isDarkMode} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
              <Shield size={24} />
            </div>
            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings.security')}</h3>
          </div>
          <div className="space-y-3">
            <Button isDarkMode={isDarkMode} variant="outline" className="w-full justify-between" onClick={() => setShowChangePasswordModal(true)}>
              {t('settings.change_password')}
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>

        {/* Appearance */}
        <Card isDarkMode={isDarkMode} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-2 rounded-lg transition-colors duration-500 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <Globe size={24} />
            </div>
            <h3 className={`text-lg font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t('settings.preferences')}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t('settings.language')}</span>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className={`px-2 py-1 rounded border text-sm outline-none transition-colors duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const ComplaintDetail = ({
  complaints,
  isLoading,
  isDarkMode,
  navigate,
  userName,
  handleUpdateStatus
}) => {
  const { id } = useParams();
  const complaint = complaints.find(c => c.id === parseInt(id));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        <p className={`mt-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Loading details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[50vh]">
        <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
          <AlertCircle size={32} />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Not Found</h3>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>The complaint you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate(`/${userName}/tenant/dashboard/complaints`)} className="text-violet-500 hover:text-violet-400 font-medium mt-6 flex items-center gap-2">
          <ChevronLeft size={16} /> Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(`/${userName}/tenant/dashboard/complaints`)} className={`p-2 rounded-xl border transition-all duration-300 group ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white' : 'border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm'}`}>
          <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Details</h2>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>ID: #{complaint.id}</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-8 border-b dark:border-slate-800 border-slate-100">
          <div>
            <h3 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{complaint.title}</h3>
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <StatusBadge status={complaint.status} />
              <span className={`px-3 py-1 rounded-full border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{complaint.category}</span>
              <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <Clock size={14} /> {complaint.date}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                <FileText size={16} /> Description
              </h4>
              <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>{complaint.description}</p>
            </div>

            <div>
              <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                <Camera size={16} /> Attached Evidence
              </h4>
              {complaint.images && complaint.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {complaint.images.map((img, idx) => (
                    <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border group cursor-zoom-in ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} onClick={() => window.open(img, '_blank')}>
                      <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg">
                          <Download size={20} className="text-slate-900" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 rounded-xl border border-dashed text-center ${isDarkMode ? 'border-slate-700 bg-slate-800/50 text-slate-500' : 'border-slate-300 bg-slate-50 text-slate-500'}`}>
                  <p className="italic">No images attached to this complaint.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Ticket Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</span>
                  <span className={`font-bold px-2 py-1 rounded text-xs uppercase tracking-wider ${complaint.status === 'Resolved'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-amber-500/10 text-amber-500'
                    }`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0">
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Priority</span>
                  <span className={`font-bold ${['High', 'Critical'].includes(complaint.priority_level) ? 'text-rose-500' : 'text-amber-500'}`}>
                    {complaint.priority_level || 'Low'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 last:border-0 last:pb-0">
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Category</span>
                  <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{complaint.category}</span>
                </div>
              </div>
            </div>

            {complaint.status?.toLowerCase() !== 'resolved' && (
              <div className={`p-6 mb-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Update Status</h4>
                <div className="flex flex-col gap-3">
                  {['open', 'in progress'].includes(complaint.status?.toLowerCase()) && (
                    <Button
                      onClick={() => handleUpdateStatus(complaint.id, 'In Progress')}
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 border-0"
                    >
                      Mark as In Progress
                    </Button>
                  )}
                  <Button
                    onClick={() => handleUpdateStatus(complaint.id, 'Resolved')}
                    className="w-full justify-center bg-emerald-600 hover:bg-emerald-700 border-0"
                  >
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Timeline</h4>
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-violet-500 bg-white dark:bg-slate-900"></div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaint Submitted</p>
                  <p className="text-xs text-slate-500">{complaint.date}</p>
                </div>
                {complaint.status !== 'Open' && (
                  <div className="relative pl-8">
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 ${complaint.status === 'Resolved' ? 'border-emerald-500' : 'border-amber-500'} bg-white dark:bg-slate-900`}></div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Status Updated to {complaint.status}</p>
                    <p className="text-xs text-slate-500">Recently</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const MyPropertyView = ({
  isDarkMode,
  user,
  propertyImages,
  currentImageIndex,
  setCurrentImageIndex,
  prevImage,
  nextImage
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>My Property</h2>
      <div className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-500 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
        Lease Active
      </div>
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl group border transition-all duration-500 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <div className="absolute inset-0">
            <img
              key={currentImageIndex}
              src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
              alt="Property View"
              className="w-full h-full object-cover animate-in fade-in duration-700"
            />
            <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${isDarkMode ? 'from-slate-900 via-transparent to-transparent' : 'from-black/50 via-transparent to-transparent'}`}></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
              <h3 className="text-3xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{user.propertyName}</h3>
              <p className="text-white/90 flex items-center gap-2 text-sm backdrop-blur-md bg-black/30 w-fit px-3 py-1 rounded-full">
                <Building size={14} /> {user.address}
              </p>
            </div>
            <div className="hidden sm:block shrink-0">
              <span className="text-white/80 text-sm bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                {currentImageIndex + 1} / {propertyImages.length}
              </span>
            </div>
          </div>

          {propertyImages.length > 1 && (
            <>
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Type', value: 'Luxury Villa', icon: Building },
            { label: 'Size', value: '2,400 sq ft', icon: FileText },
            { label: 'Bedrooms', value: '4 Beds', icon: Users },
            { label: 'Bathrooms', value: '3 Baths', icon: Sparkles }
          ].map((item, idx) => (
            <Card key={idx} className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:scale-105 transition-transform cursor-default">
              <item.icon size={24} className={`transition-colors duration-500 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
              <div>
                <p className={`text-xs font-medium uppercase transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
                <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Residents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.members.map((member) => (
              <div key={member.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                  {member.full_name.charAt(0)}
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.full_name}</p>
                  <p className={`text-xs uppercase tracking-wider font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{member.relation || 'Resident'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Landlord Details</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
              {(user.landlord || "?").charAt(0)}
            </div>
            <div>
              <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.landlord}</p>
              <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property Owner</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">Message Landlord</Button>
            <Button variant="ghost" className="w-full">View Profile</Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

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

const PaymentModal = ({
  isDarkMode,
  setShowPaymentModal,
  rentDue,
  user,
  stripePromise
}) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
    <div className={`border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Glow effect */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

      <div className={`p-6 border-b flex justify-between items-center transition-colors duration-500 backdrop-blur-md ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white/50'}`}>
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Pay Rent</h3>
        <button onClick={() => setShowPaymentModal(false)} className={`transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
          <X size={20} />
        </button>
      </div>

      <div className="p-6">
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={rentDue}
            tenantId={user.id}
            propertyId={user.propertyId}
            tenantName={user.name}
            isDarkMode={isDarkMode}
          />
        </Elements>
      </div>

    </div>
  </div>
);

const ComplaintModal = ({
  isDarkMode,
  setShowComplaintModal,
  handleSubmitComplaint,
  handleImageChange,
  complaintImages,
  handleRemoveImage,
  isUploading,
  t
}) => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
    <div className={`border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

      <div className={`p-6 border-b flex justify-between items-center transition-colors duration-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
        <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>New Complaint</h3>
        <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Issue Title</label>
            <input required name="title" type="text" placeholder="e.g. Broken Lock" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'}`} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
            <select name="category" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>HVAC</option>
              <option>Appliance</option>
              <option>Pest Control</option>
              <option>Structural Issue</option>
              <option>Noise Complaint</option>
              <option>Security Concern</option>
              <option>General</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Priority Level</label>
          <select name="priority_level" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
          <textarea required name="description" rows="4" placeholder="Please describe the issue in detail..." className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all duration-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'}`}></textarea>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Upload Images</label>
          <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer hover:bg-opacity-50 mb-4 ${isDarkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-50'}`}>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" id="complaint-images" />
            <label htmlFor="complaint-images" className="cursor-pointer flex flex-col items-center gap-2">
              <Camera size={24} className="text-violet-500" />
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Click to upload photos
              </span>
            </label>
          </div>

          {/* Uploaded Images Grid */}
          {complaintImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {complaintImages.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden h-20 border border-slate-200 dark:border-slate-700">
                  <img src={url} alt="Proof" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowComplaintModal(false)}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Submit Complaint"}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

export default function RentEaseDashboard() {
  const { t, i18n } = useTranslation();
  const { userName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Derive active tab from path for backward compatibility with existing conditions
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const activeTab = currentPath;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // App State
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    propertyName: "",
    address: "",
    landlord: "",
    monthlyRent: 0,
    leaseStart: "",
    leaseEnd: "",
    familyMembers: 0,
    members: [], // List of residents
    propertiesCount: 0,
    rentDueDate: 0 // Initialize to 0 or appropriate default
  });
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const [rentDue, setRentDue] = useState(0);

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2); // Example unread count
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  // Property Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]); // Default empty
  const [dashboardNotifications, setDashboardNotifications] = useState([]); // Database Notifications
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    // 1. Immediate loading of basic user info from LocalStorage to avoid "Alice Cooper" flash
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(prev => ({
          ...prev,
          name: u.name || u.full_name || prev.name,
          email: u.email || prev.email
        }));

        // Verify URL matches user
        const correctSlug = (u.name || "").toLowerCase().replace(/\s+/g, '-');
        if (userName && correctSlug && userName !== correctSlug) {
          console.warn("URL username mismatch");
          // Optional: Redirect or Handle
        }
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }

    // 2. Fetch full dashboard data from Backend
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Fetch Dashboard Data
        const dashboardRes = await axios.get("http://localhost:5000/api/tenants/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = dashboardRes.data;

        setUser({
          name: data.tenant_name || data.full_name || "User",
          email: data.tenant_email || data.email || "No Email",
          phone: data.phone || "No Phone",
          propertyName: data.property_name,
          address: `${data.address}, ${data.city}, ${data.state} ${data.zip_code}`,
          landlord: data.landlord_name,
          monthlyRent: data.monthly_rent,
          leaseStart: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : "N/A",
          leaseEnd: "N/A", // Not in DB yet
          rentDueDate: data.rent_due_date, // Store rent due date
          familyMembers: data.members ? data.members.length : 0,
          members: data.members || [], // Store full list
          propertiesCount: 1, // Single property for now
          id: data.id, // Tenant ID
          propertyId: data.property_id // Property ID
        });

        // Set Real Images if available
        if (data.images && data.images.length > 0) {
          setPropertyImages(data.images);
        }

        // Also update Rent Due from backend - Robust Check
        setRentDue((data.payment_status && data.payment_status.toUpperCase() === 'PAID') ? 0 : data.monthly_rent);

        // Fetch Payments
        const paymentsRes = await axios.get("http://localhost:5000/api/tenants/payments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (paymentsRes.data.length > 0) {
          // Normalize DB data to match frontend expectations
          const formattedPayments = paymentsRes.data.map(p => ({
            ...p,
            date: p.payment_date, // Map payment_date -> date
            method: p.payment_gateway || 'Stripe' // Map payment_gateway -> method
          }));
          setPayments(formattedPayments);
        } else {
          // Sample Data if DB is empty
          setPayments([
            { id: 1, date: 'Jan 1, 2026', amount: 1200, status: 'Paid', method: 'Credit Card (**4242)' },
            { id: 2, date: 'Dec 1, 2025', amount: 1200, status: 'Paid', method: 'Bank Transfer' },
            { id: 3, date: 'Nov 1, 2025', amount: 1200, status: 'Paid', method: 'Credit Card (**4242)' },
            { id: 4, date: 'Oct 1, 2025', amount: 1200, status: 'Paid', method: 'Bank Transfer' },
          ]);
        }

        // Fetch Complaints
        const complaintsRes = await axios.get("http://localhost:5000/api/complaints/tenant", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaints(complaintsRes.data);

        // Fetch Notifications
        const notificationsRes = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Map backend notifications to UI format
        const mappedNotes = notificationsRes.data.map(n => ({
          id: n.id,
          title: n.title,
          desc: n.message,
          time: new Date(n.created_at).toLocaleString(),
          icon: n.type === 'RENT_REMINDER' ? Clock : Bell,
          color: n.type === 'RENT_REMINDER' ? 'text-amber-500' : 'text-violet-500',
          bg: n.type === 'RENT_REMINDER' ? 'bg-amber-500/10' : 'bg-violet-500/10',
          isRead: n.is_read
        }));
        setDashboardNotifications(mappedNotes);
        setUnreadCount(mappedNotes.filter(n => !n.isRead).length);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setNotification({
          type: 'error',
          message: "Failed to load data: " + (error.response?.data?.error || error.message)
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userName]); // Dependencies updated

  // Notification Helper
  const markNoteAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllNotesAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`http://localhost:5000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      setIsNotificationsOpen(false);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://localhost:5000/api/auth/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Password updated successfully");
      setShowChangePasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.error || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // --- Utility Components ---



  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const handlePayRent = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newPayment = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: rentDue, // Use the actual rent due amount
        status: "Paid",
        method: "Credit Card (**88)",
      };
      setPayments([newPayment, ...payments]);
      setRentDue(0); // Clear rent due
      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      showNotification("Payment successful! Thank you.");
    }, 1500);
  };

  const [complaintImages, setComplaintImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "First_project");
    fd.append("cloud_name", "dghdwtef5");

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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        uploadedUrls.push(url);
      }
      setComplaintImages(prev => [...prev, ...uploadedUrls]);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      showNotification("Image upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      // Submit Complaint to Backend
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:5000/api/complaints",
        {
          title: formData.get('title'),
          category: formData.get('category'),
          priority_level: formData.get('priority_level'),
          description: formData.get('description'),
          images: complaintImages // Use the already uploaded URLs
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh Complaints List
      const res = await axios.get("http://localhost:5000/api/complaints/tenant", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);

      setShowComplaintModal(false);
      setComplaintImages([]);
      toast.success("Complaint submitted successfully!");

    } catch (error) {
      console.error("Complaint submission error:", error);
      toast.error("Failed to submit complaint");
    }
  };

  /* --- RESOLVE CONFIRMATION MODAL --- */
  const ResolveConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <Card isDarkMode={isDarkMode} className="w-full max-w-sm p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-2 border-emerald-500/20">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Is the issue cleared?</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-[250px] mx-auto">Has the problem been fully resolved to your satisfaction?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={onClose} variant="secondary" className="justify-center" isDarkMode={isDarkMode}>No</Button>
            <Button onClick={onConfirm} className="bg-emerald-500 hover:bg-emerald-600 text-white justify-center border-none shadow-lg shadow-emerald-500/20">Yes, Resolved</Button>
          </div>
        </Card>
      </div>
    );
  };

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [complaintToResolve, setComplaintToResolve] = useState(null);

  const handleUpdateStatus = async (id, newStatus) => {
    if (newStatus === 'Resolved') {
      setComplaintToResolve(id);
      setIsResolveModalOpen(true);
      return;
    }

    if (newStatus === 'In Progress') {
      setComplaintToInProgress(id);
      setIsInProgressModalOpen(true);
      return;
    }

    // For other statuses, update immediately
    executeStatusUpdate(id, newStatus);
  };

  const confirmResolve = () => {
    if (complaintToResolve) {
      executeStatusUpdate(complaintToResolve, 'Resolved');
      setIsResolveModalOpen(false);
      setComplaintToResolve(null);
    }
  };

  /* --- IN PROGRESS CONFIRMATION MODAL --- */
  const InProgressConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <Card isDarkMode={isDarkMode} className="w-full max-w-sm p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-2 border-blue-500/20">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <Clock size={32} className="text-blue-500" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Is the work started?</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-[250px] mx-auto">Confirm that the work is currently in progress?</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={onClose} variant="secondary" className="justify-center" isDarkMode={isDarkMode}>No</Button>
            <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700 text-white justify-center border-none shadow-lg shadow-blue-500/20">Yes, In Progress</Button>
          </div>
        </Card>
      </div>
    );
  };

  const [isInProgressModalOpen, setIsInProgressModalOpen] = useState(false);
  const [complaintToInProgress, setComplaintToInProgress] = useState(null);

  const confirmInProgress = () => {
    if (complaintToInProgress) {
      executeStatusUpdate(complaintToInProgress, 'In Progress');
      setIsInProgressModalOpen(false);
      setComplaintToInProgress(null);
    }
  };


  const executeStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Complaint marked as ${newStatus}`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };



  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put("http://localhost:5000/api/tenants/profile", {
        full_name: user.name,
        email: user.email,
        phone: user.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile: " + (error.response?.data?.error || error.message));
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // --- Sub-Views ---

  const Dashboard = () => {
    const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;
    const isPaid = rentDue === 0;

    // Logic to determine Next Due Date
    const today = new Date();

    let nextDueDateDisplay = "Loading...";

    // Logic to calculate Next Due Date based on rent_due_date from DB
    if (user.rentDueDate) {
      const dbDueDate = new Date(user.rentDueDate);

      // If the DB date is valid
      if (!isNaN(dbDueDate.getTime())) {
        let calculatedDueDate = new Date(dbDueDate);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        // If the specific due date from DB is already in the future or today, use it directly
        // Otherwise, keep adding months until we find the next future date
        while (calculatedDueDate < todayDate) {
          calculatedDueDate.setMonth(calculatedDueDate.getMonth() + 1);
        }

        nextDueDateDisplay = calculatedDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } else {
        nextDueDateDisplay = "Invalid Date";
      }
    } else {
      nextDueDateDisplay = "N/A";
    }

    // Calculate Late Fee Date (Due Date + 2 Days)
    const lateFeeDateObj = new Date(today); // Initialize with today for now, will be updated if nextDueDateDisplay is valid
    if (nextDueDateDisplay !== "Loading..." && nextDueDateDisplay !== "N/A") {
      const nextDueDateParsed = new Date(nextDueDateDisplay);
      lateFeeDateObj.setTime(nextDueDateParsed.getTime());
      lateFeeDateObj.setDate(lateFeeDateObj.getDate() + 2);
    }
    const lateFeeDate = lateFeeDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


    return (
      <div className="space-y-8">
        {/* Header with Gradient Text & Notification Bell */}
        <div className="flex justify-between items-start">
          <div className="relative">
            {/* Glow effect behind title */}
            <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-500/5'}`}></div>

            <h2 className={`text-4xl font-bold tracking-tight transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{(user.name || "User").split(' ')[0]}</span> 👋
            </h2>
            <p className={`mt-2 text-lg transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Tenant Dashboard Overview
            </p>
          </div>

          {/* Notifications Section - Tiny Bell */}
          <div className="flex items-center gap-4">

            {/* Next Due Date Widget */}
            <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-xl transition-all duration-500 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200'}`}>
              <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Next Due Date</p>
              <div className="flex items-center gap-2">
                <Calendar size={14} className={isDarkMode ? 'text-violet-400' : 'text-violet-600'} />
                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{nextDueDateDisplay}</p>
              </div>
            </div>

            {/* Highlighted Notification - e.g. Overdue or Message */}
            {!isPaid && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium animate-pulse">
                <Clock size={14} />
                Rent Due Soon
              </div>
            )}


          </div>
        </div>

        {/* Upcoming Payment / Reminders Card (HIGH VALUE) */}
        {!isPaid && (
          <div className={`p-4 rounded-xl border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group
            ${isDarkMode ? 'bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border-violet-500/30' : 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200'}`}>

            {/* Decorative bg element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex items-center gap-4 z-10">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-violet-500/20 text-violet-300' : 'bg-white text-violet-600 shadow-sm'}`}>
                <Clock size={24} />
              </div>
              <div>
                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming Payment</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-1">
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Rent Due: <span className="font-semibold text-rose-500">{nextDueDateDisplay}</span></span>
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>•</span>
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Late Fee After: <span className="font-semibold text-amber-500">{lateFeeDate}</span></span>
                  <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>•</span>
                  <span className="text-emerald-500 flex items-center gap-1"><Check size={12} strokeWidth={3} /> Reminder: Enabled</span>
                </div>
              </div>
            </div>

            <Button onClick={() => setShowPaymentModal(true)} className="z-10 shadow-lg shadow-violet-500/20 whitespace-nowrap" icon={CreditCard}>
              Pay Now
            </Button>
          </div>
        )}


        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Rent Status Card */}
          <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
            <div>
              <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rent Status</p>
              <h3 className={`text-2xl font-bold transition-colors duration-500 ${isPaid ? 'text-emerald-400' : 'text-rose-400'} drop-shadow-sm`}>
                {isPaid ? 'Paid' : 'Unpaid'}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110
              ${isDarkMode
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 text-emerald-400 border-emerald-500/20'
                : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
              <DollarSign size={24} />
            </div>
          </Card>

          {/* Property Count Card */}
          <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
            <div>
              <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property</p>
              <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.propertiesCount}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110
              ${isDarkMode
                ? 'bg-gradient-to-br from-blue-500/20 to-blue-900/20 text-blue-400 border-blue-500/20'
                : 'bg-blue-100 text-blue-600 border-blue-200'}`}>
              <Home size={24} />
            </div>
          </Card>

          {/* Active Complaints Card */}
          <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
            <div>
              <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Complaints</p>
              <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeComplaintsCount}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110
              ${isDarkMode
                ? 'bg-gradient-to-br from-violet-500/20 to-violet-900/20 text-violet-400 border-violet-500/20'
                : 'bg-violet-100 text-violet-600 border-violet-200'}`}>
              <MessageSquare size={24} />
            </div>
          </Card>

          {/* Family Members Card */}
          <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
            <div>
              <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Family Members</p>
              <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.familyMembers}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 group-hover:scale-110
              ${isDarkMode
                ? 'bg-gradient-to-br from-pink-500/20 to-pink-900/20 text-pink-400 border-pink-500/20'
                : 'bg-pink-100 text-pink-600 border-pink-200'}`}>
              <Users size={24} />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* My Property Card */}
          <Card className="p-0 overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-shadow duration-500">
            <div className="relative h-80 overflow-hidden group">
              <img
                key={currentImageIndex} // Key added to trigger animation on index change
                src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
                alt="Property"
                className="w-full h-full object-cover animate-in fade-in group-hover:scale-105 transition-transform duration-1000"
              />
              <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${isDarkMode ? 'from-slate-900/90 to-transparent' : 'from-white/90 to-transparent'}`}></div>
              <div className="absolute bottom-4 left-4">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.propertyName}</h3>
                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{user.address}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-500/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">Occupied</span>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-3 rounded-lg border transition-colors duration-500 flex justify-between items-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className={`text-xs uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Landlord</p>
                    <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.landlord}</p>
                  </div>
                  <button onClick={() => navigate('my-property')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
                    <MessageSquare size={16} />
                  </button>
                </div>

                <div className={`p-3 rounded-lg border transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                  <p className={`text-xs uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Monthly Rent</p>
                  <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>${user.monthlyRent.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
              <Button variant="outline" className="w-full justify-center" onClick={() => navigate('my-property')}>
                View Property Details
              </Button>
            </div>
          </Card>

          {/* Right Column: Information Stack */}
          <div className="flex flex-col gap-8">

            {/* Payment History Preview (New Component) */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Payments</h3>
                <button onClick={() => navigate('payments')} className="text-violet-500 hover:text-violet-400 text-sm font-medium transition-colors">View All</button>
              </div>

              <div className="space-y-4">
                {payments.slice(0, 2).map((payment) => (
                  <div key={payment.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-500
                         ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>

                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                        <Check size={16} />
                      </div>
                      <div>
                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                          {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Rent Payment</p>
                      </div>
                    </div>

                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Complaints Section */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Complaints</h3>
                <button onClick={() => setActiveTab('complaints')} className="text-violet-500 hover:text-violet-400 text-sm font-medium transition-colors">View All</button>
              </div>
              <div className="grid gap-4">
                {complaints.slice(0, 2).map((req) => (
                  <Card key={req.id} className={`p-6 flex items-center justify-between cursor-pointer group hover:bg-opacity-80`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg transition-colors duration-500 border ${isDarkMode ? 'bg-slate-800 text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 border-slate-700' : 'bg-slate-100 text-slate-500 group-hover:text-violet-600 group-hover:bg-violet-50 border-slate-200'}`}>
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <p className={`font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-900 group-hover:text-violet-700'}`}>{req.title}</p>
                        <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{req.date}</p>
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </Card>
                ))}
              </div>
            </div>

          </div> {/* End Right Column */}

        </div>
      </div>
    );
  };

  const PaymentsView = () => {
    const downloadReceipt = (payment) => {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();

        // Header Background
        doc.setFillColor(243, 244, 246); // gray-100
        doc.rect(0, 0, 210, 40, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(17, 24, 39); // gray-900
        doc.text("Rent Receipt", 105, 25, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(107, 114, 128); // gray-500
        doc.text("Payment Confirmation", 105, 33, { align: "center" });

        // Amount Section
        doc.setFontSize(30);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(17, 24, 39);
        doc.text(`$${payment.amount.toLocaleString()}`, 105, 60, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor(22, 163, 74); // green-600
        doc.text("PAID SUCCESSFUL", 105, 70, { align: "center" });

        // Divider
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(40, 80, 170, 80);

        // Details
        let y = 100;
        const addRow = (label, value) => {
          doc.setFontSize(12);
          doc.setTextColor(107, 114, 128);
          doc.text(label, 40, y);
          doc.setTextColor(17, 24, 39);
          doc.setFont("helvetica", "bold");
          doc.text(value, 170, y, { align: "right" });
          y += 15;
        };

        addRow("Date", new Date(payment.date).toLocaleDateString());
        addRow("Transaction ID", payment.transaction_id || `TXN-${payment.id}`);
        addRow("Paid By", user.name || "Tenant");
        addRow("Payment Method", payment.method || "Stripe");
        addRow("Property", user.address || "Property Address");

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(156, 163, 175);
        doc.text("Powered by Stripe • RentEase Secure Payments", 105, 280, { align: "center" });

        doc.save(`Rent_Receipt_${payment.date}.pdf`);
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment History</h2>
          <Button variant="secondary" icon={Download}>Statement</Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b transition-colors duration-500`}>
                <tr>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date</th>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Description</th>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Method</th>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Amount</th>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Status</th>
                  <th className={`px-6 py-4 font-semibold transition-colors duration-500 text-center ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Receipt</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors duration-500 ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {payments.map((payment) => (
                  <tr key={payment.id} className={`transition-colors duration-200 ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                    <td className={`px-6 py-4 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className={`px-6 py-4 font-medium transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>Rent Payment</td>
                    <td className="px-6 py-4 text-slate-500">{payment.method}</td>
                    <td className={`px-6 py-4 font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={payment.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-violet-500/20 text-violet-400' : 'hover:bg-violet-50 text-violet-600'}`}
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const ComplaintsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaints</h2>
        <Button onClick={() => setShowComplaintModal(true)} icon={Plus}>New Complaint</Button>
      </div>

      <div className="grid gap-4">
        {complaints.length === 0 ? (
          <div className={`text-center py-12 rounded-xl border border-dashed transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
            <p className="text-slate-500">No complaints found.</p>
          </div>
        ) : (
          complaints.map((req) => (
            <Card key={req.id} onClick={() => navigate(`/${userName}/tenant/dashboard/complaints/${req.id}`)} className={`p-6 transition-all group hover:scale-[1.01] cursor-pointer`}>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg border transition-colors duration-500 ${req.status === 'Resolved' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-200') : (isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-100 text-amber-600 border-amber-200')} ${isDarkMode ? 'border-slate-700' : ''}`}>
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold transition-colors duration-500 ${isDarkMode ? 'text-white group-hover:text-violet-400' : 'text-slate-900 group-hover:text-violet-600'}`}>{req.title}</h3>
                    <p className="text-sm text-slate-500">{req.category} • Submitted on {req.date}</p>
                    <p className={`text-sm mt-2 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{req.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4">
                    <StatusBadge status={req.status} />
                    <div className={`p-2 rounded-full transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                      <ChevronRight size={20} className="text-slate-500" />
                    </div>
                  </div>
                  {req.status?.toLowerCase() !== 'resolved' && (
                    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                      {['open', 'in progress'].includes(req.status?.toLowerCase()) && (
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'In Progress')}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          In Progress
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'Resolved')}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );



  return (
    <div className={`min-h-screen flex font-sans selection:bg-violet-500/30 transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-right-10 fade-in duration-300">
          <div className={`border px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="bg-emerald-500/20 rounded-full p-1 border border-emerald-500/30">
              <Check size={14} className="text-emerald-400" />
            </div>
            <p className="font-medium text-sm">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 backdrop-blur-xl border-r transform transition-transform duration-500 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
        ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'}
      `}>
        <div className={`p-8 border-b flex items-center gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <img src="/favicon.png" alt="RentEase Logo" className="min-w-12 min-h-12 object-contain" />
          <span className={`text-2xl relative right-6 font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>RentEase</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          {[
            { id: 'dashboard', path: `/${userName}/tenant/dashboard`, icon: Home, label: 'Dashboard' },
            { id: 'my-property', path: `/${userName}/tenant/dashboard/my-property`, icon: Building, label: 'My Property' },
            { id: 'payments', path: `/${userName}/tenant/dashboard/payments`, icon: CreditCard, label: 'Payments' },
            { id: 'complaints', path: `/${userName}/tenant/dashboard/complaints`, icon: MessageSquare, label: 'Complaints' },
            { id: 'settings', path: `/${userName}/tenant/dashboard/settings`, icon: Settings, label: 'Settings' },
            { id: 'services', path: `/${userName}/tenant/dashboard/services`, icon: Wrench, label: 'Home Services' },
          ].map((item) => {
            const isActive = item.id === 'dashboard'
              ? (location.pathname === `/${userName}/tenant/dashboard` || location.pathname === `/${userName}/tenant/dashboard/`)
              : location.pathname.includes(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                    ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-500 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                    : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-900 hover:bg-slate-100 hover:text-black font-medium'}`}
                  `}
              >
                <item.icon size={20} className={isActive ? 'text-violet-500' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 border-t transition-colors duration-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 
                ${isDarkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-900 hover:text-black hover:bg-slate-100 font-medium'}
              `}
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Ambient Background Glows - Only visible in Dark Mode */}
        <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]"></div>
        </div>

        {/* Desktop Header - Positioned relative to content to push content down */}
        <header className="hidden md:flex w-full h-20 items-center justify-end px-8 z-20 shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className={`absolute top-12 right-0 w-80 rounded-xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>
                    )}
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {dashboardNotifications.length > 0 ? (
                      dashboardNotifications.map((note, i) => (
                        <div key={i} onClick={() => !note.isRead && markNoteAsRead(note.id)} className={`p-4 border-b last:border-0 flex gap-3 hover:bg-opacity-50 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'} ${!note.isRead ? (isDarkMode ? 'bg-violet-500/5' : 'bg-violet-50') : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${note.bg} ${note.color}`}>
                            <note.icon size={14} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{note.title}</p>
                              {!note.isRead && <span className="w-2 h-2 bg-violet-500 rounded-full mt-1"></span>}
                            </div>
                            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{note.desc}</p>
                            <p className="text-[10px] text-slate-500 mt-1.5">{note.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className={`p-2 text-center border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                    <button
                      onClick={markAllNotesAsRead}
                      className="text-xs font-medium text-violet-500 hover:text-violet-600 w-full py-1"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <ThemeToggle />
            <div className={`h-8 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            <div className="relative">
              <div
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name || "User"}</p>
                  <p className="text-[10px] lowercase font-bold text-slate-500">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black shadow-lg">
                  {(user.name || "U").charAt(0)}
                </div>
              </div>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className={`absolute top-14 right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 md:hidden z-10 sticky top-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <Menu size={24} />
            </button>
            <h1 className={`text-lg font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeTab.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Keyed Content for View Transitions */}
            {/* Keyed Content for View Transitions */}
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Navigate to={`/${userName}/tenant/dashboard`} replace />} />
                <Route path="payments" element={<PaymentsView />} />
                <Route path="complaints" element={<ComplaintsView />} />
                <Route path="complaints/:id" element={<ComplaintDetail
                  complaints={complaints}
                  isLoading={isLoading}
                  isDarkMode={isDarkMode}
                  navigate={navigate}
                  userName={userName}
                  handleUpdateStatus={handleUpdateStatus}
                />} />
                <Route path="settings" element={<SettingsView
                  user={user}
                  setUser={setUser}
                  isDarkMode={isDarkMode}
                  setShowChangePasswordModal={setShowChangePasswordModal}
                  handleUpdateProfile={handleUpdateProfile}
                  isUpdatingProfile={isUpdatingProfile}
                  t={t}
                  i18n={i18n}
                />} />
                <Route path="my-property" element={<MyPropertyView
                  isDarkMode={isDarkMode}
                  user={user}
                  propertyImages={propertyImages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  prevImage={prevImage}
                  nextImage={nextImage}
                />} />
                <Route path="services" element={<TenantHomeServices />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Portals */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isDarkMode={isDarkMode}
          setShowChangePasswordModal={setShowChangePasswordModal}
          handlePasswordUpdate={handlePasswordUpdate}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          isUpdatingPassword={isUpdatingPassword}
          t={t}
        />
      )}
      {showPaymentModal && (
        <PaymentModal
          isDarkMode={isDarkMode}
          setShowPaymentModal={setShowPaymentModal}
          rentDue={rentDue}
          user={user}
          stripePromise={stripePromise}
        />
      )}
      {showComplaintModal && (
        <ComplaintModal
          isDarkMode={isDarkMode}
          setShowComplaintModal={setShowComplaintModal}
          handleSubmitComplaint={handleSubmitComplaint}
          handleImageChange={handleImageChange}
          complaintImages={complaintImages}
          handleRemoveImage={handleRemoveImage}
          isUploading={isUploading}
          t={t}
        />
      )}

      <ResolveConfirmationModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirm={confirmResolve}
        isDarkMode={isDarkMode}
      />

      <InProgressConfirmationModal
        isOpen={isInProgressModalOpen}
        onClose={() => setIsInProgressModalOpen(false)}
        onConfirm={confirmInProgress}
        isDarkMode={isDarkMode}
      />

    </div >
  );
}