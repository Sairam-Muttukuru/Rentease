import React, { useState, useEffect, useRef } from 'react';

import {

  Search,

  MapPin,

  Bed,

  Bath,

  Maximize,

  Heart,

  Filter,

  ChevronDown,

  Menu,

  X,

  Home,

  ArrowRight,

  ChevronLeft,

  ChevronRight,

  Compass,

  Car,

  Calendar,

  Sofa,

  Plus,

  Mail,

  Lock,

  Star,

  CheckCircle2,

  Zap,

  Sun,

  Moon,

  MessageSquare,

  Send,

  Phone,

  Share2,

  Image as ImageIcon,

  Grid,

  Shield,

  Wifi,

  Coffee,

  ArrowUpRight,

  Sparkles,

  Utensils,

  Dumbbell,

  Tv,

  Bell,

  BookOpen,

  Activity,

  Train,

  ShoppingBag

} from 'lucide-react';

import logo from "/favicon.png";

import RevealOnScroll from '../components/RevealOnScroll';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import FreeMap from '../components/common/FreeMap';

// --- Global Styles for Animation ---

const GlobalStyles = () => (

  <style>{`

    @keyframes fadeInUp {

      from { opacity: 0; transform: translateY(30px); }

      to { opacity: 1; transform: translateY(0); }

    }

    @keyframes scaleIn {

      from { opacity: 0; transform: scale(0.95); }

      to { opacity: 1; transform: scale(1); }

    }

    @keyframes float {

      0% { transform: translateY(0px); }

      50% { transform: translateY(-10px); }

      100% { transform: translateY(0px); }

    }

    .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

    .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }

    .animate-float { animation: float 6s ease-in-out infinite; }

    .delay-100 { animation-delay: 0.1s; }

    .delay-200 { animation-delay: 0.2s; }

    .delay-300 { animation-delay: 0.3s; }

    .delay-400 { animation-delay: 0.4s; }

    .delay-500 { animation-delay: 0.5s; }

   

    .no-scrollbar::-webkit-scrollbar { display: none; }

    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

   

    .glass-card {

      background: rgba(255, 255, 255, 0.7);

      backdrop-filter: blur(20px);

      -webkit-backdrop-filter: blur(20px);

      border: 1px solid rgba(255, 255, 255, 0.3);

    }

    .dark .glass-card {

      background: rgba(17, 17, 17, 0.7);

      border: 1px solid rgba(255, 255, 255, 0.05);

    }

  `}</style>

);



// --- Mock Data ---

const generateImages = (base) => {

  return [

    base,

    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600566752355-35792bedcfe1?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&q=80&w=1000",

    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000"

  ];

};



