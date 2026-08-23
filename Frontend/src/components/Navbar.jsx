import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ChevronDown, Bookmark, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Added missing import heart
const logo = "/favicon.png";
import RevealOnScroll from "../components/RevealOnScroll";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 focus:outline-none shadow-inner border ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-300"
      }`}
  >
    <div
      className={`w-5 h-5 rounded-full shadow-md transform transition-all duration-500 flex items-center justify-center ${theme === "dark" ? "translate-x-7 bg-slate-900" : "translate-x-0 bg-white"
        }`}
    >
      {theme === "dark" ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-orange-500" />}
    </div>
  </button>
);

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Who It's For", href: "#who-its-for" },
  { label: "Tech Stack", href: "#tech-stack" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); // Use centralized auth heart
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handleDashboardClick = () => {
    if (!user) return;

    const role = (user.role || "").toLowerCase();
    let dashboardPath = "/tenant/dashboard";

    if (role === "landlord") {
      dashboardPath = "/landlord/dashboard";
    } else if (role === "tenant") {
      dashboardPath = "/tenant/dashboard";
    } else if (role === "admin") {
      dashboardPath = "/admin/dashboard";
    } else if (role === "service_provider") {
      dashboardPath = "/service-provider/dashboard";
    }

    navigate(dashboardPath);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-[1001]">
      <RevealOnScroll delay={80} duration={520} distance={-18} threshold={0.01} className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`flex h-16 items-center justify-between rounded-2xl border backdrop-blur-xl px-4 md:px-6 transition-all duration-300 ${scrolled
              ? "bg-white/90 dark:bg-slate-900/90 shadow-xl border-slate-200/80 dark:border-slate-700"
              : "bg-white/70 dark:bg-slate-900/70 shadow-md border-slate-200/60 dark:border-slate-700/60"
              }`}
          >
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
              <img src={logo} alt="RentEase Logo" className="h-14 w-17 rounded-lg" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white relative right-5">RentEase</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}

              <button
                onClick={() => navigate('/home-services')}
                className="text-sm font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              >
                Home Services
              </button>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
              
              {user && user.role === 'TENANT' && (
                <button
                    onClick={() => {
                        const slug = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user';
                        navigate(`/${slug}/tenant/dashboard/services`, { state: { view: 'MY_BOOKINGS' } });
                    }}
                    className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors relative group"
                    title="My Booked Services"
                >
                    <ShoppingBag size={22} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
                </button>
              )}

              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

              <div className="flex gap-3 pl-2">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 font-medium"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                      <span className="hidden lg:block">{user.name && user.name.split(' ')[0]}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Signed in as</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        {user.role === 'LANDLORD' ? (
                          <>
                            <button
                              onClick={() => {
                                const slug = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user';
                                navigate(`/${slug}/landlord/dashboard`);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <LayoutDashboard size={16} /> Landlord Dashboard
                            </button>
                            <button
                              onClick={() => {
                                const slug = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user';
                                navigate(`/${slug}/tenant/dashboard`);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <User size={16} /> Tenant Dashboard
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={handleDashboardClick}
                              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <LayoutDashboard size={16} /> Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    const slug = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user';
                                    navigate(`/${slug}/tenant/dashboard/watchlist`);
                                    setIsDropdownOpen(false);
                                }}
                                className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                <Bookmark size={16} /> My Watchlist
                            </button>
                          </>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-700 dark:text-slate-200"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      {/* Mobile Nav Dropdown (animated scale & fade) */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 origin-top ${isMenuOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="p-6 space-y-4 flex flex-col">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800"
            >
              {item.label}
            </a>
          ))}

          <button
            onClick={() => { setIsMenuOpen(false); navigate('/home-services'); }}
            className="text-lg font-bold text-blue-600 dark:text-blue-400 py-2 border-b border-slate-100 dark:border-slate-800 text-left"
          >
            Home Services
          </button>

          {user ? (
            <>
              <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Account</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{user.name}</p>
              </div>
              <button
                onClick={handleDashboardClick}
                className="w-full py-3 text-slate-700 dark:text-slate-200 font-semibold bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                    const slug = user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user';
                    navigate(`/${slug}/tenant/dashboard/watchlist`);
                    setIsMenuOpen(false);
                }}
                className="w-full py-3 text-violet-600 dark:text-violet-400 font-bold bg-violet-600/10 rounded-xl flex items-center justify-center gap-2"
              >
                <Bookmark size={18} /> My Watchlist
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 text-white bg-rose-500 rounded-xl font-semibold shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/signup");
              }}
              className="w-full py-3 text-white bg-indigo-600 rounded-xl font-semibold shadow-lg mt-4"
            >
              Get Started Now
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
