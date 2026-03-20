import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound404 = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans antialiased bg-[#020617] text-slate-50 relative overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 right-0 w-80 h-80 bg-purple-600/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 bg-indigo-600/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500/25 rounded-full scale-110 blur-xl"></div>
            <div className="relative animate-pulse">
              <Search size={128} className="text-purple-300 stroke-[1.5] drop-shadow-[0_0_25px_rgba(192,132,252,0.7)]" />
            </div>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-9xl font-extrabold text-slate-900/10 mb-2 leading-none select-none tracking-tight">
            404
          </h1>
          <div className="relative -mt-16">
            <h2 className="text-3xl font-bold text-slate-50 mb-4">Page not found</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-md mx-auto">
              We couldn't find the page you're looking for. It may have been moved, deleted,
              or the URL might be typed incorrectly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/"
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-200 flex items-center gap-2 group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            Back to Home
          </a>
          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-transparent border border-slate-700/70 hover:border-slate-500/80 text-slate-200 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800/70">
          <p className="text-sm text-slate-500">
            If you believe this is an error, please check the URL or return to the dashboard.
          </p>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500"></div>
    </div>
  );
};

export default NotFound404;