const MOCK_PROPERTIES = [

  {

    id: 1,

    title: "Neon Horizon Apartments",

    location: "Downtown, Metro City",

    price: 2400,

    beds: 2,

    baths: 2,

    sqft: 1100,

    type: "Apartment",

    images: generateImages("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000"),

    featured: true,

    rating: 4.8,

    tags: ["Smart Home", "Gym"],

    details: { facing: "North-East", parking: "Covered", furnishing: "Furnished", year: 2023 },

    landlord: { name: "Elena R.", online: true, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", rating: 4.9, responseTime: "1 hr" }

  },

  {

    id: 2,

    title: "Starlight Penthouse",

    location: "Uptown, Metro City",

    price: 4500,

    beds: 3,

    baths: 3,

    sqft: 2200,

    type: "Penthouse",

    images: generateImages("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000"),

    featured: true,

    rating: 5.0,

    tags: ["Pool", "View"],

    details: { facing: "South", parking: "2 Spots", furnishing: "Luxury", year: 2024 },

    landlord: { name: "Marcus T.", online: false, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", rating: 4.7, responseTime: "5 hrs" }

  },

  {

    id: 3,

    title: "Cyber Loft 2077",

    location: "Tech District, Metro City",

    price: 1800,

    beds: 1,

    baths: 1,

    sqft: 850,

    type: "Loft",

    images: generateImages("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000"),

    featured: false,

    rating: 4.5,

    tags: ["Workspace", "Fiber Net"],

    details: { facing: "West", parking: "Street", furnishing: "Semi", year: 2020 },

    landlord: { name: "Sarah J.", online: true, avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d", rating: 4.8, responseTime: "10 mins" }

  },

  {

    id: 4,

    title: "Velvet Hills Villa",

    location: "Suburbs, Metro City",

    price: 3200,

    beds: 4,

    baths: 3,

    sqft: 2800,

    type: "House",

    images: generateImages("https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&q=80&w=1000"),

    featured: false,

    rating: 4.7,

    tags: ["Garden", "Garage"],

    details: { facing: "East", parking: "Garage", furnishing: "Unfurnished", year: 2019 },

    landlord: { name: "David K.", online: true, avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d", rating: 4.6, responseTime: "2 hrs" }

  },

  {

    id: 5,

    title: "The Obsidian Studio",

    location: "Arts District, Metro City",

    price: 1500,

    beds: 1,

    baths: 1,

    sqft: 600,

    type: "Studio",

    images: generateImages("https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000"),

    featured: false,

    rating: 4.2,

    tags: ["Pet Friendly"],

    details: { facing: "North", parking: "None", furnishing: "Furnished", year: 2021 },

    landlord: { name: "Alex M.", online: false, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b", rating: 4.3, responseTime: "1 day" }

  },

  {

    id: 6,

    title: "Sapphire Lake Condo",

    location: "Waterfront, Metro City",

    price: 2900,

    beds: 2,

    baths: 2,

    sqft: 1300,

    type: "Condo",

    images: generateImages("https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1000"),

    featured: true,

    rating: 4.9,

    tags: ["Waterfront", "Balcony"],

    details: { facing: "South-East", parking: "Valet", furnishing: "Luxury", year: 2022 },

    landlord: { name: "Jessica P.", online: true, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a", rating: 5.0, responseTime: "30 mins" }

  },

];



// --- Sub-Components ---

const ThemeToggle = ({ isDark, toggle }) => (

  <button

    onClick={toggle}

    className="relative w-14 h-8 rounded-full bg-gray-200 dark:bg-white/10 p-1 transition-colors duration-300 focus:outline-none shadow-inner"

  >

    <div className={`absolute top-1 bottom-1 w-6 h-6 rounded-full bg-white dark:bg-violet-500 shadow-md transform transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-6' : 'translate-x-0'}`}>

      {isDark ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-yellow-500" />}

    </div>

  </button>

);



const Navbar = ({ onNavigate, currentView, isDark, toggleTheme, user, onLogout, onSearch }) => {

  const [isOpen, setIsOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);



  const isLoggedIn = !!user;

  const userRole = user?.role?.toLowerCase();



  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  const baseItems = [

    { id: 'browse', label: 'Explore Rentals' },

  ];



  const landlordItems = [

    { id: 'list', label: 'List Property' },

    { id: 'dashboard', label: 'Landlord Dashboard' },

  ];



  const tenantItems = [

    { id: 'dashboard', label: 'Tenant Dashboard' },

  ];



  const navItems = isLoggedIn

    ? (userRole === 'landlord' ? [...baseItems, ...landlordItems] : [...baseItems, ...tenantItems])

    : [

      { id: 'browse', label: 'Explore Rentals' },

      { id: 'list', label: 'List Property' }

    ];



  return (

    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled

      ? 'bg-white/90 dark:bg-[#030303]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-3 shadow-lg'

      : 'bg-black/20 backdrop-blur-sm border-b border-white/10 py-4'

      }`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-12">

          {/* Logo */}

          <div onClick={() => onNavigate('browse')} className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">

            <div className="relative">

              <img src={logo} className='h-14 w-18 rounded-lg' alt="logo" />

            </div>

            <span className={`text-2xl relative right-6 font-black tracking-tight ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>RentEase</span>

          </div>



          {/* SEARCH (keeps same) */}

          <div className="hidden md:flex flex-1 max-w-md mx-8">

            <div className={`w-full flex items-center rounded-full px-4 py-2 transition-all ${scrolled

              ? 'bg-gray-100 dark:bg-white/10 border border-transparent focus-within:border-violet-500'

              : 'bg-white/10 border border-white/20 focus-within:bg-black/40'

              }`}>

              <Search className={`w-4 h-4 ${scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300'}`} />

              <input

                type="text"

                placeholder="Search locations..."

                className={`ml-3 bg-transparent border-none focus:ring-0 text-sm w-full ${scrolled ? 'text-gray-900 dark:text-white placeholder-gray-500' : 'text-white placeholder-gray-300'}`}

                onChange={(e) => onSearch && onSearch(e.target.value)}

              />

            </div>

          </div>



          {/* Desktop Menu */}

          <div className="hidden md:flex items-center space-x-4">

            <div className={`flex items-center rounded-full p-1 border backdrop-blur-sm ${scrolled ? 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5' : 'bg-white/10 border-white/10'

              }`}>

              {navItems.map((item) => (

                <button

                  key={item.id}

                  onClick={() => onNavigate(item.id)}

                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 relative ${currentView === (item.id === 'dashboard' ? (userRole === 'landlord' ? 'landlord-dashboard' : 'tenant-dashboard') : item.id)

                    ? 'text-violet-600 dark:text-white bg-white dark:bg-white/10 shadow-sm'

                    : scrolled ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-gray-300 hover:text-white'

                    }`}

                >

                  {item.label}

                </button>

              ))}

            </div>



            <div className={`h-6 w-px ${scrolled ? 'bg-gray-300 dark:bg-white/10' : 'bg-white/20'}`}></div>



            <div className="flex items-center gap-4">

              <ThemeToggle isDark={isDark} toggle={toggleTheme} />

            </div>



            {isLoggedIn ? (

              <div className="flex items-center gap-3 pl-2">

                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20">

                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}

                </div>

                <span className={`text-sm font-bold truncate max-w-[100px] ${scrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}>{user?.name}</span>

                <button onClick={onLogout} className={`text-xs font-bold hover:text-red-500 transition-colors ${scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'}`}>Log Out</button>

              </div>

            ) : (

              <div className="flex items-center gap-3">

                <button onClick={() => onNavigate('login')} className={`font-bold text-xs px-4 transition-colors ${scrolled ? 'text-gray-600 dark:text-gray-300 hover:text-violet-600' : 'text-white hover:text-violet-300'}`}>Log In</button>

                <button onClick={() => onNavigate('signup')} className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full font-bold text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">

                  Get Started

                </button>

              </div>

            )}

          </div>



          {/* Mobile menu */}

          <div className="flex md:hidden items-center gap-4">

            <ThemeToggle isDark={isDark} toggle={toggleTheme} />

            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10' : 'text-white hover:bg-white/10'}`}>

              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}

            </button>

          </div>

        </div>

      </div>



      {/* Mobile panel (simple) */}

      {/** Expandable mobile menu could go here if you want */}

    </nav>

  );

};



const PropertyNavbar = ({ onBack, isDark, toggleTheme, title }) => {

  const [scrolled, setScrolled] = useState(false);



  useEffect(() => {

    const handleScroll = () => setScrolled(window.scrollY > 100);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);

  }, []);



  return (

    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-[#030303]/90 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 py-3 shadow-2xl' : 'bg-transparent py-4'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button

            onClick={onBack}

            className={`p-2.5 rounded-full backdrop-blur-md transition-all border group shadow-lg ${scrolled ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white border-transparent' : 'bg-black/20 text-white border-white/20 hover:bg-black/40'}`}

          >

            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

          </button>

          <div className={`transition-all duration-300 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-md">{title}</h1>

          </div>

        </div>



        <div className="flex items-center gap-3">

          <div className="hidden md:flex bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/20 dark:border-white/10 mr-4">

            {['Overview', 'Amenities', 'Reviews', 'Location'].map((item) => (

              <button key={item} className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all">

                {item}

              </button>

            ))}

          </div>



          <ThemeToggle isDark={isDark} toggle={toggleTheme} />



          <button className={`p-2.5 rounded-full backdrop-blur-md transition-all border shadow-lg hover:scale-105 active:scale-95 ${scrolled ? 'bg-gray-100 dark:bg-white/10 border-transparent text-gray-900 dark:text-white' : 'bg-black/20 text-white border-white/20 hover:bg-black/40'}`}>

            <Share2 className="w-5 h-5" />

          </button>

          <button className={`p-2.5 rounded-full backdrop-blur-md transition-all border shadow-lg hover:scale-105 active:scale-95 ${scrolled ? 'bg-gray-100 dark:bg-white/10 border-transparent text-gray-900 dark:text-white' : 'bg-black/20 text-white border-white/20 hover:bg-black/40'}`}>

            <Heart className="w-5 h-5" />

          </button>

        </div>

      </div>

    </nav>

  );

};



const PropertyCard = ({ property, onView }) => {

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [isHovered, setIsHovered] = useState(false);



  const nextImage = (e) => {

    e.stopPropagation();

    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);

  };



  const prevImage = (e) => {

    e.stopPropagation();

    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  };



  return (

    <div

      className="group relative bg-white dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] hover:border-violet-500/30 hover:-translate-y-2 animate-fade-in-up"

      onMouseEnter={() => setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}

    >

      <div className="relative h-80 overflow-hidden">

        {property.images.slice(0, 5).map((img, index) => (

          <img

            key={index}

            src={img}

            alt={property.title}

            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${index === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}

          />

        ))}



        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />



        <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>

          <button onClick={prevImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronLeft className="w-5 h-5" /></button>

          <button onClick={nextImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronRight className="w-5 h-5" /></button>

        </div>



        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">

          {property.images.slice(0, 5).map((_, idx) => (

            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />

          ))}

        </div>



        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">

          <div className="flex gap-2">

            <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest hover:bg-white/20 transition-colors">

              {property.type}

            </span>

            {property.featured && (

              <span className="bg-violet-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.5)]">

                Featured

              </span>

            )}

          </div>

          <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-500 hover:text-white transition-all border border-white/10 group-hover:scale-110">

            <Heart className="w-4 h-4" />

          </button>

        </div>



        <div className="absolute bottom-5 left-6 text-white z-10">

          <p className="text-3xl font-black tracking-tighter flex items-baseline gap-1 drop-shadow-lg">

            ${property.price.toLocaleString()}

            <span className="text-sm font-medium text-gray-300 opacity-80">/mo</span>

          </p>

        </div>

      </div>



      <div className="p-6 relative">

        <div className="mb-6">

          <div className="flex justify-between items-start mb-2">

            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{property.title}</h3>

            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">

              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />

              <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500">{property.rating}</span>

            </div>

          </div>

          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">

            <MapPin className="w-4 h-4 text-violet-500" />

            <p className="text-sm font-medium">{property.location}</p>

          </div>

        </div>



        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 dark:border-white/5 mb-4">

          {[{ icon: Bed, val: property.beds, label: 'Beds' }, { icon: Bath, val: property.baths, label: 'Baths' }, { icon: Maximize, val: property.sqft, label: 'Sqft' }].map((item, i) => (

            <div key={i} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">

              <item.icon className="w-5 h-5 text-gray-400 dark:text-gray-300 mx-auto mb-1" />

              <p className="text-xs text-gray-600 dark:text-gray-400">{item.val} {item.label}</p>

            </div>

          ))}

        </div>



        <div className="flex items-center justify-between mt-2">





          <button

            onClick={() => onView(property)}

            className="relative overflow-hidden group/btn bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg dark:hover:shadow-violet-500/50"

          >

            <span className="relative z-10 flex items-center gap-2">

              View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />

            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>

          </button>

        </div>

      </div>

    </div>

  );

};



const ChatInterface = ({ landlord, isLoggedIn, onLogin }) => {

  const [messages, setMessages] = useState([

    { id: 1, sender: 'landlord', text: `Hi there! I'm ${landlord.name}. Interested in this property?` }

  ]);

  const [inputText, setInputText] = useState('');

  const chatEndRef = useRef(null);



  const handleSend = () => {

    if (!inputText.trim()) return;

    setMessages([...messages, { id: Date.now(), sender: 'user', text: inputText }]);

    setInputText('');

    setTimeout(() => {

      setMessages(prev => [...prev, { id: Date.now(), sender: 'landlord', text: "Thanks for your message! Would you like to schedule a tour?" }]);

    }, 1500);

  };



  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages]);



  return (

    <div className="flex flex-col h-full bg-white dark:bg-[#0f0f0f]">

      {!isLoggedIn && (

        <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/60 dark:bg-black/70 flex flex-col items-center justify-center p-6 text-center rounded-3xl">

          <div className="w-16 h-16 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">

            <Lock className="w-8 h-8 text-violet-600" />

          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Chat</h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xs">Sign in to connect directly with {landlord.name} and book your tour.</p>

          <button onClick={onLogin} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">

            Sign In Now

          </button>

        </div>

      )}



      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="relative">

            <img src={landlord.avatar} alt={landlord.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500" />

            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#0f0f0f]"></div>

          </div>

          <div>

            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{landlord.name}</h4>

            <p className="text-xs text-gray-500">Replies in {landlord.responseTime}</p>

          </div>

        </div>

        <div className="flex gap-1">

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-violet-600 dark:text-violet-400"><Phone className="w-5 h-5" /></button>

        </div>

      </div>



      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">

        <div className="text-center text-xs text-gray-400 my-2">Today</div>

        {messages.map(msg => (

          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>

            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm ${msg.sender === 'user'

              ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm'

              : 'bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 rounded-bl-sm'

              }`}>

              {msg.text}

            </div>

          </div>

        ))}

        <div ref={chatEndRef} />

      </div>



      <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5">

        <div className="flex gap-2 items-end">

          <button className="p-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><Plus className="w-5 h-5" /></button>

          <div className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-1 flex items-center">

            <input

              type="text"

              value={inputText}

              onChange={(e) => setInputText(e.target.value)}

              onKeyPress={(e) => e.key === 'Enter' && handleSend()}

              placeholder="Type a message..."

              disabled={!isLoggedIn}

              className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none disabled:opacity-50"

            />

          </div>

          <button

            onClick={handleSend}

            disabled={!isLoggedIn || !inputText.trim()}

            className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-300 dark:disabled:bg-white/10 text-white p-3 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95"

          >

            <Send className="w-5 h-5" />

          </button>

        </div>

      </div>

    </div>

  );

};



const PropertyDetailsPage = ({ property, isLoggedIn, onLogin }) => {

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [activeCategory, setActiveCategory] = useState(null);
  const [pois, setPois] = useState([]);

  if (!property) return null;

  const generateMockPOIs = (category, lat, lng) => {
    const categories = {
      education: ['High School', 'Public Library', 'University Campus', 'Primary School'],
      healthcare: ['City Hospital', 'Dental Clinic', 'Pharmacy', 'Medical Center'],
      commute: ['Metro Station', 'Bus Stop', 'Train Station', 'Taxi Stand'],
      food: ['Cafe', 'Restaurant', 'Bakery', 'Local Bistro'],
      shopping: ['Supermarket', 'Shopping Mall', 'Convenience Store', 'Boutique']
    };
    
    const names = categories[category] || categories.food;
    const baseLat = parseFloat(lat) || 13.6288;
    const baseLng = parseFloat(lng) || 79.4192;
    
    return names.map((name, i) => {
      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      return {
        name: name,
        category: category,
        latitude: baseLat + latOffset,
        longitude: baseLng + lngOffset,
        distance: `${(Math.random() * 2 + 0.5).toFixed(1)} km`
      };
    });
  };

  const handleCategoryClick = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setPois([]);
    } else {
      setActiveCategory(category);
      setPois(generateMockPOIs(category, property.latitude, property.longitude));
    }
  };

  const nextImage = () => setCurrentImgIndex((prev) => (prev + 1) % property.images.length);

  const prevImage = () => setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);



  return (

    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] animate-fade-in-up">

      {/* 1. CINEMATIC HERO SECTION */}

      <div className="relative h-[85vh] w-full group overflow-hidden">

        <img

          src={property.images[currentImgIndex]}

          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"

          alt="Main"

        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>



        {/* Navigation */}

        <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">

          <button onClick={prevImage} className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 hover:scale-110"><ChevronLeft className="w-8 h-8" /></button>

          <button onClick={nextImage} className="pointer-events-auto p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all border border-white/10 hover:scale-110"><ChevronRight className="w-8 h-8" /></button>

        </div>



        {/* Floating Info Card */}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col md:flex-row items-end justify-between gap-6 bg-gradient-to-t from-black/90 to-transparent">

          <div className="max-w-3xl animate-fade-in-up delay-100">

            <div className="flex items-center gap-3 mb-4">

              <span className="px-4 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg animate-scale-in">

                {property.type}

              </span>

              {property.featured && (

                <span className="px-4 py-1.5 rounded-full glass-card text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">

                  <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Featured

                </span>

              )}

              <div className="flex items-center gap-1 glass-card px-3 py-1.5 rounded-full text-white text-xs font-bold">

                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {property.rating}

              </div>

            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none tracking-tight drop-shadow-2xl">

              {property.title}

            </h1>

            <p className="text-gray-200 flex items-center gap-2 text-xl font-medium">

              <MapPin className="w-6 h-6 text-violet-400" /> {property.location}

            </p>

          </div>



          <div className="flex gap-3 animate-fade-in-up delay-200">

            <button className="glass-card px-6 py-3 rounded-full text-white font-bold hover:bg-white/20 transition-all flex items-center gap-2">

              <Grid className="w-5 h-5" /> View Gallery

            </button>

          </div>

        </div>

      </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 -mt-10">

        <div className="flex flex-col lg:flex-row gap-12">



          {/* LEFT CONTENT */}

          <div className="flex-1 space-y-12 animate-fade-in-up delay-300">



            {/* HOLOGRAPHIC SPECS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              {[

                { icon: Bed, label: 'Bedrooms', value: property.beds, color: 'violet' },

                { icon: Bath, label: 'Bathrooms', value: property.baths, color: 'pink' },

                { icon: Maximize, label: 'Square Area', value: property.sqft + ' sqft', color: 'cyan' },

                { icon: Compass, label: 'Orientation', value: property.details.facing, color: 'amber' }

              ].map((spec, i) => (

                <div key={i} className="group relative p-6 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 overflow-hidden hover:border-violet-500/30 transition-all hover:shadow-2xl hover:-translate-y-1">

                  <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${spec.color}-500/10 rounded-full blur-2xl group-hover:bg-${spec.color}-500/20 transition-all`}></div>

                  <div className="relative z-10">

                    <spec.icon className={`w-8 h-8 text-${spec.color}-500 mb-3`} />

                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{spec.label}</p>

                    <p className="text-2xl font-black text-gray-900 dark:text-white">{spec.value}</p>

                  </div>

                </div>

              ))}

            </div>



            {/* DESCRIPTION & HOST */}

            <div className="bg-white dark:bg-[#111] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-sm">

              <div className="flex items-center justify-between mb-6">

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">About this home</h3>

                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 pr-4 rounded-full">

                  <img src={property.landlord.avatar} className="w-10 h-10 rounded-full object-cover" alt="host" />

                  <div>

                    <p className="text-xs text-gray-500 font-bold uppercase">Hosted by</p>

                    <p className="text-sm font-bold text-gray-900 dark:text-white">{property.landlord.name}</p>

                  </div>

                </div>

              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">

                Experience luxury living in this stunning {property.type.toLowerCase()} located in the heart of {property.location}.

                Featuring state-of-the-art amenities, breathtaking views, and modern design, this property offers the perfect blend of comfort and style.

                Whether you are working from home or entertaining guests, every corner is designed to impress.

              </p>

            </div>



            {/* AMENITIES */}

            <div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What this place offers</h3>

              <div className="grid grid-cols-2 gap-4">

                {[

                  { icon: Wifi, label: 'Fast Wifi' },

                  { icon: Car, label: 'Free Parking' },

                  { icon: Coffee, label: 'Coffee Bar' },

                  { icon: Utensils, label: 'Full Kitchen' },

                  { icon: Dumbbell, label: 'Private Gym' },

                  { icon: Tv, label: '4K Cinema' },

                  { icon: Shield, label: '24/7 Security' },

                  { icon: Zap, label: 'Generator' }

                ].map((item, i) => (

                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">

                    <item.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />

                    <span className="font-medium text-gray-900 dark:text-gray-200">{item.label}</span>

                  </div>

                ))}

              </div>

            </div>



            {/* MAP CARD */}

            <div className="h-96 rounded-3xl bg-gray-200 dark:bg-[#111] relative overflow-hidden group shadow-lg mb-4">

              <FreeMap properties={[property]} pois={pois} singleProperty={true} center={[parseFloat(property.latitude) || 13.6288, parseFloat(property.longitude) || 79.4192]} zoom={13} />

            </div>

            {/* CATEGORY EXPLORE BUTTONS */}
            <div className="bg-white dark:bg-[#111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Explore Neighbourhood</h4>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'education', label: 'Education', icon: BookOpen, color: 'text-violet-500' },
                  { id: 'healthcare', label: 'Healthcare', icon: Activity, color: 'text-rose-500' },
                  { id: 'commute', label: 'Commute', icon: Train, color: 'text-blue-500' },
                  { id: 'food', label: 'Food and Drinks', icon: Coffee, color: 'text-orange-500' },
                  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-emerald-500' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
                      activeCategory === cat.id
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10 dark:border-violet-500'
                        : 'border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/50'
                    }`}
                  >
                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>



          {/* RIGHT SIDEBAR (STICKY) */}

          <div className="lg:w-[450px] animate-fade-in-up delay-500 relative">

            <div className="sticky top-28 space-y-6">

              {/* Booking Card */}

              <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden">

                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>



                <div className="flex justify-between items-start mb-8 relative z-10">

                  <div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-through decoration-red-500 decoration-2">${Number(property.price * 1.2).toLocaleString()}</p>

                    <div className="flex items-baseline gap-1">

                      <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">${property.price.toLocaleString()}</h2>

                      <span className="text-gray-500 font-medium">/mo</span>

                    </div>

                  </div>

                  <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">

                    <CheckCircle2 className="w-3 h-3" /> Available

                  </div>

                </div>



                <div className="space-y-4 mb-8">

                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">

                    <div className="flex items-center gap-3">

                      <Calendar className="w-5 h-5 text-violet-500" />

                      <div className="text-left">

                        <p className="text-xs text-gray-500 font-bold uppercase">Move-in Date</p>

                        <p className="text-sm font-bold text-gray-900 dark:text-white">Select Date</p>

                      </div>

                    </div>

                    <ChevronDown className="w-4 h-4 text-gray-400" />

                  </div>

                </div>



                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">

                  <Shield className="w-4 h-4" /> No booking fees involved

                </div>

              </div>



              {/* Chat Widget */}

              <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden h-[500px] flex flex-col">

                <div className="p-6 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">

                  <h3 className="font-bold text-gray-900 dark:text-white">Chat with {property.landlord.name.split(' ')[0]}</h3>

                </div>

                <div className="flex-1 overflow-hidden">

                  <ChatInterface landlord={property.landlord} isLoggedIn={isLoggedIn} onLogin={onLogin} />

                </div>

              </div>

            </div>

          </div>



        </div>

      </div>

    </div>

  );

};



// FilterSection, BrowsePage, AuthPage (kept consistent)

const FilterSection = ({ currentPrice, onPriceChange, currentType, onTypeChange }) => (

  <div className="sticky top-20 z-30 py-4 mb-8">

    <div className="max-w-7xl mx-auto px-4">

      <div className="bg-white/80 dark:bg-[#121212]/80 backdrop-blur-lg border border-gray-200 dark:border-white/5 rounded-2xl p-2 flex flex-col md:flex-row gap-2 overflow-x-auto no-scrollbar shadow-xl">

        <div className="flex-1 flex gap-2">

          <div className="relative group min-w-[160px]">

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Filter className="w-4 h-4" /></div>

            <select

              value={currentPrice}

              onChange={(e) => onPriceChange(e.target.value)}

              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"

            >

              <option value="all" className="dark:bg-[#121212]">Price Range</option>

              <option value="0-1500" className="dark:bg-[#121212]">Under $1,500</option>

              <option value="1500-2500" className="dark:bg-[#121212]">$1,500 - $2,500</option>

              <option value="2500-4000" className="dark:bg-[#121212]">$2,500 - $4,000</option>

              <option value="4000+" className="dark:bg-[#121212]">$4,000+</option>

            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />

          </div>



          <div className="relative group min-w-[160px]">

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Home className="w-4 h-4" /></div>

            <select

              value={currentType}

              onChange={(e) => onTypeChange(e.target.value)}

              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"

            >

              <option value="all" className="dark:bg-[#121212]">Property Type</option>

              <option value="Apartment" className="dark:bg-[#121212]">Apartment</option>

              <option value="House" className="dark:bg-[#121212]">House</option>

              <option value="Penthouse" className="dark:bg-[#121212]">Penthouse</option>

              <option value="Loft" className="dark:bg-[#121212]">Loft</option>

            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />

          </div>

        </div>



        <div className="flex gap-2 items-center px-2">

          {['Pet Friendly', 'Parking', 'Pool'].map(tag => (

            <button key={tag} className="whitespace-nowrap px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-sm text-gray-600 dark:text-gray-300 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all">

              {tag}

            </button>

          ))}

        </div>

      </div>

    </div>

  </div>

);



const BrowsePage = ({ onView, filteredProperties, priceFilter, setPriceFilter, typeFilter, setTypeFilter }) => {

  return (

    <div className="min-h-screen pb-20 animate-fade-in-up">

      <GlobalStyles />

      <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gray-900">

        <div className="absolute inset-0 z-0">

          <img

            src="https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&q=80&w=2000"

            className="w-full h-full object-cover scale-105 animate-float opacity-60 dark:opacity-80"

            alt="City"

          />

          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/20 to-gray-50 dark:to-[#050505]"></div>

        </div>



        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-16">





          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">

            Discover your <br />

            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">next dimension.</span>

          </h1>



        </div>

      </div>



      <div className="relative z-20 -mt-20">

        <FilterSection

          currentPrice={priceFilter}

          onPriceChange={setPriceFilter}

          currentType={typeFilter}

          onTypeChange={setTypeFilter}

        />



        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filteredProperties.map((property) => (

              <PropertyCard key={property.id} property={property} onView={onView} />

            ))}

          </div>

          {filteredProperties.length === 0 && (

            <div className="text-center py-20">

              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};



const AuthPage = ({ type, onLogin }) => (

  <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-gray-50 dark:bg-[#050505]">

    <GlobalStyles />

    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 dark:bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>



    <div className="w-full max-w-md bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-2xl relative z-10 animate-fade-in-up">

      <div className="text-center mb-10">

        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-900/30">

          <Home className="text-white w-10 h-10" />

        </div>

        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{type === 'login' ? 'Welcome Back' : 'Join RentEase'}</h2>

        <p className="text-gray-500 dark:text-gray-400">Enter your credentials to access the future.</p>

      </div>



      <div className="space-y-5">

        <input type="email" placeholder="Email Address" className="w-full bg-gray-100 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />

        <input type="password" placeholder="Password" className="w-full bg-gray-100 dark:bg-[#050505] border border-gray-200 dark:border-white/10 rounded-2xl py-4 px-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />



        <div className="flex gap-2">

          <button onClick={() => onLogin('tenant')} className="flex-1 w-full bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-4 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl">

            Sign In (Tenant)

          </button>

          <button onClick={() => onLogin('landlord')} className="flex-1 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl">

            Sign In (Landlord)

          </button>

        </div>

      </div>

    </div>

  </div>

);



// Simple placeholder dashboards

const TenantDashboard = ({ onBack }) => (

  <div className="min-h-screen flex items-center justify-center">

    <div className="max-w-4xl w-full p-8 bg-white dark:bg-[#0b0b0b] rounded-3xl shadow-xl">

      <h2 className="text-3xl font-black mb-4">Tenant Dashboard</h2>

      <p className="text-gray-600 dark:text-gray-300">Your bookings, saved properties and messages will appear here.</p>

      <div className="mt-6">

        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Back</button>

      </div>

    </div>

  </div>

);



const LandlordDashboard = ({ onBack }) => (

  <div className="min-h-screen flex items-center justify-center">

    <div className="max-w-4xl w-full p-8 bg-white dark:bg-[#0b0b0b] rounded-3xl shadow-xl">

      <h2 className="text-3xl font-black mb-4">Landlord Dashboard</h2>

      <p className="text-gray-600 dark:text-gray-300">Manage your properties, view bookings and respond to tenants here.</p>

      <div className="mt-6">

        <button onClick={onBack} className="px-4 py-2 rounded-lg bg-gray-900 text-white">Back</button>

      </div>

    </div>

  </div>

);



// --- APP (main) ---

const App = () => {

  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState('browse'); // 'browse' | 'details' | 'login' | 'signup' | 'tenant-dashboard' | 'landlord-dashboard'

  const [selectedProperty, setSelectedProperty] = useState(null);

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [priceFilter, setPriceFilter] = useState("all");

  const [typeFilter, setTypeFilter] = useState("all");

  // Sync with real auth
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);



  // Computed auth state

  const isLoggedIn = !!user;

  const userRole = user?.role?.toLowerCase();



  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTenantId");
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate("/");
  };



  // Filter Logic

  const filteredProperties = MOCK_PROPERTIES.filter(p => {

    const matchesSearch = p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||

      p.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || p.type === typeFilter;



    let matchesPrice = true;

    if (priceFilter !== "all") {

      const price = p.price;

      if (priceFilter === "0-1500") matchesPrice = price < 1500;

      else if (priceFilter === "1500-2500") matchesPrice = price >= 1500 && price <= 2500;

      else if (priceFilter === "2500-4000") matchesPrice = price > 2500 && price <= 4000;

      else if (priceFilter === "4000+") matchesPrice = price > 4000;

    }



    return matchesSearch && matchesType && matchesPrice;

  });



  const handleViewProperty = (property) => {

    setSelectedProperty(property);

    setCurrentView('details');

    window.scrollTo(0, 0);

  };



  const renderView = () => {

    // Role-based dashboards

    if (currentView === 'tenant-dashboard') {

      return (

        <>

          <PropertyNavbar onBack={() => setCurrentView('browse')} isDark={isDarkMode} toggleTheme={toggleTheme} title="Tenant Dashboard" />

          <TenantDashboard onBack={() => setCurrentView('browse')} />

        </>

      );

    }

    if (currentView === 'landlord-dashboard') {

      return (

        <>

          <PropertyNavbar onBack={() => setCurrentView('browse')} isDark={isDarkMode} toggleTheme={toggleTheme} title="Landlord Dashboard" />

          <LandlordDashboard onBack={() => setCurrentView('browse')} />

        </>

      );

    }



    switch (currentView) {

      case 'details':

        return (

          <>

            <PropertyNavbar

              onBack={() => setCurrentView('browse')}

              isDark={isDarkMode}

              toggleTheme={toggleTheme}

              title={selectedProperty?.title}

            />

            <PropertyDetailsPage

              property={selectedProperty}

              onBack={() => setCurrentView('browse')}

              isLoggedIn={isLoggedIn}

              onLogin={() => navigate('/login')}

            />

          </>

        );

      case 'login':

        navigate('/login');

        return null;

      case 'signup':

        navigate('/signup');

        return null;

      default:

        return (

          <>

            <Navbar

              onNavigate={(id) => {

                if (id === 'login') return navigate('/login');

                if (id === 'signup') return navigate('/signup');

                if (id === 'dashboard') {

                  if (!isLoggedIn) return navigate('/login');

                  if (userRole === 'landlord') return navigate('/landlord/dashboard');

                  if (userRole === 'tenant') return navigate('/tenant/dashboard');

                }

                setCurrentView(id);

              }}

              currentView={currentView}

              isDark={isDarkMode}

              toggleTheme={toggleTheme}

              isLoggedIn={isLoggedIn}

              user={user}

              onLogout={handleLogout}

              onSearch={setSearchTerm}

            />

            <BrowsePage

              onView={handleViewProperty}

              onSearch={setSearchTerm}

              filteredProperties={filteredProperties}

              priceFilter={priceFilter}

              setPriceFilter={setPriceFilter}

              typeFilter={typeFilter}

              setTypeFilter={setTypeFilter}

            />

          </>

        );

    }

  };



  return (

    <div className={`min-h-screen font-sans selection:bg-violet-500/30 overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'}`}>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float"></div>

        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/5 dark:bg-violet-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-float delay-500"></div>

      </div>



      <main className="relative z-10">

        {renderView()}

      </main>



      {currentView !== 'details' && (

        <footer className="relative z-10 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#030303] py-20 transition-colors">

          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">

            <div className="space-y-4">

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">

                  <Home className="text-white w-4 h-4" />

                </div>

                <span className="text-xl font-bold text-gray-900 dark:text-white">RentEase</span>

              </div>

              <p className="text-gray-500 text-sm leading-relaxed">

                Redefining the rental experience with AI-driven matching and premium aesthetics.

              </p>

            </div>

          </div>

        </footer>

      )}

    </div>

  );

};



export default App;