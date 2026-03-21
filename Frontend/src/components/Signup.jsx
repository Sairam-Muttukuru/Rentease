
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

import {
  Mail, Lock, User, ArrowRight, Home, Key,
  Sun, Moon, ShieldCheck, Building
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- Shared Toggle Component ---
const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className={`
      relative w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-500 focus:outline-none shadow-inner border z-50 cursor-pointer
      ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'}
    `}
  >
    <div
      className={`
        w-5 h-5 rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center
        ${theme === 'dark' ? 'translate-x-7 bg-slate-900' : 'translate-x-0 bg-white'}
      `}
    >
      {theme === 'dark' ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-orange-500" />}
    </div>
  </button>
);

const Signup = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState('tenant');

  // --- THEME HELPERS (Force colors to avoid CSS conflicts) ---
  const isDark = theme === 'dark';
  const bgRight = isDark ? '#020617' : '#ffffff';

  // Text Colors
  const textMain = isDark ? 'text-white' : 'text-slate-900';
  const textSub = isDark ? 'text-slate-400' : 'text-slate-500';

  // Input Styles
  const inputBg = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const inputBorder = isDark ? 'border-slate-700' : 'border-slate-300';
  const inputText = isDark ? 'text-white' : 'text-slate-900';

  // Left Panel Background
  const leftPanelBg = isDark ? 'bg-indigo-950' : 'bg-indigo-600';

  // Role Selector Styles
  const getRoleCardClass = (role) => {
    const isSelected = selectedRole === role;
    const baseClass = "cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2";

    if (isSelected) {
      return `${baseClass} ${isDark ? 'border-indigo-500 bg-indigo-900/20' : 'border-indigo-600 bg-indigo-50'}`;
    }
    return `${baseClass} ${isDark ? 'border-slate-700 hover:border-indigo-500' : 'border-slate-200 hover:border-indigo-300'}`;
  };

  const getRoleIconColor = (role) => {
    const isSelected = selectedRole === role;
    if (isSelected) return isDark ? 'text-indigo-400' : 'text-indigo-600';
    return 'text-slate-400';
  };


  /* 🔥 FORM STATE */
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [loading, setLoading] = useState(false);

  /* 🔥 SUBMIT HANDLER */
  const handleSignup = async (e) => {
    e.preventDefault();
    // setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`,
        {
          firstName,
          lastName,
          email,
          password,
          role: selectedRole.toUpperCase() // 🔥 VERY IMPORTANT uppercase for DB constraint
        },
        { withCredentials: true }
      );
      // alert("Signup successful! Please login.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      toast.success("Signup successful! Please login.");

    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    }
    // } finally {
    //   setLoading(false);
    // }
  };


  return (
    <div className="min-h-screen w-full flex transition-colors duration-500 font-sans">

      {/* --- Left Side: Visual Panel --- */}
      <div className={`hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center transition-colors duration-500 ${leftPanelBg}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-indigo-900 to-slate-900' : 'from-indigo-600 to-purple-700'} opacity-90 transition-colors duration-500`}></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 text-white max-w-lg px-12">
          <a href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Home size={24} className="text-white" /></div>
            <span className="font-bold text-xl">RentEase</span>
          </a>
          <h2 className="text-5xl font-bold mb-6 leading-tight">Join the Future of <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300">Rental Management</span></h2>

          <div className="space-y-6 mt-12">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
              <div className="bg-blue-500/20 p-3 rounded-lg"><ShieldCheck size={24} className="text-blue-200" /></div>
              <div>
                <h3 className="font-bold">Secure & Verified</h3>
                <p className="text-sm text-indigo-100 opacity-80">Bank-grade encryption for all your data.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
              <div className="bg-pink-500/20 p-3 rounded-lg"><Building size={24} className="text-pink-200" /></div>
              <div>
                <h3 className="font-bold">All-in-One Platform</h3>
                <p className="text-sm text-indigo-100 opacity-80">Payments, maintenance, and agreements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Right Side: Signup Form --- */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative overflow-y-auto transition-colors duration-500"
        style={{ backgroundColor: bgRight }}
      >

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-50">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="w-full max-w-md pt-10 lg:pt-0 animate-fade-in-up">
          <div className="mb-8 text-center lg:text-left">
            <h2 className={`text-3xl font-bold mb-2 transition-colors duration-500 ${textMain}`}>Create Account</h2>
            <p className={`transition-colors duration-500 ${textSub}`}>
              Already have an account? <a href="/login" className="text-indigo-600 font-semibold hover:underline">Log in</a>
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-3 transition-colors duration-500 ${textMain}`}>I am a...</label>
            <div className="grid grid-cols-3 gap-4">
              {/* Tenant */}
              <div onClick={() => setSelectedRole('tenant')} className={getRoleCardClass('tenant')}>
                <User className={getRoleIconColor('tenant')} />
                <span className={`font-bold ${selectedRole === 'tenant' ? (isDark ? 'text-indigo-300' : 'text-indigo-700') : 'text-slate-500'}`}>TENANT</span>
              </div>

              {/* Landlord */}
              <div onClick={() => setSelectedRole('landlord')} className={getRoleCardClass('landlord')}>
                <Key className={getRoleIconColor('landlord')} />
                <span className={`font-bold ${selectedRole === 'landlord' ? (isDark ? 'text-indigo-300' : 'text-indigo-700') : 'text-slate-500'}`}>LANDLORD</span>
              </div>

              {/* Admin */}
              <div onClick={() => setSelectedRole('admin')} className={getRoleCardClass('admin')}>
                <ShieldCheck className={getRoleIconColor('admin')} />
                <span className={`font-bold ${selectedRole === 'admin' ? (isDark ? 'text-indigo-300' : 'text-indigo-700') : 'text-slate-500'}`}>ADMIN</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${textMain}`}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 ${inputBg} ${inputBorder} ${inputText}`}
                  placeholder="John"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${textMain}`}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 ${inputBg} ${inputBorder} ${inputText}`}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textMain}`}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 ${inputBg} ${inputBorder} ${inputText}`}
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${textMain}`}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400 ${inputBg} ${inputBorder} ${inputText}`}
                  placeholder="Create a strong password"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 ml-1">Must be at least 8 characters long</p>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/20 flex items-center justify-center gap-2 mt-6">
              Create Account <ArrowRight size={20} />
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              By signing up, you agree to our <a href="#" className="underline hover:text-indigo-600">Terms</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;