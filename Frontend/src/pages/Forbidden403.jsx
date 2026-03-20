import React from 'react';
import { Key, Home, ArrowLeft, LifeBuoy, LogIn, HelpCircle } from 'lucide-react';

const Forbidden403 = () => {
  // Navigation handler
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans antialiased bg-[#020617] text-slate-50 relative overflow-hidden">

      {/* CSS for the floating key animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .key-animation {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-32 -left-24 w-80 h-80 bg-indigo-600/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-32 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">

        {/* Icon/Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Circular Backdrop */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full scale-110 blur-xl"></div>

            {/* Lucide Key Icon with custom animation */}
            <div className="relative key-animation">
              <Key size={128} className="text-indigo-400 stroke-[1.5] drop-shadow-[0_0_25px_rgba(129,140,248,0.7)]" />

            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="relative">
          <h1 className="text-9xl font-extrabold text-slate-900/10 mb-2 leading-none select-none tracking-tight">

            403
          </h1>
          <div className="relative -mt-16">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Access denied</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
              You don't have permission to view this area of <span className="font-semibold text-indigo-400">RentEase</span>.
              Try returning to your dashboard or switching to an account with the right access.

            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2 group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            Back to dashboard
          </a>
          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-transparent border border-slate-700/70 hover:border-slate-500/80 text-slate-200 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back

          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-slate-800/70">
          <p className="text-sm text-slate-500 mb-4">Think this is a mistake? Let us know.</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
            <a href="/support" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">

              <LifeBuoy size={16} />
              Contact Support
            </a>
            <a href="/login" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">

              <LogIn size={16} />
              Sign In
            </a>
            <a href="/help" className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">

              <HelpCircle size={16} />
              Help Center
            </a>
          </div>
        </div>
      </div>

      {/* Decorative Top Border */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500"></div>

    </div>
  );
};

export default Forbidden403;