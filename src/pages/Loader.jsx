import React, { useState, useEffect } from 'react';
import { Building2, Home, User, CreditCard, ShieldCheck, Zap, Bell, Search, LayoutDashboard, Settings } from 'lucide-react';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  const loadingStatuses = [
    "Connecting to RentEase Cloud...",
    "Securing your tenant profile...",
    "Fetching latest lease data...",
    "Optimizing your dashboard...",
    "Finalizing secure access..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setTimeout(() => setLoadingComplete(true), 800);
          return 100;
        }
        const diff = Math.random() * 12;
        return Math.min(oldProgress + diff, 100);
      });
    }, 350);

    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % loadingStatuses.length);
    }, 1500);

    return () => {
      clearInterval(timer);
      clearInterval(statusTimer);
    };
  }, []);

  // RentEase Themed Dashboard Mockup
  if (loadingComplete) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans animate-in fade-in duration-1000">
        {/* RentEase Navigation Bar */}
        <header className="sticky top-4 mx-auto w-[95%] bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl h-16 px-6 flex items-center justify-between shadow-sm z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D2B55] rounded-lg flex items-center justify-center text-white">
              <div className="relative border-2 border-white/80 w-5 h-5 rounded-sm flex items-center justify-center">
                <div className="absolute top-[-2px] w-3 h-1.5 bg-[#2D2B55] flex items-center justify-center">
                  <div className="w-full h-[1px] bg-white transform -rotate-45 translate-y-[2px]"></div>
                </div>
                <span className="text-[8px] font-bold">RE</span>
              </div>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">RentEase</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <span className="text-blue-600 border-b-2 border-blue-600 py-1">Dashboard</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">My Properties</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Payments</span>
            <span className="hover:text-slate-900 cursor-pointer transition-colors">Maintenance</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
              <Bell size={20} />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                AC
              </div>
              <span className="text-sm font-semibold text-slate-700 hidden sm:inline">Alice Cooper</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto w-full p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back, Alice</h1>
            <p className="text-slate-500">Rental Management <span className="text-blue-600 font-semibold italic">Reimagined</span>.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Active Leases', val: '1', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Monthly Rent', val: '$1,250', icon: CreditCard, color: 'bg-blue-50 text-blue-600' },
              { label: 'Pending Requests', val: '2', icon: Zap, color: 'bg-amber-50 text-amber-600' },
              { label: 'Due Date', val: 'Feb 21', icon: Bell, color: 'bg-indigo-50 text-indigo-600' }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#2D2B55] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Upcoming Payment</h2>
              <p className="text-indigo-100 max-w-md mb-6">Your payment for "Skyline Apartments - Unit 402" is scheduled for February 21st.</p>
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/30">
                Pay Now
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // RentEase themed Loader
  return (
    <div className="min-h-screen bg-[#0A0A14] flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Background ambient glows matching the "Reimagined" color palette */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Brand Identity Section */}
        <div className="flex items-center gap-3 mb-16 animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#2D2B55] shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <div className="relative border-[2.5px] border-[#2D2B55] w-7 h-7 rounded-md flex items-center justify-center">
              <div className="absolute top-[-3px] w-4 h-2 bg-white flex items-center justify-center">
                <div className="w-full h-[1.5px] bg-[#2D2B55] transform -rotate-45 translate-y-[2.5px]"></div>
              </div>
              <span className="text-[10px] font-black">RE</span>
            </div>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">RentEase</span>
        </div>

        {/* Realistic 3D-effect Loader */}
        <div className="relative w-56 h-56 mb-16 flex items-center justify-center">
          {/* Outer Glass Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm"></div>
          
          {/* Spinning Gradient Border */}
          <div 
            className="absolute inset-0 rounded-full border-[3px] border-transparent transition-all duration-300"
            style={{ 
              background: `conic-gradient(from 0deg, transparent 0%, #3B82F6 50%, #818CF8 100%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
              transform: `rotate(${progress * 3.6}deg)`
            }}
          ></div>

          {/* Central Pulsing Icon */}
          <div className="relative w-28 h-28 bg-gradient-to-br from-[#1E1B4B] to-[#0A0A14] rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
            <Home className="text-blue-400 relative z-10 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" size={44} strokeWidth={1.5} />
          </div>

          {/* Floating Data Particles */}
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full blur-[1px]"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translate(90px)`,
                opacity: 0.3 + (Math.random() * 0.5),
                animation: 'orbit 4s linear infinite',
                animationDelay: `${i * 0.5}s`
              }}
            ></div>
          ))}
        </div>

        {/* Progress & Text */}
        <div className="text-center w-72">
          <p className="text-blue-400 text-sm font-bold uppercase tracking-[0.2em] mb-2">
            Loading Experience
          </p>
          <div className="h-6 flex items-center justify-center">
             <p className="text-slate-400 text-xs animate-pulse">
              {loadingStatuses[statusIndex]}
            </p>
          </div>

          <div className="mt-8 relative h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 w-full h-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Secure Connection
            </span>
            <span className="text-white tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translate(90px) rotate(0deg); }
          to { transform: rotate(360deg) translate(90px) rotate(-360deg); }
        }
        .animate-in {
          animation: fadeIn 1s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Loader;