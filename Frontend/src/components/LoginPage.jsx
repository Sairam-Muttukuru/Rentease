import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login: setAuthUser, user } = useAuth();
  // State for form fields & Theme
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();


  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      if (role === 'landlord') {
        navigate('/landlord/dashboard', { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'service_provider') {
        navigate('/service-provider/dashboard', { replace: true });
      } else if (role === 'tenant') {
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);




  // Mock login handler
  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // Simulate API call
  //   setTimeout(() => setIsLoading(false), 1500);
  // };




  const decodeJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return error;
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Dynamic API URL Resolution
      const BASE_URL = import.meta.env.VITE_API_URL || 
                      (window.location.hostname === 'localhost' 
                        ? 'http://localhost:5000' 
                        : 'https://rentease-1-pwm5.onrender.com');

      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          email,
          password
        },
        {
          withCredentials: true // refresh token cookie
        }
      );

      const { accessToken, user } = response.data;

      if (!accessToken) {
        throw new Error("Access token missing");
      }

      // store token & user info
      // role-based redirect
      setAuthUser(user, accessToken); // Update context (this handles localStorage too) heart
      toast.success("Login successful!");
      // Navigation is now handled by the useEffect above
    } catch (error) {
      console.error("Login error:", error.message || "Login failed");
      toast.error(error.response?.data?.error || error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };


  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen w-full flex font-sans selection:bg-indigo-500/30 transition-colors duration-500 ${isDark ? 'bg-[#020617] text-slate-50' : 'bg-white text-slate-900'}`}>

      {/* --- Left Side: Visual Panel (Always Dark/Brand Color) --- */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-indigo-950">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#0f172a] to-[#020617] opacity-90"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* Glowing Orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12">
          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium">
            <CheckCircle2 size={16} />
            <span>Secure Rental Platform</span>
          </div>

          <h2 className="text-5xl font-bold mb-6 leading-tight tracking-tight text-white">
            Welcome back to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              RentEase
            </span>
          </h2>

          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Manage your properties, track payments, and handle maintenance requests from one secure dashboard.
          </p>

          {/* Feature Cards removed */}
        </div>
      </div>

      {/* --- Right Side: Login Form --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative transition-colors duration-500">

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute top-6 right-6 flex items-center rounded-full border backdrop-blur-xl shadow-xl transition-all duration-500 ease-out
    ${isDark ? "bg-[#0b1220]/80 border-slate-700" : "bg-white/80 border-slate-200"}
    w-16 h-8 px-1
  `}
          title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
          <div
            className={`
      w-6 h-6 rounded-full flex items-center justify-center shadow-md
      transition-all duration-500 ease-out transform
      ${isDark
                ? "translate-x-7 bg-indigo-500 text-indigo-100"
                : "translate-x-0 bg-slate-200 text-amber-400"
              }
    `}
          >
            {isDark ? <Moon size={14} /> : <Sun size={14} />}
          </div>
        </button>



        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Sign In</h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Don't have an account?{' '}
              <a onClick={() => navigate("/signup")} className="text-indigo-500 font-semibold hover:text-indigo-400 hover:cursor-pointer hover:underline transition-colors">
                Create an account
              </a>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>

            {/* Email Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3.5 rounded-xl border transition-all outline-none ${isDark
                    ? 'bg-[#0f172a] border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:bg-[#1e293b]/50'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                    }`}
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className={`block text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Password</label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-medium text-indigo-500 hover:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-11 pr-12 py-3.5 rounded-xl border transition-all outline-none ${isDark
                    ? 'bg-[#0f172a] border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:bg-[#1e293b]/50'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                    }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] hover:shadow-lg hover:shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>


        </div>

        {/* Footer Links */}
        <div className="mt-10 text-center">
          <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition-colors mr-4">Privacy Policy</a>
          <a href="#" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">Terms of Service</a>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;