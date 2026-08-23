import React from "react";
const logo = "/favicon.png";

const Footer = () => (
  <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <img src={logo} alt="RentEase Logo" className="h-16 w-17 rounded-3xl shadow-lg" />
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter relative right-8">RentEase</span>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm">© 2025 RentEase Platform. Built for excellence.</p>
      <div className="flex gap-6">
        <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><code className="text-xs">GitHub</code></a>
        <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><code className="text-xs">Twitter</code></a>
      </div>
    </div>
  </footer>
);

export default Footer;
