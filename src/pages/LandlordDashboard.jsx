/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

import {
  Home,
  CreditCard,
  MessageSquare,
  FileText,
  User,
  Bell,
  LogOut,
  Plus,
  Check,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  Download,
  Menu,
  X,
  IndianRupee,
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
  Briefcase,
  TrendingUp,
  Wrench,
  MoreVertical,
  Search,
  PieChart,
  BarChart,
  Filter,
  MapPin,
  ArrowUpRight,
  UserPlus,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowLeft,
  Trash2,
  Users2,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  Compass,
  Maximize,
  Store,
  Upload,
  Edit,
  UserCheck,
  UserX,
  MessageCircle
} from 'lucide-react';
import { Card } from '../components/ui/card';
import ChatWindow from '../components/chat/ChatWindow';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';


// --- Mock Data & Constants ---
const INITIAL_USER = {
  name: "Alice Cooper",
  email: "alice.c@rentease.com",
  phone: "+1 (555) 123-4567",
  propertyName: "Sunset Villa",
  address: "123 Sunset Boulevard, Paradise City, PC 12345",
  landlord: "John Smith",
  monthlyRent: 1200,
  leaseStart: "2023-08-01",
  leaseEnd: "2024-07-31",
  familyMembers: 4,
  propertiesCount: 1
};

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2670&auto=format&fit=crop"
];

const INITIAL_PAYMENTS = [
  { id: 1, date: "Jan 28, 2024", amount: 1200, status: "Paid", method: "Auto-Pay (**44)" },
  { id: 2, date: "Dec 28, 2023", amount: 1200, status: "Paid", method: "Auto-Pay (**44)" },
];

const INITIAL_COMPLAINTS = [];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Rent Received", message: "Alice Cooper paid rent for Sunset Villa", time: "2 hours ago", read: false, type: 'payment' },
  { id: 2, title: "Lease Ending Soon", message: "Bob Wilson's lease expires in 30 days", time: "5 hours ago", read: true, type: 'alert' },
];

const AMENITIES_LIST = [
  { id: 1, name: "Swimming Pool", icon: Sparkles },
  { id: 2, name: "Gym / Fitness Center", icon: TrendingUp },
  { id: 3, name: "Car Parking", icon: Building },
  { id: 4, name: "24/7 Security", icon: Shield },
  { id: 5, name: "Wifi / Internet", icon: Globe },
  { id: 6, name: "Garden / Park", icon: Sun },
  { id: 7, name: "Power Backup", icon: Clock },
  { id: 8, name: "Elevator", icon: ChevronLeft },
];

const LANDLORD_STATS = {
  revenue: 45200,
  occupancy: 92,
  totalUnits: 12,
  pendingIssues: 5
};

const REVENUE_DATA = [
  { month: "Jan", amount: 32000 },
  { month: "Feb", amount: 35000 },
  { month: "Mar", amount: 31000 },
  { month: "Apr", amount: 38000 },
  { month: "May", amount: 42000 },
  { month: "Jun", amount: 40000 },
  { month: "Jul", amount: 45200 },
];

// const INITIAL_PROPERTIES = [
//   { id: 1, name: "Sunset Villa", address: "123 Sunset Blvd", type: "Villa", units: 1, status: "Occupied", rent: 1200, image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop" },

const INITIAL_TENANTS_DATA = [];

// --- Bookings Mock Data ---
const MOCK_BOOKINGS = [
  { id: 1, propertyName: "Sunset Villa", location: "Beverly Hills", tenantName: "Sairam", email: "sairam@example.com", date: "2024-03-15", status: "Pending", userType: "Student" },
  { id: 2, propertyName: "Urban Loft", location: "Downtown NY", tenantName: "Jaswanth Raj", email: "jaswanth@example.com", date: "2024-03-18", status: "Approved", userType: "Family" },
  { id: 3, propertyName: "Seaside Condo", location: "Miami Beach", tenantName: "Chandu", email: "chandu@example.com", date: "2024-03-20", status: "Rejected", userType: "Professional" },
];

// --- Top Level Utility Components ---



const Button = ({ children, variant = "primary", onClick, className = "", disabled = false, icon: Icon, type = "button", isDarkMode }) => {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/25 border border-white/10",
    secondary: isDarkMode ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700" : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
    danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20",
    ghost: isDarkMode ? "bg-transparent text-slate-400 hover:text-white hover:bg-white/5" : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
    outline: isDarkMode ? "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white" : "bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900",
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const AddPropertyView = ({ newProperty, setNewProperty, isDarkMode, setActiveTab, setLandlordProperties, showNotificationToast }) => {
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "First_project");

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

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingImages(true);
    try {
      const uploadedImages = [];
      const existingImageCount = newProperty.images.length;

      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        uploadedImages.push({
          url,
          is_cover: existingImageCount === 0 && i === 0
        });
      }

      setNewProperty((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      toast.success("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = newProperty.images.filter((_, i) => i !== index);
    if (newProperty.images[index].is_cover && updatedImages.length > 0) {
      updatedImages[0].is_cover = true;
    }
    setNewProperty(prev => ({ ...prev, images: updatedImages }));
  };

  const handleSetCover = (index) => {
    const updatedImages = newProperty.images.map((img, i) => ({ ...img, is_cover: i === index }));
    setNewProperty(prev => ({ ...prev, images: updatedImages }));
  };

  const handleToggleAmenity = (id) => {
    setNewProperty(prev => {
      const alreadyHas = prev.amenities.includes(id);
      return {
        ...prev,
        amenities: alreadyHas ? prev.amenities.filter(a => a !== id) : [...prev.amenities, id]
      };
    });
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();

    if (newProperty.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    try {
      const propertyPayload = {
        title: newProperty.title,
        description: newProperty.description,
        property_type: newProperty.type,
        price: parseFloat(newProperty.price) || 0,
        orientation: newProperty.orientation,
        bedrooms: ["PG", "COMMERCIAL_SHOP", "OFFICE_SPACE"].includes(newProperty.type) ? 0 : (parseInt(newProperty.bedrooms) || 0),
        bathrooms: ["PG", "COMMERCIAL_SHOP", "OFFICE_SPACE"].includes(newProperty.type) ? 0 : (parseInt(newProperty.bathrooms) || 0),
        area_sqft: newProperty.type === "PG" ? 0 : (parseFloat(newProperty.area) || 0),
        city: newProperty.city,
        locality: newProperty.locality,
        address: newProperty.fullAddress,
        is_featured: newProperty.featured,
        images: newProperty.images,
        amenities: newProperty.amenities,
        // Apartment fields
        building_name: newProperty.building_name,
        flat_number: newProperty.flat_number,
        floor_number: newProperty.floor_number ? parseInt(newProperty.floor_number) : null,
        bhk: newProperty.bhk ? parseInt(newProperty.bhk) : null,
        is_gated: newProperty.is_gated,
        total_floors: newProperty.total_floors ? parseInt(newProperty.total_floors) : null,
        has_lift: newProperty.has_lift,
        parking_type: newProperty.parking_type,
        // Independent house additional
        house_floor_type: newProperty.house_floor_type,
        // Villa additional
        duplex_type: newProperty.duplex_type,
        private_parking_slots: newProperty.private_parking_slots ? parseInt(newProperty.private_parking_slots) : 0,
        private_garden: newProperty.private_garden,
        // Gated already mapped to is_gated
        // PG / Hostel additional
        room_type: newProperty.room_type,
        food_included: newProperty.food_included,
        electricity_included: newProperty.electricity_included,
        gender_allowed: newProperty.gender_allowed,
        // Commercial Shop additional
        shop_use_type: newProperty.shop_use_type,
        water_available: newProperty.water_available,
        // Office Space additional
        office_type: newProperty.office_type,
        seating_capacity: newProperty.seating_capacity ? parseInt(newProperty.seating_capacity) : null,
        cabins_available: newProperty.cabins_available,
        conference_room: newProperty.conference_room,

        // Financials & Policies
        security_deposit: parseFloat(newProperty.security_deposit) || 0,
        rent_escalation_desc: newProperty.rent_escalation_desc || null,
        bank_account: newProperty.bank_account || null,
        ifsc_code: newProperty.ifsc_code || null,
        upi_id: newProperty.upi_id || null,
        rent_due_day: parseInt(newProperty.rent_due_day) || 5,
        late_penalty_amount: parseFloat(newProperty.late_penalty_amount) || 0,
        guidelines: newProperty.guidelines || null
      };

      const response = await axios.post("http://localhost:5000/api/properties/addproperty", propertyPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.status === 201) {
        toast.success("Property successfully published!");
        setLandlordProperties(prev => [response.data, ...prev]);
        // setActiveTab('properties');
        setNewProperty({
          title: "", description: "", type: "", orientation: "North",
          price: "", bedrooms: "", bathrooms: "", area: "",
          city: "", locality: "", fullAddress: "", featured: false,
          images: [], amenities: [],
          building_name: "", flat_number: "", floor_number: "", bhk: "",
          is_gated: false, total_floors: "", has_lift: false, parking_type: "",
          duplex_type: false, private_parking_slots: "", private_garden: false,
          room_type: "", food_included: false, electricity_included: false, gender_allowed: "",
          shop_use_type: "", water_available: false,
          office_type: "", seating_capacity: "", cabins_available: false, conference_room: false,
          security_deposit: "", rent_escalation_desc: "", bank_account: "", ifsc_code: "", upi_id: "",
          rent_due_day: "5", late_penalty_amount: "", guidelines: ""
        });
      }
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(error.response?.data?.error || "Failed to save property");
    }
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5'}`;
  const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

  return (
    <form onSubmit={handleSaveProperty} className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700" >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Publish New <span className="text-violet-500">Property</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium">Register a new asset to your marvelous portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Button isDarkMode={isDarkMode} type="submit" icon={CheckCircle2}>List Property</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><FileText size={24} /></div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Basic Details</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Property Title</label>
                <input required name="title" value={newProperty.title} onChange={handleInputChange} type="text" placeholder="e.g. Modern Luxury Penthouse" className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Description</label>
                <textarea required name="description" value={newProperty.description} onChange={handleInputChange} rows="4" placeholder="Describe the ambiance..." className={inputClasses}></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Property Type</label>
                  <select name="type" value={newProperty.type} onChange={(e) => {
                    handleInputChange(e);
                    if (e.target.value === 'INDEPENDENT') {
                      setNewProperty(prev => ({ ...prev, house_floor_type: 'GROUND_ONLY' }));
                    }
                  }} className={inputClasses}>
                    <option value="" disabled>Select Type</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="INDEPENDENT">Independent House</option>
                    <option value="VILLA">Villa</option>
                    <option value="STUDIO">Studio</option>
                    <option value="INDEPENDENT_FLOOR">Independent Floor</option>
                    <option value="PG">PG / Hostel</option>
                    <option value="COMMERCIAL_SHOP">Commercial Shop</option>
                    <option value="OFFICE_SPACE">Office Space</option>
                  </select>
                </div>

                {newProperty.type === "OFFICE_SPACE" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Briefcase size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Office Space Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Office Type</label>
                      <select name="office_type" value={newProperty.office_type} onChange={handleInputChange} className={inputClasses}>
                        <option value="">Select Office Type</option>
                        <option value="it">IT / Software Office</option>
                        <option value="corporate">Startup / Corporate Office</option>
                        <option value="clinic">Clinic / Medical Office</option>
                        <option value="professional">CA / Legal Office</option>
                        <option value="coworking">Co-working Space</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Floor Number</label>
                      <input required name="floor_number" value={newProperty.floor_number} onChange={handleInputChange} type="number" placeholder="4" className={inputClasses} />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Seating Capacity</label>
                      <input required name="seating_capacity" value={newProperty.seating_capacity} onChange={handleInputChange} type="number" placeholder="20" className={inputClasses} />
                    </div>

                    <div className="md:col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="cabins_available"
                          checked={newProperty.cabins_available}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cabins Available</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="conference_room"
                          checked={newProperty.conference_room}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Conference Room</span>
                      </label>
                    </div>
                  </div>
                )}

                {newProperty.type === "COMMERCIAL_SHOP" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Store size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Commercial Shop Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Shop Use Type</label>
                      <select name="shop_use_type" value={newProperty.shop_use_type} onChange={handleInputChange} className={inputClasses}>
                        <option value="">Select Use Type</option>
                        <option value="retail">Retail</option>
                        <option value="medical">Medical / Pharmacy</option>
                        <option value="showroom">Showroom</option>
                        <option value="office">Office Use</option>
                        <option value="food">Food / Bakery</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Floor Number</label>
                      <input required name="floor_number" value={newProperty.floor_number} onChange={handleInputChange} type="number" placeholder="0 (Ground Floor)" className={inputClasses} />
                      <p className="text-[10px] text-slate-600 font-bold mt-1 pl-1">0 for Ground Floor</p>
                    </div>

                    <div className="md:col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="water_available"
                          checked={newProperty.water_available}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Water Facility Available</span>
                      </label>
                    </div>
                  </div>
                )}

                {newProperty.type === "PG" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Users2 size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">PG / Hostel Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Room Type</label>
                      <select name="room_type" value={newProperty.room_type} onChange={handleInputChange} className={inputClasses}>
                        <option value="">Select Room Type</option>
                        <option value="Single Sharing">Single Sharing</option>
                        <option value="Double Sharing">Double Sharing</option>
                        <option value="Triple Sharing">Triple Sharing</option>
                        <option value="Dormitory">Dormitory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Gender Allowed</label>
                      <select name="gender_allowed" value={newProperty.gender_allowed} onChange={handleInputChange} className={inputClasses}>
                        <option value="">Select Allowed Gender</option>
                        <option value="Male Only">Male Only</option>
                        <option value="Female Only">Female Only</option>
                        <option value="Both">Both (Co-living)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="food_included"
                          checked={newProperty.food_included}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Food Included</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="electricity_included"
                          checked={newProperty.electricity_included}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Electricity Included</span>
                      </label>
                    </div>
                  </div>
                )}

                {newProperty.type === "INDEPENDENT" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Home size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Independent House Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">House Structure</label>
                      <select name="house_floor_type" value={newProperty.house_floor_type} onChange={handleInputChange} className={inputClasses}>
                        <option value="GROUND_ONLY">Ground Floor Only</option>
                      </select>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">BHK</label>
                        <input required name="bhk" value={newProperty.bhk} onChange={handleInputChange} type="number" placeholder="3" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Parking</label>
                        <select name="parking_type" value={newProperty.parking_type} onChange={handleInputChange} className={inputClasses}>
                          <option value="">Select Parking</option>
                          <option value="CAR_COVERED">Car (Covered)</option>
                          <option value="CAR_OPEN">Car (Open)</option>
                          <option value="BIKE_ONLY">Bike Only</option>
                          <option value="CAR_BIKE">Car + Bike</option>
                          <option value="NONE">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}


                {newProperty.type === "INDEPENDENT_FLOOR" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Building size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Independent Floor Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Floor Number</label>
                      <input required name="floor_number" value={newProperty.floor_number} onChange={handleInputChange} type="number" placeholder="1" className={inputClasses} />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Total Floors (Building)</label>
                      <input required name="total_floors" value={newProperty.total_floors} onChange={handleInputChange} type="number" placeholder="3" className={inputClasses} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">BHK</label>
                        <input required name="bhk" value={newProperty.bhk} onChange={handleInputChange} type="number" placeholder="3" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Parking</label>
                        <select name="parking_type" value={newProperty.parking_type} onChange={handleInputChange} className={inputClasses}>
                          <option value="">Select Parking</option>
                          <option value="CAR_COVERED">Car (Covered)</option>
                          <option value="CAR_OPEN">Car (Open)</option>
                          <option value="BIKE_ONLY">Bike Only</option>
                          <option value="CAR_BIKE">Car + Bike</option>
                          <option value="NONE">None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {newProperty.type === "VILLA" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Home size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Villa Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Private Parking Slots</label>
                      <input required name="private_parking_slots" value={newProperty.private_parking_slots} onChange={handleInputChange} type="number" placeholder="2" className={inputClasses} />
                    </div>

                    <div className="md:col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_gated"
                          checked={newProperty.is_gated}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Gated Community</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="duplex_type"
                          checked={newProperty.duplex_type}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Duplex</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="private_garden"
                          checked={newProperty.private_garden}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-black dark:text-white">Private Garden</span>
                      </label>
                    </div>
                  </div>
                )}

                {newProperty.type === "APARTMENT" && (
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 dark:bg-slate-900/50 dark:border-slate-800">
                    <div className="md:col-span-2 flex items-center gap-2 mb-2 pb-2 border-b border-indigo-200 dark:border-slate-700">
                      <Building size={16} className="text-indigo-500" />
                      <span className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Apartment Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Building Name</label>
                      <input required name="building_name" value={newProperty.building_name} onChange={handleInputChange} type="text" placeholder="e.g. Skyline Towers" className={inputClasses} />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Flat Number</label>
                      <input required name="flat_number" value={newProperty.flat_number} onChange={handleInputChange} type="text" placeholder="e.g. 1204-B" className={inputClasses} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Floor No.</label>
                        <input required name="floor_number" value={newProperty.floor_number} onChange={handleInputChange} type="number" placeholder="12" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Total Floors</label>
                        <input required name="total_floors" value={newProperty.total_floors} onChange={handleInputChange} type="number" placeholder="20" className={inputClasses} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">BHK</label>
                        <input required name="bhk" value={newProperty.bhk} onChange={handleInputChange} type="number" placeholder="3" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Parking</label>
                        <select name="parking_type" value={newProperty.parking_type} onChange={handleInputChange} className={inputClasses}>
                          <option value="">Select Parking</option>
                          <option value="CAR_COVERED">Car (Covered)</option>
                          <option value="CAR_OPEN">Car (Open)</option>
                          <option value="BIKE_ONLY">Bike Only</option>
                          <option value="CAR_BIKE">Car + Bike</option>
                          <option value="NONE">None</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2 flex gap-6 mt-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_gated"
                          checked={newProperty.is_gated}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Gated Security</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="has_lift"
                          checked={newProperty.has_lift}
                          onChange={handleInputChange}
                          className="w-5 h-5 accent-violet-600 rounded-lg"
                        />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Elevator Access</span>
                      </label>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Orientation</label>
                  <select name="orientation" value={newProperty.orientation} onChange={handleInputChange} className={inputClasses}>
                    <option value="North">North</option><option value="South">South</option><option value="East">East</option><option value="West">West</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Monthly Rent (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input required name="price" value={newProperty.price} onChange={handleInputChange} type="number" placeholder="2500" className={`${numberInputClasses} pl-12`} />
                  </div>
                </div>
              </div>

              {!["PG", "COMMERCIAL_SHOP", "OFFICE_SPACE"].includes(newProperty.type) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users size={12} /> Bedrooms</label>
                    <input required name="bedrooms" value={newProperty.bedrooms} onChange={handleInputChange} type="number" placeholder="0" className={numberInputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Wrench size={12} /> Bathrooms</label>
                    <input required name="bathrooms" value={newProperty.bathrooms} onChange={handleInputChange} type="number" placeholder="0" className={numberInputClasses} />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Maximize size={12} /> Area (Sqft)</label>
                    <input required name="area" value={newProperty.area} onChange={handleInputChange} type="number" placeholder="1850" className={numberInputClasses} />
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400"><ImageIcon size={24} /></div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Visual Showcase</h4>
            </div>
            <div className="relative border-2 border-dashed border-slate-800 rounded-[2rem] p-10 text-center hover:border-violet-500 transition-all group/upload">
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div>
                  <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{uploadingImages ? 'Uploading...' : 'Upload Property Images'}</p>
                  <p className="text-sm text-slate-500">Drag & drop or click to browse files (Multiple images allowed)</p>
                </div>
              </div>
            </div>

            {newProperty.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {newProperty.images.map((img, i) => (
                  <div key={i} className={`relative group/img overflow-hidden rounded-2xl border-2 transition-all ${img.is_cover ? 'border-violet-500 shadow-xl shadow-violet-500/10' : 'border-slate-800'}`}>
                    <img src={img.url} className="w-full h-48 object-cover group-hover/img:scale-105 transition-transform duration-700" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3 p-4">
                      <button type="button" onClick={() => handleSetCover(i)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${img.is_cover ? 'bg-violet-600 text-white' : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'}`}>
                        {img.is_cover ? 'Active Cover' : 'Set as Cover'}
                      </button>
                      <button type="button" onClick={() => handleRemoveImage(i)} className="p-2 rounded-lg bg-rose-500/20 text-rose-500 border border-rose-500/20 hover:bg-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                    {img.is_cover && (
                      <div className="absolute top-4 left-4 bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full">Primary Cover</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* New Financials & Policies Section */}
          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 rounded-xl bg-teal-600/20 text-teal-400"><IndianRupee size={24} /></div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Financials & Policies</h4>
            </div>

            {/* Financial Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Security Deposit (₹)</label>
                <input required name="security_deposit" value={newProperty.security_deposit || ''} onChange={handleInputChange} type="number" placeholder="50000" className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Rent Escalation Clause</label>
                <input name="rent_escalation_desc" value={newProperty.rent_escalation_desc || ''} onChange={handleInputChange} type="text" placeholder="e.g. 5% increase every Jan" className={inputClasses} />
              </div>
            </div>

            {/* Bank Details */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-4">
              <h5 className="font-bold text-sm uppercase tracking-widest text-slate-500">Bank Details (For Tenant View)</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Bank Account No.</label>
                  <input name="bank_account" value={newProperty.bank_account || ''} onChange={handleInputChange} type="text" placeholder="XXXXXXXXXXXX" className={inputClasses} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">IFSC Code</label>
                  <input name="ifsc_code" value={newProperty.ifsc_code || ''} onChange={handleInputChange} type="text" placeholder="HDFC0001234" className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">UPI ID</label>
                  <input name="upi_id" value={newProperty.upi_id || ''} onChange={handleInputChange} type="text" placeholder="name@bank" className={inputClasses} />
                </div>
              </div>
            </div>

            {/* Late Fees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Rent Due Day (of Month)</label>
                <input required name="rent_due_day" value={newProperty.rent_due_day || '5'} onChange={handleInputChange} type="number" min="1" max="31" className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Late Penalty (₹ Per Day)</label>
                <input required name="late_penalty_amount" value={newProperty.late_penalty_amount || '0'} onChange={handleInputChange} type="number" placeholder="500" className={inputClasses} />
              </div>
            </div>

            {/* Guidelines */}
            <div>
              <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Property Guidelines / Rules</label>
              <textarea name="guidelines" value={newProperty.guidelines || ''} onChange={handleInputChange} rows="4" placeholder="- No loud music after 10 PM&#10;- Parking sticker mandatory&#10;- Garbage collection at 9 AM" className={inputClasses}></textarea>
              <p className="text-xs text-slate-500 mt-2">List rules clearly on separate lines.</p>
            </div>

          </Card>
        </div>

        <div className="space-y-8">
          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400"><Sparkles size={24} /></div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Amenities</h4>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {AMENITIES_LIST.map((item) => {
                const isSelected = newProperty.amenities.includes(item.id);
                return (
                  <button key={item.id} type="button" onClick={() => handleToggleAmenity(item.id)} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isSelected
                    ? (isDarkMode ? 'bg-violet-600/10 border-violet-500 text-white' : 'bg-violet-50 border-violet-500 text-violet-700')
                    : (isDarkMode ? 'bg-slate-950 border-slate-800 text-white hover:border-slate-700' : 'bg-white border-slate-200 text-black hover:border-slate-300 hover:bg-slate-50')
                    }`}>
                    <div className="flex items-center gap-3"><item.icon size={18} className={isSelected ? 'text-violet-400' : ''} /><span className="text-sm font-bold">{item.name}</span></div>
                    {isSelected ? <CheckCircle2 size={16} className="text-violet-400" /> : <div className={`w-4 h-4 rounded-full border ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}></div>}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
              <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400"><MapPin size={24} /></div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Location</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">City</label>
                <input required name="city" value={newProperty.city} onChange={handleInputChange} type="text" placeholder="Los Angeles" className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Locality</label>
                <input required name="locality" value={newProperty.locality} onChange={handleInputChange} type="text" placeholder="Beverly Hills" className={inputClasses} />
              </div>
              <div>
                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Full Address</label>
                <textarea required name="fullAddress" value={newProperty.fullAddress} onChange={handleInputChange} rows="3" placeholder="123 Luxury Ave..." className={inputClasses}></textarea>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" name="featured" checked={newProperty.featured} onChange={handleInputChange} className="w-5 h-5 accent-violet-600" />
                <div><p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Featured Property</p><p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Show in priority listings</p></div>
              </label>
            </div>
          </Card>
        </div>
      </div >
    </form >
  );
};


const SettingsView = ({ user, isDarkMode, handleLogout }) => (
  <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex items-center gap-4 mb-8">
      <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white border text-black'}`}><Settings size={24} /></div>
      <div><h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Settings</h2><p className={`font-medium ${isDarkMode ? 'text-slate-500' : 'text-black'}`}>Manage your account preferences</p></div>
    </div>

    <Card isDarkMode={isDarkMode} className="p-8 space-y-8">
      <div className="flex items-center gap-6 pb-8 border-b border-slate-800/50">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl">{user.name.charAt(0)}</div>
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300"><Edit2 className="text-white" size={20} /></div>
        </div>
        <div className="space-y-1">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
          <p className="text-slate-500 font-medium">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">Verified Landlord</span>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-bold uppercase tracking-wider border border-violet-500/20">Pro Plan</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><BellRing size={20} /></div>
            <div><h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Notifications</h4><p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-black'}`}>Receive alerts about payments and maintenance</p></div>
          </div>
          <div className="w-12 h-6 rounded-full bg-violet-600/20 border border-violet-600/50 relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-violet-500 shadow-lg"></div></div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><Shield size={20} /></div>
            <div><h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Two-Factor Auth</h4><p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-black'}`}>Secure your account with 2FA</p></div>
          </div>
          <div className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-slate-500"></div></div>
        </div>
      </div>
      <div className="pt-6 border-t border-slate-800/50">
        <Button isDarkMode={isDarkMode} onClick={handleLogout} variant="danger" icon={LogOut} className="w-full justify-center">Sign Out</Button>
      </div>
    </Card>
  </div>
);

const downloadReceipt = (tenant) => {
  const doc = new jsPDF();
  const date = new Date();

  // Set fonts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(139, 92, 246); // Violet color
  doc.text("RENTEASE", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Official Payment Receipt", 105, 30, { align: "center" });

  // Line
  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(20, 35, 190, 35);

  // Content
  doc.setFontSize(10);
  doc.setTextColor(50);

  const startY = 50;
  const lineHeight = 10;

  doc.setFont("helvetica", "bold");
  doc.text("Date Issued:", 20, startY);
  doc.setFont("helvetica", "normal");
  doc.text(date.toLocaleDateString(), 80, startY);

  doc.setFont("helvetica", "bold");
  doc.text("Receipt No:", 20, startY + lineHeight);
  doc.setFont("helvetica", "normal");
  doc.text(Math.floor(Math.random() * 1000000).toString().padStart(6, '0'), 80, startY + lineHeight);

  doc.setFont("helvetica", "bold");
  doc.text("Tenant Name:", 20, startY + lineHeight * 2);
  doc.setFont("helvetica", "normal");
  doc.text(tenant.name || "", 80, startY + lineHeight * 2);

  doc.setFont("helvetica", "bold");
  doc.text("Property:", 20, startY + lineHeight * 3);
  doc.setFont("helvetica", "normal");
  doc.text(tenant.property_name || "", 80, startY + lineHeight * 3);

  doc.setFont("helvetica", "bold");
  doc.text("Payment For:", 20, startY + lineHeight * 4);
  doc.setFont("helvetica", "normal");
  doc.text(`${date.toLocaleString('default', { month: 'long', year: 'numeric' })} Rent`, 80, startY + lineHeight * 4);

  // Amount Box
  doc.setDrawColor(5, 150, 105); // Emerald
  doc.setLineWidth(1);
  doc.rect(20, startY + lineHeight * 6, 170, 20);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(5, 150, 105);
  doc.text("AMOUNT PAID", 30, startY + lineHeight * 7 + 2);
  doc.text(`₹${parseFloat(tenant.monthly_rent).toLocaleString()}`, 150, startY + lineHeight * 7 + 2);

  // Stamp
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(30);
  doc.text("PAID", 105, 150, { align: "center", angle: 25, blendMode: "multiply" });
  doc.setDrawColor(5, 150, 105);
  doc.circle(105, 145, 25);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Thank you for your payment. This is a computer-generated receipt.", 105, 260, { align: "center" });
  doc.text("Generated via RentEase Platform", 105, 265, { align: "center" });

  doc.save(`Rent_Receipt_${tenant.name.replace(/\s+/g, '_')}_${date.toISOString().slice(0, 10)}.pdf`);
};


const LandlordFinanceView_Deprecated = ({ isDarkMode, tenants, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.property_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const status = tenant.status || 'PENDING';
    const matchesStatus = statusFilter === 'All Status' ||
      (statusFilter === 'Paid' && status === 'PAID') ||
      (statusFilter === 'Overdue' && status === 'OVERDUE') ||
      (statusFilter === 'Pending' && status === 'PENDING');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'}`}>Rent Management</h2>
          <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>Track payments and send reminders</p>
        </div>
        <Button isDarkMode={isDarkMode} icon={Bell} className="bg-indigo-600 hover:bg-indigo-700 text-white">Send Reminders</Button>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Filter Payments</h4>
        <div className="flex gap-4">
          <div className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <Search size={20} className={`${isDarkMode ? 'text-slate-400' : 'text-black'}`} />
            <input
              type="text"
              placeholder="Search payments..."
              className={`bg-transparent outline-none w-full ${isDarkMode ? 'text-white' : 'text-black'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-3 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-black'}`}
          >
            <option>All Status</option>
            <option>Paid</option>
            <option>Overdue</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Payment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants?.length > 0 ? (
          filteredTenants.map((tenant, i) => {
            const isPaid = tenant.status?.toUpperCase() === 'PAID';
            const isOverdue = tenant.status?.toUpperCase() === 'OVERDUE';
            const statusColor = isPaid ? 'bg-emerald-500/10 text-emerald-500' :
              isOverdue ? 'bg-rose-500/10 text-rose-500' :
                'bg-amber-500/10 text-amber-500';

            // Calculate Due Date
            const startDate = tenant.start_date ? new Date(tenant.start_date) : new Date();
            const minDueDate = new Date(startDate);
            minDueDate.setDate(minDueDate.getDate() + 30);

            const today = new Date();
            let targetMonth = today.getMonth();
            let targetYear = today.getFullYear();

            // If paid, aim for next month
            if (isPaid) {
              targetMonth += 1;
            }

            // Handle year rollover
            if (targetMonth > 11) {
              targetMonth = 0;
              targetYear += 1;
            }

            const day = tenant.rent_due_date || 1;
            let finalDate = new Date(targetYear, targetMonth, day);

            // Enforce strictly after 30 days from start date
            while (finalDate < minDueDate) {
              finalDate.setMonth(finalDate.getMonth() + 1);
            }

            const dd = String(finalDate.getDate()).padStart(2, '0');
            const mm = String(finalDate.getMonth() + 1).padStart(2, '0');
            const yyyy = finalDate.getFullYear();
            const dueDateDisplay = `${dd}-${mm}-${yyyy}`;

            return (
              <Card isDarkMode={isDarkMode} key={tenant.id || i} className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>₹{parseFloat(tenant.monthly_rent).toLocaleString()}</h3>
                  <button
                    onClick={() => onUpdateStatus(tenant.id, tenant.status)}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${statusColor} border border-current`}
                  >
                    {tenant.status || 'PENDING'}
                  </button>
                </div>

                <div className="space-y-1">
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Tenant: {tenant.name}</p>
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>Property: {tenant.property_name}</p>
                </div>

                <div className={`space-y-2 text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>
                  <div className="flex items-center gap-2"><Calendar size={14} /> Due: {dueDateDisplay}</div>
                  {isPaid ? (
                    <div className="flex items-center gap-2 text-emerald-500"><CheckCircle2 size={14} /> Paid: On Time</div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-500 font-bold"><AlertCircle size={14} /> Unpaid</div>
                  )}
                </div>

                <Button
                  variant="outline"
                  icon={Download}
                  className={`w-full text-xs border-slate-700 ${!isPaid ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!isPaid}
                  onClick={() => isPaid && downloadReceipt(tenant)}
                >
                  Receipt
                </Button>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-10 text-slate-500">No payment records found.</div>
        )}
      </div>
    </div>
  );
};

const LandlordRequestsView = ({ complaints, isDarkMode, showNotificationToast, onViewDetails, onUpdateStatus }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="flex justify-between items-end">
      <div><h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>Issues at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Property</span></h2><p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>Handle tenant issues and repair tickets.</p></div>
      <div className="flex gap-3">
        <Button isDarkMode={isDarkMode} variant="outline" icon={Filter}>Filter</Button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4">
      {complaints.length === 0 ? (
        <Card isDarkMode={isDarkMode} className="p-12 text-center text-slate-500">
          <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={40} className="text-slate-600" /></div>
          <h3 className="text-xl font-bold mb-2">All Caught Up!</h3>
          <p>No open maintenance requests at the moment.</p>
        </Card>
      ) : (
        complaints.map(req => (
          <Card key={req.id} isDarkMode={isDarkMode} className="p-6 group hover:border-violet-500/40 transition-all">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {req.property_cover_image || req.propertyImage ? (
                    <img src={req.property_cover_image || req.propertyImage} className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-sm" alt="Property" />
                  ) : (
                    <div className={`p-3 rounded-2xl ${req.status === 'Open' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      <Wrench size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{req.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${req.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{req.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500/80 uppercase tracking-wider">
                    <Building size={12} />
                    <span>{req.property_name} • {req.flat_number || req.unit || 'Unit'}</span>
                  </div>
                  <p className={`text-sm mb-2 font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>{req.description}</p>
                  <div className={`flex items-center gap-4 text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-black'}`}>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {req.formatted_date || req.date}</span>
                    <span className={`flex items-center gap-1 ${req.priority_level === 'Critical' || req.priority_level === 'High' ? 'text-rose-500' : 'text-amber-500'}`}><AlertCircle size={12} /> {req.priority_level || 'Low'} Priority</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button isDarkMode={isDarkMode} variant="outline" className="flex-1 md:flex-none" onClick={() => onViewDetails(req.id)}>Details</Button>
                {/* Removed View Details/Resolved button as requested */}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  </div>
);

const EditPropertyModal = ({ isOpen, onClose, property, onUpdate, isDarkMode }) => {
  if (!isOpen || !property) return null;

  const [formData, setFormData] = useState({
    title: property.name || "",
    description: property.description || "",
    property_type: property.type || "Apartment",
    price: property.rent || 0,
    orientation: property.orientation || "North",
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area_sqft: property.area_sqft || 0,
    city: property.city || "",
    locality: property.locality || "",
    address: property.address || "",
    is_featured: property.is_featured || false,
    security_deposit: property.security_deposit || 0,
    rent_escalation_desc: property.rent_escalation_desc || "",
    bank_account: property.bank_account || "",
    ifsc_code: property.ifsc_code || "",
    upi_id: property.upi_id || "",
    rent_due_day: property.rent_due_day || 5,
    late_penalty_amount: property.late_penalty_amount || 0,
    guidelines: property.guidelines || ""
  });

  const [images, setImages] = useState(property.images || []);
  const [amenities, setAmenities] = useState(property.amenities?.map(a => a.id) || []);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const uploadToCloudinary = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "First_project");
    const res = await fetch("https://api.cloudinary.com/v1_1/dghdwtef5/image/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImages(true);
    try {
      const uploadedImages = [];
      const existingImageCount = images.length;
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        uploadedImages.push({ url, is_cover: existingImageCount === 0 && i === 0 });
      }
      setImages(prev => [...prev, ...uploadedImages]);
      toast.success("Images uploaded");
    } catch (err) { console.error(err); toast.error("Upload failed"); }
    finally { setUploadingImages(false); }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    if (images[index].is_cover && updated.length > 0) updated[0].is_cover = true;
    setImages(updated);
  };

  const handleSetCover = (index) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_cover: i === index })));
  };

  const handleToggleAmenity = (id) => {
    setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...property, ...formData, images, amenities });
  };

  const inputClass = `w-full px-4 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card isDarkMode={isDarkMode} className="w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 scrollbar-hide">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Property</h3>
          <button onClick={onClose}><X className="text-slate-500 hover:text-rose-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Title</label><input name="title" value={formData.title} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Type</label><select name="property_type" value={formData.property_type} onChange={handleChange} className={inputClass}><option value="Apartment">Apartment</option><option value="House">House</option><option value="Commercial">Commercial</option></select></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Area (sqft)</label><input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Bedrooms</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass}></textarea></div>

          {/* Images Section */}
          <div className="space-y-2">
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Images</h4>
            <div className="relative border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-violet-500 transition-all">
              <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
              <p className="text-sm text-slate-500">{uploadingImages ? 'Uploading...' : 'Click to Upload Images'}</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {images.map((img, i) => (
                  <div key={i} className={`relative group rounded-lg overflow-hidden border ${img.is_cover ? 'border-violet-500' : 'border-slate-800'}`}>
                    <img src={img.image_url || img.url} className="w-full h-24 object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <button type="button" onClick={() => handleSetCover(i)} className="p-1 bg-violet-600 rounded text-white"><CheckCircle2 size={14} /></button>
                      <button type="button" onClick={() => handleRemoveImage(i)} className="p-1 bg-rose-500 rounded text-white"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities Section */}
          <div className="space-y-2">
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Amenities</h4>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_LIST.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleAmenity(item.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-sm text-left transition-all ${amenities.includes(item.id) ? 'bg-violet-600/10 border-violet-500 text-violet-500' : 'border-slate-800 text-slate-500'}`}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">City</label><input name="city" value={formData.city} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Locality</label><input name="locality" value={formData.locality} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Full Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={inputClass}></textarea></div>

          {/* Financials & Policies (Edit) */}
          <div className="space-y-4 pt-4 border-t border-slate-800/50">
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financials & Policies</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-slate-500 uppercase">Security Deposit</label><input type="number" name="security_deposit" value={formData.security_deposit || ''} onChange={handleChange} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Escalation</label><input name="rent_escalation_desc" value={formData.rent_escalation_desc || ''} onChange={handleChange} className={inputClass} /></div>

              <div><label className="text-xs font-bold text-slate-500 uppercase">Bank Account</label><input name="bank_account" value={formData.bank_account || ''} onChange={handleChange} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">IFSC Code</label><input name="ifsc_code" value={formData.ifsc_code || ''} onChange={handleChange} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">UPI ID</label><input name="upi_id" value={formData.upi_id || ''} onChange={handleChange} className={inputClass} /></div>

              <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Due Day</label><input type="number" name="rent_due_day" value={formData.rent_due_day || ''} onChange={handleChange} className={inputClass} /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase">Late Penalty (₹)</label><input type="number" name="late_penalty_amount" value={formData.late_penalty_amount || ''} onChange={handleChange} className={inputClass} /></div>
            </div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Guidelines</label><textarea name="guidelines" value={formData.guidelines || ''} onChange={handleChange} rows="3" className={inputClass}></textarea></div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-800/50">
            <Button onClick={onClose} variant="secondary" className="flex-1" isDarkMode={isDarkMode}>Cancel</Button>
            <Button type="submit" className="flex-1" isDarkMode={isDarkMode}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const MaintenanceDetailsView = ({ complaint, onBack, isDarkMode, onUpdateStatus }) => {
  const navigate = useNavigate(); // Hook for navigation

  if (!complaint) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-10 duration-500">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`p-2.5 rounded-xl border transition-all ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={() => {
              // Navigate to Home Services with address state
              console.log("Navigating from LandlordDashboard with complaint:", complaint);

              const addressParts = [
                complaint.property_name,
                complaint.flat_number,
                complaint.building_name,
                complaint.locality,
                complaint.city,
                complaint.address
              ].filter(part => part && part.trim() !== '');

              const formattedAddress = addressParts.join(', ');
              console.log("Formatted address:", formattedAddress);

              navigate('/home-services', {
                state: {
                  address: formattedAddress,
                  fromLandlord: true,
                  property_image: complaint.property_cover_image || complaint.propertyImage
                }
              });
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-600/20 active:scale-95 transition-all"
          >
            <Calendar size={18} /> Book Service
          </button>
        </div>

        {complaint.property_cover_image || complaint.propertyImage ? (
          <img src={complaint.property_cover_image || complaint.propertyImage} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-lg" alt="Property" />
        ) : null}

        <div>
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{complaint.title}</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1"><Building size={14} /> {complaint.property_name || complaint.propertyName}</span>
            <span>•</span>
            <span>{complaint.flat_number || complaint.unit || 'Unit'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/50 pb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${complaint.status === 'Open' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                  <Wrench size={24} />
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Issue Description</h4>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${complaint.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{complaint.status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date Reported</p>
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{complaint.formatted_date || complaint.date}</p>
              </div>
            </div>

            <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {complaint.description}
            </p>

            <div>
              <h5 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <ImageIcon size={18} className="text-violet-500" />
                Proof of Issue
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {complaint.images && complaint.images.length > 0 ? (
                  complaint.images.map((img, idx) => (
                    <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-slate-800 cursor-pointer">
                      <img src={img} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize className="text-white" size={24} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-800 rounded-xl">
                    <p className="text-slate-500 text-sm">No images provided.</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card isDarkMode={isDarkMode} className="p-6 space-y-6">
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Problem Info</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                <span className="text-slate-500 text-sm">Category</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{complaint.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                <span className="text-slate-500 text-sm">Priority</span>
                <span className={`font-bold ${['High', 'Critical'].includes(complaint.priority_level) ? 'text-rose-500' : 'text-amber-500'}`}>{complaint.priority_level || 'Low'}</span>
              </div>
              {complaint.status === 'Resolved' ? (
                <div className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center gap-2 font-bold">
                  <CheckCircle2 size={20} /> Resolved
                </div>
              ) : (
                <div className="w-full py-3 rounded-xl bg-slate-500/10 text-slate-500 border border-slate-500/20 flex items-center justify-center gap-2 font-bold cursor-not-allowed">
                  Resolution Pending Tenant
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};




/* --- ADD RESIDENT MODAL --- */
const AddResidentModal = ({ isOpen, onClose, tenantId, onResidentAdded, isDarkMode, showNotificationToast }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    full_name: "",
    relation: "Other",
    phone: "",
    email: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        relation: formData.relation,
        tenant_emailid: formData.email || null,
      };

      await axios.post(
        `http://localhost:5000/api/tenants/${tenantId}/members`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onResidentAdded();
      onClose();
      toast.success("Resident added successfully");
    } catch (error) {
      console.error("Error adding resident:", error);
      toast.error(error.response?.data?.message || "Failed to add resident");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl transform transition-all scale-100 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add Resident</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Add a new member to this unit</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
            <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
              <User size={18} className="text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="e.g. John Doe"
                className="bg-transparent border-none outline-none w-full text-sm font-medium"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Relation</label>
            <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
              <Users size={18} className="text-slate-400 mr-3" />
              <select
                className={`bg-transparent border-none outline-none w-full text-sm font-medium appearance-none cursor-pointer ${isDarkMode ? 'text-white' : 'text-slate-900'} [&>option]:text-slate-900`}
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              >
                <option value="Other">Other</option>
                <option value="Husband">Husband</option>
                <option value="Wife">Wife</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Friend">Friend</option>
              </select>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
              <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
                <Phone size={18} className="text-slate-400 mr-3" />
                <input
                  type="tel"
                  placeholder="Optional"
                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
              <div className={`flex items-center px-4 py-3 rounded-xl border transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 focus-within:border-violet-500' : 'bg-slate-50 border-slate-200 focus-within:border-violet-500'}`}>
                <Mail size={18} className="text-slate-400 mr-3" />
                <input
                  type="email"
                  placeholder="Optional"
                  className="bg-transparent border-none outline-none w-full text-sm font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Add Resident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* --- TENANT DETAIL COMPONENT --- */

const TenantDetailView = ({ tenants, selectedTenantId, isDarkMode, setActiveTab, setSelectedTenantId, showNotificationToast, onUpdateStatus }) => {
  const tenant = tenants.find((t) => t.id === selectedTenantId);
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isAddResidentModalOpen, setIsAddResidentModalOpen] = useState(false);

  // Financial State
  // occupancyType removed as we derive directly from tenant.tenant_type

  useEffect(() => {
    if (tenant?.id) {
      fetchMembers();
    }
  }, [tenant?.id]);


  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:5000/api/tenants/${tenant.id}/members`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
      showNotificationToast("Failed to load resident details", "error");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleDeleteResident = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/tenant-members/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotificationToast("Resident deleted successfully", "success");
      fetchMembers();
    } catch (error) {
      console.error("Error deleting resident:", error);
      showNotificationToast("Failed to delete resident", "error");
    }
  };

  // When the page is opened directly and no tenant is in state
  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-slate-400 text-sm">No tenant selected.</p>
        <Button
          isDarkMode={isDarkMode}
          variant="outline"
          onClick={() => setActiveTab('tenants')}
        >
          Back to Tenants
        </Button>
      </div>
    );
  }

  const totalRent = tenant.monthly_rent || 0;
  const totalMembersCount = members.length || 1; // Avoid divide by zero
  // Ensure accurate split calculation
  const splitRentAmount = (totalRent / totalMembersCount).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700 pb-20">
      <AddResidentModal
        isOpen={isAddResidentModalOpen}
        onClose={() => setIsAddResidentModalOpen(false)}
        tenantId={tenant.id}
        onResidentAdded={fetchMembers}
        isDarkMode={isDarkMode}
        showNotificationToast={showNotificationToast}
      />

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setActiveTab('tenants');
            setSelectedTenantId(null);
          }}
          className={`p-2.5 rounded-xl border transition-all ${isDarkMode
            ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Tenant Profile
          </h2>
          <p className="text-sm text-slate-500 font-medium">Viewing details for {tenant.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Profile & Lease */}
        <div className="space-y-6">
          <Card isDarkMode={isDarkMode} className="p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600" />
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute -inset-2 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full blur opacity-20" />
              <div className="relative w-full h-full rounded-full border-4 border-slate-900 shadow-2xl flex items-center justify-center bg-slate-800">
                <span className="text-3xl font-black text-white">{tenant.name?.charAt(0)}</span>
              </div>
            </div>
            <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h3>
            <div className="flex items-center justify-center gap-2 mb-6 text-violet-400">
              <Home size={16} />
              <p className="text-sm font-bold">{tenant.property_name}</p>
            </div>
          </Card>

          <Card isDarkMode={isDarkMode} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-sm text-slate-400 uppercase tracking-widest">Lease Terms</h4>
              <button
                onClick={() => onUpdateStatus(tenant.id, tenant.status)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider transition-all hover:scale-105 active:scale-95 ${tenant.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}
              >
                {tenant.status || 'UNPAID'}
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-500 text-sm">Start Date</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {tenant.start_date ? new Date(tenant.start_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-500 text-sm">Monthly Rent</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  ₹{totalRent.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-800">
                <span className="text-slate-500 text-sm">Occupancy</span>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.tenant_type || 'FAMILY'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Financial & Residents */}
        <div className="space-y-6">
          {/* Financial Controls */}
          <Card isDarkMode={isDarkMode} className={`p-8 border-violet-500/20 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-indigo-900/20' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><IndianRupee size={24} /></div>
                <div>
                  <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Controls</h4>
                  <p className="text-xs text-slate-400 font-medium">Manage rent distribution</p>
                </div>
              </div>
              <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800">
                <div
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all bg-violet-600 text-white shadow-lg`}
                >
                  {tenant.tenant_type || 'FAMILY'}
                </div>
              </div>
            </div>

            {tenant.tenant_type === 'BACHELORS' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className={`p-6 rounded-[2rem] border border-violet-500/10 text-center animate-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Split Amount</p>
                  <h2 className="text-4xl font-black text-emerald-400">₹{splitRentAmount}</h2>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Per Resident ({totalMembersCount})</p>
                </div>
                <div className="space-y-4">
                  <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Bachelor split distributed equally across all <span className="text-violet-500">{totalMembersCount}</span> residents.
                  </p>
                </div>
              </div>
            ) : (
              <div className={`p-6 rounded-[2rem] border border-violet-500/10 text-center animate-in zoom-in-95 duration-500 ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Amount</p>
                <h2 className="text-4xl font-black text-emerald-400">₹{totalRent.toLocaleString()}</h2>
                <p className="text-xs text-slate-400 mt-2 font-medium">Full Property Rent</p>
              </div>
            )}
          </Card>

          {/* Resident Management */}
          <Card isDarkMode={isDarkMode} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400"><Users size={20} /></div>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Resident Management</h3>
              </div>
              <Button
                isDarkMode={isDarkMode}
                onClick={() => setIsAddResidentModalOpen(true)}
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20"
                icon={Plus}
              >
                Add Resident
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {isLoadingMembers ? (
                <div className="text-center py-8 text-slate-500">Loading residents...</div>
              ) : members.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center">
                  <p className="text-slate-500 text-sm">No residents found.</p>
                </div>
              ) : (
                members.map((member, i) => (
                  <div key={member.id || i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all group ${isDarkMode ? 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${member.is_primary ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-800 text-slate-400'}`}>
                        {member.full_name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.full_name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {member.is_primary && (
                            <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider">Primary Tenant</span>
                          )}
                          {!member.is_primary && (
                            <span className={`text-[10px] font-bold uppercase text-slate-500 px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>{member.relation || 'Resident'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {!member.is_primary && (
                      <button
                        onClick={() => handleDeleteResident(member.id)}
                        className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-rose-900/30 text-slate-500 hover:text-rose-500' : 'hover:bg-rose-50 text-slate-400 hover:text-rose-500'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div >
    </div >
  );
};



const NotificationDropdown = ({ notifications, markAsRead, markAllAsRead, isDarkMode }) => (
  <div className={`absolute top-12 right-0 w-96 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
    <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
      <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
      {notifications.some(n => !n.is_read) && (
        <button onClick={markAllAsRead} className="text-xs font-bold text-violet-500 hover:text-violet-600">Mark all read</button>
      )}
    </div>
    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-slate-500">
          <BellRing size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No new notifications</p>
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b transition-colors cursor-pointer ${n.is_read ? (isDarkMode ? 'bg-slate-900/50 opacity-60' : 'bg-white opacity-60') : (isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100')} ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex gap-3">
              <div className={`mt-1 p-2 rounded-full h-fit ${n.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-violet-500/10 text-violet-500'}`}>
                {n.type === 'payment' ? <CreditCard size={14} /> : <MessageSquare size={14} />}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);


/* --- MOVED COMPONENTS --- */

const LANDLORD_MENU_FINAL = [
  { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
  { id: 'properties', icon: Building, label: 'Properties' },
  { id: 'add-property', icon: PlusCircle, label: 'Add Property' },
  { id: 'tenants', icon: Users, label: 'Tenants' },
  { id: 'requests', icon: Wrench, label: 'Issues at Property' },
  { id: 'finance', icon: IndianRupee, label: 'Financials' },
  { id: 'bookings', icon: Calendar, label: 'Bookings' },
];

const TENANT_MENU = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'my-property', icon: Building, label: 'My Property' },
  { id: 'payments', icon: CreditCard, label: 'Payments' },
  { id: 'complaints', icon: Wrench, label: 'Complaints' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const LandlordBookingsView = ({ isDarkMode, bookings, onUpdateStatus }) => {
  const [filter, setFilter] = useState('All');

  const filteredBookings = filter === 'All'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Bookings</h2>
          <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage applicant requests and vetting</p>
        </div>
        <div className={`flex gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
          {['All', 'Pending', 'Approved', 'Rejected'].map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === opt
                ? 'bg-violet-600 text-white shadow-lg'
                : isDarkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <Card isDarkMode={isDarkMode} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Applicant</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date Requested</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>User Type</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <Home size={16} className="text-violet-500" />
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.propertyName}</p>
                        <p className="text-xs text-slate-500">{booking.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{booking.tenantName}</span>
                      {booking.email && <span className="text-xs text-slate-500">{booking.email}</span>}
                    </div>
                  </td>
                  <td className={`p-6 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.date}</td>
                  <td className={`p-6 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.userType}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      {booking.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'Approved')}
                            className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"
                            title="Approve"
                          >
                            <UserCheck size={18} />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(booking.id, 'Rejected')}
                            className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"
                            title="Reject"
                          >
                            <UserX size={18} />
                          </button>
                        </>
                      )}
                      {booking.status !== 'Pending' && (
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'Pending')}
                          className="text-xs font-bold text-slate-500 hover:text-violet-500 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
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

const AddTenantModal = ({ isOpen, onClose, properties, onSuccess, isDarkMode }) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({
    propertyId: "",
    full_name: "",
    email: "",
    phone: "",
    relation: "Self",
    tenant_type: "Family",
    monthly_rent: "",
    payment_status: "PENDING",
    start_date: "",
    rent_due_date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'propertyId') {
      const selectedProp = properties.find(p => p.id == value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        monthly_rent: selectedProp ? selectedProp.price : prev.monthly_rent
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      const payload = {
        tenant_type: formData.tenant_type,
        monthly_rent: parseFloat(formData.monthly_rent),
        payment_status: formData.payment_status,
        start_date: formData.start_date,
        rent_due_date: formData.rent_due_date,
        primary_member: {
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          relation: formData.relation
        }
      };

      await axios.post(
        `http://localhost:5000/api/tenants/property/${formData.propertyId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onSuccess();
      onClose();
      toast.success("Tenant added successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to add tenant");
    }
  };

  const inputClass = `w-full px-4 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

  return (
    <div className="fixed top-20 inset-x-0 bottom-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card isDarkMode={isDarkMode} className="w-full max-w-lg max-h-full overflow-y-auto scrollbar-hide p-6 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center relative z-10">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Add New Tenant</h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className={`p-2 rounded-full cursor-pointer transition-colors relative z-20 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-rose-500'}`}
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Select Property</label>
            <select required name="propertyId" value={formData.propertyId} onChange={handleChange} className={inputClass}>
              <option value="">-- Select Property --</option>
              {properties.filter(p => p.status === 'Available').map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required name="full_name" value={formData.full_name} onChange={handleChange} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Relation</label>
            <select name="relation" value={formData.relation} onChange={handleChange} className={inputClass}>
              <option value="Self">Self</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
              <select name="tenant_type" value={formData.tenant_type} onChange={handleChange} className={inputClass}>
                <option value="Family">Family</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Couple">Couple</option>
              </select>
            </div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Monthly Rent</label><input required type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} className={inputClass} /></div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Payment Status</label>
            <select name="payment_status" value={formData.payment_status} onChange={handleChange} className={inputClass}>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Due Date</label><input required type="date" name="rent_due_date" value={formData.rent_due_date} onChange={handleChange} className={inputClass} /></div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full justify-center" isDarkMode={isDarkMode}>Add Tenant</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const EditTenantModal = ({ isOpen, onClose, tenant, onUpdate, isDarkMode }) => {
  if (!isOpen || !tenant) return null;
  const [formData, setFormData] = useState({
    name: tenant.name || "",
    phone: tenant.phone || "",
    email: tenant.email || "",
    monthly_rent: tenant.monthly_rent || "",
    tenant_type: tenant.tenant_type || "Family",
    payment_status: tenant.status || "UNPAID",
    relation: tenant.relation || "Self",
    start_date: tenant.start_date ? new Date(tenant.start_date).toISOString().split('T')[0] : "",
    rent_due_date: tenant.rent_due_date || ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...tenant, ...formData });
  };

  const inputClass = `w-full px-4 py-2 rounded-xl border outline-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card isDarkMode={isDarkMode} className="w-full max-w-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Tenant</h3>
          <button onClick={onClose}><X className="text-slate-500 hover:text-rose-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs font-bold text-slate-500 uppercase">Full Name</label><input required name="name" value={formData.name} onChange={handleChange} className={inputClass} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Phone</label><input required name="phone" value={formData.phone} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input name="email" value={formData.email} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Relation</label>
            <select name="relation" value={formData.relation} onChange={handleChange} className={inputClass}>
              <option value="Self">Self</option>
              <option value="Spouse">Spouse</option>
              <option value="Child">Child</option>
              <option value="Parent">Parent</option>
              <option value="Friend">Friend</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
              <select name="tenant_type" value={formData.tenant_type} onChange={handleChange} className={inputClass}>
                <option value="FAMILY">Family</option>
                <option value="BACHELORS">Bachelors</option>
                <option value="COUPLE">Couple</option>
              </select>
            </div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Monthly Rent</label><input required type="number" name="monthly_rent" value={formData.monthly_rent} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Payment Status</label>
            <select name="payment_status" value={formData.payment_status} onChange={handleChange} className={inputClass}>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={inputClass} /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase">Rent Due Date</label><input type="number" min="1" max="31" placeholder="Day (1-31)" name="rent_due_date" value={formData.rent_due_date} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div className="pt-4 flex gap-3">
            <Button type="button" onClick={onClose} variant="secondary" className="flex-1 justify-center" isDarkMode={isDarkMode}>Cancel</Button>
            <Button type="submit" className="flex-1 justify-center" isDarkMode={isDarkMode}>Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

const LandlordTenantsView = ({
  tenants,
  fetchTenants,
  onDeleteClick,
  onEditClick,
  landlordProperties,
  fetchLandlordProperties,
  isDarkMode,
  setSelectedTenantId
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedChatTenant, setSelectedChatTenant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useParams();

  const filteredTenants = tenants.filter(tenant =>
    tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-5xl font-black tracking-tight ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400' : 'text-slate-900'}`}>
            My Tenants
          </h2>
          <p className={`mt-2 text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage your community
          </p>
        </div>
        <Button
          icon={UserPlus}
          onClick={() => setIsAddModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/30 border-none px-6 py-3 h-auto text-base rounded-2xl transition-transform active:scale-95"
        >
          Add New Tenant
        </Button>
      </div>

      {isAddModalOpen && (
        <AddTenantModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          properties={landlordProperties}
          onSuccess={() => { fetchTenants(); fetchLandlordProperties(); }}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Search Bar - Premium Floating Design */}
      <div className={`relative overflow-hidden p-1 rounded-3xl transition-all duration-300 ${isDarkMode ? 'bg-gradient-to-r from-slate-800 to-slate-900 shadow-2xl shadow-black/50' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
        <div className={`relative z-10 p-2 flex items-center gap-4`}>
          <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-violet-400' : 'bg-slate-50 text-violet-600'}`}>
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Search by name, property, or email..."
            className={`w-full bg-transparent outline-none text-lg font-bold placeholder:font-medium placeholder:text-slate-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tenant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTenants.length === 0 ? (
          <div className={`col-span-full flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-slate-50'}`}>
            <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-white text-slate-400 shadow-xl'}`}>
              <Users size={64} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Tenants Found</h3>
            <p className="text-slate-500">Add your first tenant to get started!</p>
          </div>
        ) : (
          filteredTenants.map((tenant, idx) => (
            <div
              key={tenant.id}
              className={`group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${isDarkMode
                ? 'bg-slate-900 hover:shadow-violet-900/20 ring-1 ring-slate-800 hover:ring-violet-500/50'
                : 'bg-white hover:shadow-xl hover:shadow-slate-200 ring-1 ring-slate-200 hover:ring-violet-300'
                }`}
            >
              {/* Decorative Header */}
              <div className={`h-32 w-full relative overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
                  Active
                </div>
              </div>

              {/* Avatar & Main Info */}
              <div className="relative px-8 pb-8 -mt-16 text-center">
                <div className="relative inline-block mb-4 group-hover:scale-110 transition-transform duration-500">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl relative z-10 overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-600`}>
                    {tenant.avatar_url ? (
                      <img src={tenant.avatar_url} alt={tenant.name} className="w-full h-full object-cover" />
                    ) : (
                      tenant.name?.charAt(0)
                    )}
                  </div>
                </div>

                <h3 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.name}</h3>
                {/* Info Grid */}
                {/* Info Grid */}
                <div className={`mt-6 space-y-4 text-left p-5 rounded-3xl ${isDarkMode ? 'bg-slate-950/50' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}><Home size={18} /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Property</p>
                      <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.property_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-500 shadow-sm'}`}><Phone size={18} /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Contact</p>
                      <p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenant.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedTenantId(tenant.id);
                      let basePath = location.pathname.includes('/tenant/dashboard') ? '/tenant/dashboard' : '/landlord/dashboard';
                      if (!location.pathname.includes('/tenant/dashboard')) {
                        let slug = userName;
                        if (!slug) {
                          const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                          slug = savedUser.name ? savedUser.name.toLowerCase().replace(/\s+/g, '-') : 'user';
                        }
                        basePath = `/${slug}/landlord/dashboard`;
                      }
                      navigate(`${basePath}/tenant-details?name=${encodeURIComponent(tenant.name)}`);
                    }}
                    className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/20 transition-all active:scale-95 text-sm"
                  >
                    View Details
                  </button>

                  <button onClick={() => {
                    setSelectedChatTenant(tenant);
                    setIsChatOpen(true);
                  }} className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600'}`}>
                    <MessageCircle size={18} />
                  </button>
                  <button onClick={() => onEditClick(tenant)} className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600'}`}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDeleteClick(tenant.id)} className={`p-3 rounded-xl border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-rose-950/30 text-rose-500' : 'border-slate-200 hover:bg-rose-50 text-rose-500'}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      {selectedChatTenant && (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          recipient={selectedChatTenant}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default function RentEaseDashboard() {
  const [userRole, setUserRole] = useState("landlord");
  const navigate = useNavigate();
  const location = useLocation();

  const { userName } = useParams();

  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const knownTabs = ['properties', 'add-property', 'tenants', 'requests', 'request-details', 'finance', 'settings', 'my-property', 'complaints', 'payments', 'tenant-details', 'bookings'];
  const activeTab = knownTabs.includes(lastSegment) ? lastSegment : 'dashboard';

  const setActiveTab = (tab) => {
    // If it's a tenant dashboard, usage might differ, but for landlord:
    const isTenant = location.pathname.includes('/tenant/dashboard');

    // Construct base path dynamically using userName if available
    let basePath = '/landlord/dashboard';
    if (!isTenant) {
      // Try to get username from URL params, or fallback to local storage slug
      let slug = userName;
      if (!slug) {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{ }');
        slug = savedUser.name ? savedUser.name.toLowerCase().replace(/\s+/g, '-') : 'user';
      }
      basePath = `/${slug}/landlord/dashboard`;
    } else {
      basePath = '/tenant/dashboard';
    }

    navigate(tab === 'dashboard' ? basePath : `${basePath}/${tab}`);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(() => {
    const saved = localStorage.getItem('selectedTenantId');
    return saved ? parseInt(saved) : null;
  });

  useEffect(() => {
    if (selectedTenantId) {
      localStorage.setItem('selectedTenantId', selectedTenantId);
    } else {
      localStorage.removeItem('selectedTenantId');
    }
  }, [selectedTenantId]);

  /* --- User State with Immediate Initialization for Loader --- */
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };


  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/complaints/landlord", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const [selectedComplaintId, setSelectedComplaintId] = useState(null);


  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await axios.patch(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      await axios.patch(`http://localhost:5000/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  const [tenants, setTenants] = useState(INITIAL_TENANTS_DATA);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [landlordProperties, setLandlordProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [rentDue, setRentDue] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPropertyImages, setSelectedPropertyImages] = useState([]);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);

  const handleUpdateComplaintStatus = (id, newStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    setNotificationToast({ message: `Ticket marked as ${newStatus}` });
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleUpdateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    toast.info(`Booking status updated to ${newStatus}`);
  };

  const handleUpdatePaymentStatus = async (tenantId, currentStatus) => {
    const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      const token = localStorage.getItem("accessToken");
      const tenant = tenants.find(t => t.id === tenantId);
      if (!tenant) return;

      await axios.put(`http://localhost:5000/api/tenants/${tenantId}`,
        {
          tenant_type: tenant.tenant_type,
          monthly_rent: tenant.monthly_rent,
          payment_status: newStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: newStatus } : t));
      toast.success(`Payment marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment status");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser((prev) => ({
          ...prev,
          name: parsedUser.name || prev.name,
          email: parsedUser.email || prev.email,
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);


  const fetchLandlordProperties = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/properties/myproperties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const formattedProperties = res.data.map((p) => ({
        ...p,
        id: p.id,
        name: p.title,
        address: `${p.locality}, ${p.city}`,
        type: p.property_type,
        rent: p.price,
        units: `${p.tenant_count || 0} Units`,
        status: p.status,
        image:
          p.images?.find((img) => img.is_cover)?.image_url ||
          p.images?.[0]?.image_url ||
          "https://via.placeholder.com/400",
      }));

      setLandlordProperties(formattedProperties);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        navigate("/");
      } else {
        toast.error("Failed to load properties");
      }
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchLandlordProperties();
  }, []);

  // --- Fetch Tenants ---
  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/tenants/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // --- Dashboard Stats Calculation ---
  const totalProperties = landlordProperties.length;
  // Calculate active tenants (Total residents count)
  const activeTenants = tenants.reduce((sum, t) => sum + (parseInt(t.members) || 0), 0);
  // Calculate monthly revenue from tenant rents
  const monthlyRevenue = tenants.reduce((sum, tenant) => sum + (parseFloat(tenant.monthly_rent) || 0), 0);

  // Calculate pending complaints (Open or In Progress)
  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  const REAL_STATS = [
    { label: 'Total Properties', value: totalProperties, sub: 'Property Count', icon: Building, color: 'bg-indigo-600' },
    { label: 'Active Tenants', value: activeTenants, sub: 'Occupancy Count', icon: Users, color: 'bg-blue-600' },
    { label: 'Monthly Revenue', value: `₹${monthlyRevenue.toLocaleString()}`, sub: 'Total Rent Roll', icon: CreditCard, color: 'bg-indigo-800' },
    { label: 'Pending Complaints', value: pendingComplaints, sub: 'Needs Attention', icon: AlertCircle, color: 'bg-indigo-600' }
  ];


  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [maintenanceFilter, setMaintenanceFilter] = useState("All");

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // --- Add Property State ---
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    type: "",
    price: "",
    orientation: "North",
    bedrooms: "",
    bathrooms: "",
    area: "",
    city: "",
    locality: "",
    fullAddress: "",
    featured: false,
    images: [], // {url: string, is_cover: boolean }
    amenities: [], // Array of amenity IDs
    // Apartment fields
    building_name: "",
    flat_number: "",
    floor_number: "",
    bhk: "",
    is_gated: false,
    total_floors: "",
    has_lift: false,
    parking_type: "",
    house_floor_type: ""
  });

  // --- Utility Components ---

  const StatusBadge = ({ status }) => {
    const styles = {
      Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      "Good Standing": "bg-slate-800 text-slate-300 border-slate-700",
      Occupied: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Overdue: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      Late: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Resolved: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      Open: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      Vacant: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };
    const displayStyle = styles[status] || styles.Resolved;
    return (
      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border backdrop-blur-sm transition-colors duration-500 ${displayStyle}`}>
        {status}
      </span>
    );
  };



  const ThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:scale-105 ${isDarkMode ? 'bg-slate-700 ring-offset-slate-900' : 'bg-slate-200 ring-offset-white'}`}
    >
      <span className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}>
        <span className={`absolute transition-all duration-500 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}>
          <Moon size={14} className="text-violet-600" />
        </span>
        <span className={`absolute transition-all duration-500 ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
          <Sun size={14} className="text-orange-500" />
        </span>
      </span>
    </button>
  );

  const showNotificationToast = (message, type = 'success') => {
    setNotificationToast({ message, type });
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // --- Handlers ---
  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const newRequest = { id: Date.now(), title, category: formData.get('category'), description: formData.get('description'), date: new Date().toISOString().split('T')[0], status: "Open" };
    setComplaints([newRequest, ...complaints]);
    if (userRole === 'tenant') {
      setNotifications([{ id: Date.now(), title: "New Issue Reported", message: `${user.name} reported: ${title}`, time: "Just now", read: false, type: 'issue' }, ...notifications]);
    }
    setShowComplaintModal(false);
    showNotificationToast("Complaint submitted successfully.");
  };

  /* --- NEW DELETE MODAL --- */
  const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDarkMode, title, message }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <Card isDarkMode={isDarkMode} className="w-full max-w-sm p-6 space-y-4 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border-2 border-rose-500/20">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-2">
              <Trash2 size={32} className="text-rose-500" />
            </div>
            <div>
              <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
              <p className="text-slate-500 mt-2 text-sm max-w-[250px] mx-auto">{message}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={onClose} variant="secondary" className="justify-center" isDarkMode={isDarkMode}>Cancel</Button>
            <Button onClick={onConfirm} className="bg-rose-500 hover:bg-rose-600 text-white justify-center border-none shadow-lg shadow-rose-500/20">Delete</Button>
          </div>
        </Card>
      </div>
    );
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:5000/api/properties/${propertyToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Property deleted successfully");
      setLandlordProperties(prev => prev.filter(p => p.id !== propertyToDelete));
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    } catch {
      toast.error("Delete failed");
      setIsDeleteModalOpen(false);
    }
  };

  /* --- TENANT DELETE & EDIT HANDLERS (New) --- */
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [isDeleteTenantModalOpen, setIsDeleteTenantModalOpen] = useState(false);

  const confirmDeleteTenant = async () => {
    if (!tenantToDelete) return;
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:5000/api/tenants/${tenantToDelete}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Tenant deleted successfully");
      setTenants(prev => prev.filter(t => t.id !== tenantToDelete));
      fetchLandlordProperties();
      setIsDeleteTenantModalOpen(false);
      setTenantToDelete(null);
    } catch {
      toast.error("Failed to delete tenant");
      setIsDeleteTenantModalOpen(false);
    }
  };

  const handleDeleteTenantClick = (id) => {
    setTenantToDelete(id);
    setIsDeleteTenantModalOpen(true);
  };

  const [isEditTenantModalOpen, setIsEditTenantModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState(null);

  const handleEditTenantClick = (tenant) => {
    setTenantToEdit(tenant);
    setIsEditTenantModalOpen(true);
  };

  const handleUpdateTenant = async (updatedData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(`http://localhost:5000/api/tenants/${updatedData.id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });

      setTenants(prev => prev.map(t => t.id === updatedData.id ? { ...t, ...updatedData, ...res.data } : t));
      toast.success("Tenant updated successfully");
      setIsEditTenantModalOpen(false);
      setTenantToEdit(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to update tenant");
    }
  };


  const handleDeleteClick = (id) => {
    setPropertyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateProperty = async (updatedData) => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.put(`http://localhost:5000/api/properties/${updatedData.id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Property updated");
      setIsEditOpen(false);
      // Optimistic update
      setLandlordProperties(prev => prev.map(p => p.id === updatedData.id ? { ...p, ...updatedData, name: updatedData.title, rent: updatedData.price } : p));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  // const [selectedProperty, setSelectedProperty] = useState(null); // Already declared above

  const handleLogout = () => {
    toast.success("Logging out...");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedTenantId");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };



  const RevenueLineChart = () => {
    const maxVal = Math.max(...REVENUE_DATA.map(d => d.amount));
    const minVal = Math.min(...REVENUE_DATA.map(d => d.amount));
    const range = maxVal - minVal;
    const width = 1000; const height = 300; const padding = 60;
    const points = REVENUE_DATA.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (REVENUE_DATA.length - 1);
      const y = height - padding - ((d.amount - minVal + range * 0.1) * (height - 2 * padding)) / (range * 1.2);
      return { x, y };
    });
    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
    return (
      <Card isDarkMode={isDarkMode} className="p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"><TrendingUp size={160} className="text-violet-500" /></div>
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div><h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Gain</h3><p className="text-sm text-slate-500 font-medium">Performance tracking across properties</p></div>
          <div className="text-right"><p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Growth Rate</p><h4 className="text-2xl font-black text-emerald-400">+12.5%</h4></div>
        </div>
        <div className="relative h-[300px] w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-2xl">
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#6366f1" /></linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter>
            </defs>
            {[0, 1, 2, 3].map(i => (<line key={i} x1={padding} y1={padding + (i * (height - 2 * padding)) / 3} x2={width - padding} y2={padding + (i * (height - 2 * padding)) / 3} stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} strokeDasharray="4 4" />))}
            <path d={areaPath} fill="url(#areaGradient)" />
            <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
            {points.map((p, i) => (
              <g key={i} className="group/dot cursor-pointer">
                <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#8b5cf6" strokeWidth="2" />
                <text x={p.x} y={height - padding + 30} textAnchor="middle" className="text-xs font-black fill-slate-500 uppercase tracking-widest">{REVENUE_DATA[i].month}</text>
              </g>
            ))}
          </svg>
        </div>
      </Card>
    );
  };

  const LandlordFinanceView = ({ isDarkMode, tenants, onUpdateStatus }) => {
    const [realPayments, setRealPayments] = useState([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
      fetchPayments();
    }, []);

    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/payment/landlord-payments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRealPayments(res.data);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setLoadingPayments(false);
      }
    };

    const downloadReceipt = async (paymentId) => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(`http://localhost:5000/api/payment/download-receipt/${paymentId}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Receipt_${paymentId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Receipt downloaded");
      } catch (error) {
        console.error("Download failed", error);
        toast.error("Receipt not found or failed to generate");
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end">
          <div>
            <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Overview</h2>
            <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track revenue streams and payment statuses</p>
          </div>
          <Button icon={Download} variant="outline" isDarkMode={isDarkMode}>Export Report</Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><IndianRupee size={100} /></div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Total Revenue (YTD)</p>
            <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{realPayments.reduce((a, b) => a + Number(b.amount), 0).toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-2">+12% from last month</p>
          </Card>
          <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Users size={100} /></div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">Pending Payments</p>
            <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{tenants.filter(t => t.status !== 'PAID').reduce((sum, t) => sum + (parseFloat(t.monthly_rent) || 0), 0).toLocaleString()}</h3>
            <p className="text-xs text-slate-500 mt-2">{tenants.filter(t => t.status !== 'PAID').length} Tenants Pending</p>
          </Card>
          <Card isDarkMode={isDarkMode} className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><PieChart size={100} /></div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-2">Collection Rate</p>
            <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {tenants.length > 0 ? Math.round((tenants.filter(t => t.status === 'PAID').length / tenants.length) * 100) : 0}%
            </h3>
            <p className="text-xs text-slate-500 mt-2">Target: 95%</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          <div className="lg:col-span-2 h-full">
            <RevenueLineChart />
          </div>
          <div className="lg:col-span-1 h-full">
            <RevenueTrendsChart isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Recent Transactions List - Full Width */}
        <Card isDarkMode={isDarkMode} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Transactions</h3>
            <Button variant="outline" className="text-xs h-8" isDarkMode={isDarkMode}>View All</Button>
          </div>
          <div className="space-y-4">
            {loadingPayments ? (
              <p className="text-slate-500 text-center py-4">Loading transactions...</p>
            ) : realPayments.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No transactions recorded.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {realPayments.slice(0, 6).map((p, i) => (
                  <div key={p.id || i} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${p.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        <IndianRupee size={20} />
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{p.tenant_name || 'Unknown Tenant'}</p>
                        <p className="text-xs text-slate-500">{p.property_name} • {new Date(p.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{Number(p.amount).toLocaleString()}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{p.status}</p>
                      </div>
                      <button
                        onClick={() => downloadReceipt(p.id)}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  /* --- NEW CHART COMPONENTS --- */

  const RevenueTrendsChart = ({ isDarkMode }) => {
    const data = [
      { month: "Jan", amount: 45000 },
      { month: "Feb", amount: 52000 },
      { month: "Mar", amount: 48000 },
      { month: "Apr", amount: 61000 },
      { month: "May", amount: 55000 },
      { month: "Jun", amount: 67000 },
    ];

    // Scale calculations
    const maxVal = 80000;
    const height = 200;
    const width = 500;
    const padding = 30; // Increased padding
    const yAxisLabels = [0, 20000, 40000, 60000, 80000];

    // Calculate points consistently
    const pointData = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
      const y = height - ((d.amount / maxVal) * (height - 2 * padding)) - padding;
      return { x, y, ...d };
    });

    const pointsStr = pointData.map(p => `${p.x},${p.y}`).join(' ');

    return (
      <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-500" size={24} />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trends</h3>
        </div>

        <div className="flex-1 w-full relative">
          {/* Y-Axis Grid & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-500 font-medium pb-8">
            {yAxisLabels.reverse().map((label, i) => (
              <div key={i} className="flex items-center w-full h-[1px]">
                <span className="w-12 text-right pr-3">{label > 0 ? `${label / 1000}k` : 0}</span>
                <div className={`flex-1 h-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="absolute inset-0 left-12 pt-2 pb-6">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                points={pointsStr}
                className="drop-shadow-xl"
              />
              {pointData.map((p, i) => (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    className="fill-blue-500 stroke-white stroke-[3px]"
                  />

                </g>
              ))}
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="absolute bottom-0 left-12 right-0 flex justify-between text-sm font-bold text-slate-500 pt-2">
            {data.map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </div>
      </Card>
    );
  };

  const ComplaintsDistributionChart = ({ isDarkMode }) => {
    const data = [
      { label: "Plumbing", value: 12, color: "bg-blue-600" },
      { label: "Maintenance", value: 8, color: "bg-blue-700" },
      { label: "Other", value: 5, color: "bg-blue-800" },
    ];
    const maxVal = 16;
    const yAxisLabels = [0, 4, 8, 12, 16];

    return (
      <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="text-blue-500" size={24} />
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaints by Type</h3>
        </div>

        <div className="flex-1 w-full relative">
          {/* Y-Axis Grid & Labels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400">
            {yAxisLabels.reverse().map((label, i) => (
              <div key={i} className="flex items-center w-full">
                <span className="w-6 text-right pr-2">{label}</span>
                <div className={`flex-1 h-[1px] border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
              </div>
            ))}
          </div>

          {/* Bars Container */}
          <div className="absolute inset-0 left-8 pt-2 pb-6 flex items-end justify-around pl-4">
            {data.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-3 h-full justify-end w-full group px-2">
                <div
                  className={`w-16 rounded-t-lg transition-all duration-500 group-hover:opacity-80 group-hover:scale-y-105 ${d.color} shadow-lg`}
                  style={{ height: `${(d.value / maxVal) * 100}%` }}
                ></div>
                <span className={`text-sm font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Count</div>
        </div>
      </Card>
    );
  };

  const LandlordHomeView = () => (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
            Welcome back, Landlord!
          </h2>
          <p className={`mt-2 text-lg ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>
            Here's what's happening with your properties
          </p>
        </div>
        <Button
          icon={PlusCircle}
          onClick={() => setActiveTab('add-property')}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-none shadow-lg shadow-yellow-500/20"
        >
          Add Property
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {REAL_STATS.map((stat, i) => (
          <Card key={i} isDarkMode={isDarkMode} className="p-6 relative group overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>{stat.label}</p>
                <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>{stat.value}</h3>
                <p className={`text-xs font-bold mt-2 ${stat.sub.includes('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-2xl text-white shadow-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Area: Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Recent Activity */}
        {/* Revenue Chart, Recent Activity & Properties */}
        <div className="lg:col-span-2 space-y-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
            <RevenueTrendsChart isDarkMode={isDarkMode} />
            <ComplaintsDistributionChart isDarkMode={isDarkMode} />
          </div>

          <div className="lg:col-span-2 space-y-6">


            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Recent Activity</h3>
            <Card isDarkMode={isDarkMode} className="p-6 space-y-6">
              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No recent activity.</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex gap-4 items-start">
                    <div className={`p-3 rounded-full shrink-0 ${n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' : n.type === 'complaint' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      {n.type === 'payment' ? <CreditCard size={20} /> : n.type === 'complaint' ? <AlertCircle size={20} /> : <Bell size={20} />}
                    </div>
                    <div>
                      <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{n.title}</p>
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{n.message}</p>
                      <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        {n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Properties List */}
            <div className="space-y-6">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>My Properties</h3>
              {loadingProperties ? (
                <div className="text-center py-10"><Wrench className="animate-spin mx-auto text-violet-500" /></div>
              ) : landlordProperties.length === 0 ? (
                <Card isDarkMode={isDarkMode} className="p-8 text-center border-dashed border-2 border-slate-700 bg-transparent">
                  <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                    <Building size={32} className="text-slate-500" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-slate-400">No Properties Found</h3>
                  <p className="text-slate-500 mb-4 text-sm">You haven't added any properties yet.</p>
                  <Button onClick={() => setActiveTab('add-property')} icon={Plus}>Add First Property</Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {landlordProperties.map((property) => (
                    <Card key={property.id} isDarkMode={isDarkMode} className="group overflow-hidden hover:border-violet-500/50 transition-all">
                      <div className="relative h-40">
                        <img src={property.image} alt={property.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold bg-black/50 backdrop-blur-md text-white border border-white/10`}>
                            {property.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className={`text-lg font-bold mb-1 truncate ${isDarkMode ? 'text-white' : 'text-black'}`}>{property.name}</h4>
                        <p className="text-sm text-slate-500 mb-3 flex items-center gap-1"><MapPin size={12} /> {property.address}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                          <span className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-black'}`}>${property.rent}<span className="text-xs font-medium text-slate-500">/mo</span></span>
                          <Button variant="outline" className="h-8 text-xs" onClick={() => setActiveTab('properties')}>View Details</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Quick Actions & Rent Collection */}
        <div className="space-y-6">

          {/* Rent Collection Donut Chart */}
          <Card isDarkMode={isDarkMode} className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="text-emerald-500" size={24} />
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Rent Collection</h3>
            </div>

            <div className="relative h-48 w-48 mx-auto mb-4">
              {/* SVG Donut Chart */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} strokeWidth="12" />
                {/* Paid Segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10b981" // emerald-500
                  strokeWidth="12"
                  strokeDasharray={`${((tenants.filter(t => t.status === 'PAID').length || 0) / (tenants.length || 1)) * 251.2} 251.2`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {Math.round(((tenants.filter(t => t.status === 'PAID').length || 0) / (tenants.length || 1)) * 100)}%
                </span>
                <span className="text-xs text-slate-500 uppercase font-bold">Collected</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Paid</span>
                </div>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenants.filter(t => t.status === 'PAID').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>Pending</span>
                </div>
                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tenants.filter(t => t.status !== 'PAID').length}</span>
              </div>
            </div>
          </Card>

          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Quick Actions</h3>
          <Card isDarkMode={isDarkMode} className="p-4 space-y-2">
            {[
              { label: 'View All Properties', icon: Building, action: () => setActiveTab('properties') },
              { label: 'Manage Tenants', icon: Users, action: () => setActiveTab('tenants') },
              { label: 'View Payments', icon: CreditCard, action: () => setActiveTab('finance') },
              { label: 'Review Complaints', icon: AlertCircle, action: () => setActiveTab('requests') }
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.action}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300 hover:text-white' : 'hover:bg-slate-50 text-black hover:text-black'}`}
              >
                <action.icon size={18} />
                <span className="font-bold text-sm">{action.label}</span>
              </button>
            ))}
          </Card>
        </div>

      </div>
    </div>
  );

  const LandlordPropertiesView = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'}`}>My Properties</h2>
          <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and track all your properties</p>
        </div>
        <Button
          icon={PlusCircle}
          onClick={() => setActiveTab('add-property')}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 border-none shadow-lg shadow-yellow-500/20"
        >
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadingProperties ? (
          <p className="text-slate-500">Loading properties...</p>
        ) : landlordProperties.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
              <Building size={32} className="text-slate-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Properties Listed</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">Your portfolio is currently empty. Start building your real estate empire today!</p>
            <Button icon={PlusCircle} onClick={() => setActiveTab('add-property')}>Add Your First Property</Button>
          </div>
        ) : (
          landlordProperties.map(prop => (
            <Card key={prop.id} isDarkMode={isDarkMode} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
              {/* Image Section */}
              <div className="h-64 relative overflow-hidden cursor-pointer" onClick={() => {
                const galleryImages = (prop.images && prop.images.length > 0)
                  ? prop.images.map(img => img.image_url)
                  : [prop.image];
                setSelectedPropertyImages(galleryImages);
                setIsGalleryOpen(true);
              }}>
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border shadow-sm ${prop.status === 'Occupied' ? 'bg-white text-slate-900' : 'bg-yellow-400 text-slate-900'}`}>
                    {prop.status === 'Occupied' ? 'Occupied' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-1`}>{prop.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{prop.address || "No address provided"}</span>
                  </div>
                </div>

                {/* Property Details Column */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        <Home size={16} />
                      </div>
                      <span className="font-medium">{prop.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        <Users size={16} />
                      </div>
                      <span className="font-medium text-right">{prop.units}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                      <IndianRupee size={16} />
                    </div>
                    <span className="font-bold flex items-center gap-1">
                      ₹{(prop.price || 0).toLocaleString()}
                      <span className="text-xs font-normal text-slate-400">/month</span>
                    </span>
                  </div>
                </div>

                {/* Financial Summary Small Pills */}
                <div className="flex gap-4 pt-2 border-t border-slate-800/10 dark:border-slate-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deposit</span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>₹{(prop.security_deposit || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rent Due</span>
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{prop.rent_due_day || 5}th</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setSelectedProperty(prop); setIsEditOpen(true); }}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(prop.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all`}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
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
      {notificationToast && (<div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-right-10 fade-in duration-300"><Card isDarkMode={isDarkMode} className={`px-4 py-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3`}><Check size={18} /><p className="font-bold text-sm">{notificationToast.message}</p></Card></div>)}
      {isMobileMenuOpen && (<div className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />)}

      <aside className={`fixed inset-y-0 left-0 z-30 w-72 backdrop-blur-xl border-r transform transition-transform duration-500 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static ${isDarkMode ? 'bg-slate-900/80 border-slate-900' : 'bg-white/90 border-slate-200'}`}>
        <div className={`p-8 border-b flex items-center gap-3 ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}>
          <img src="/favicon.png" alt="RentEase Logo" className="w-17  h-12 object-contain" />
          <span className={`text-3xl relative right-5 bottom-0.5 font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>RentEase</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {(userRole === 'landlord' ? LANDLORD_MENU_FINAL : TENANT_MENU).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                console.log("Navigating to:", item.id);
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`relative z-50 w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === item.id ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-400 border border-violet-500/20 shadow-xl shadow-violet-500/5' : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-black hover:bg-slate-100 hover:text-black'}`}`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-violet-500' : ''} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className={`p-6 border-t ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}><button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-slate-500 hover:text-rose-500`}><LogOut size={20} /><span className="text-sm font-bold">Logout</span></button></div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative" onClick={() => isNotificationOpen && setIsNotificationOpen(false)}>
        <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]"></div>
        </div>
        <header className="hidden md:flex w-full h-20 items-center justify-end px-8 z-20 shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative" onClick={(e) => e.stopPropagation()}><button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className={`p-2.5 rounded-xl border transition-all relative ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}><Bell size={20} />{unreadCount > 0 && (<span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-950"></span>)}</button>{isNotificationOpen && <NotificationDropdown notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead} isDarkMode={isDarkMode} />}</div>
            <ThemeToggle /><div className={`h-8 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div><div className="flex items-center gap-3"><div className="text-right hidden sm:block"><p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p><p className="text-[10px] lowercase font-bold text-slate-500">{user.email}</p></div><div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black shadow-lg">{user.name.charAt(0)}</div></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {userRole === 'tenant' ? (
                <>
                  {activeTab === 'dashboard' && <TenantDashboard />}
                  {activeTab === 'payments' && <TenantPaymentsView />}
                  {activeTab === 'complaints' && <TenantComplaintsView />}
                  {activeTab === 'settings' && <SettingsView />}
                  {activeTab === 'my-property' && <TenantPropertyView />}
                </>
              ) : (
                <>
                  {activeTab === 'dashboard' && <LandlordHomeView />}
                  {activeTab === 'properties' && <LandlordPropertiesView />}
                  {activeTab === 'add-property' && (
                    <AddPropertyView
                      newProperty={newProperty}
                      setNewProperty={setNewProperty}
                      isDarkMode={isDarkMode}
                      setLandlordProperties={setLandlordProperties}
                      showNotificationToast={showNotificationToast}
                    />
                  )}
                  {activeTab === 'bookings' && (
                    <LandlordBookingsView
                      isDarkMode={isDarkMode}
                      bookings={bookings}
                      onUpdateStatus={handleUpdateBookingStatus}
                    />
                  )}
                  {activeTab === 'tenants' && (
                    <>
                      <LandlordTenantsView
                        tenants={tenants}
                        fetchTenants={fetchTenants}
                        onDeleteClick={handleDeleteTenantClick}
                        onEditClick={handleEditTenantClick}
                        landlordProperties={landlordProperties}
                        fetchLandlordProperties={fetchLandlordProperties}
                        isDarkMode={isDarkMode}
                        setSelectedTenantId={setSelectedTenantId}
                      />
                      <EditTenantModal
                        isOpen={isEditTenantModalOpen}
                        onClose={() => setIsEditTenantModalOpen(false)}
                        tenant={tenantToEdit}
                        onUpdate={handleUpdateTenant}
                        isDarkMode={isDarkMode}
                      />
                      <DeleteConfirmationModal
                        isOpen={isDeleteTenantModalOpen}
                        onClose={() => setIsDeleteTenantModalOpen(false)}
                        onConfirm={confirmDeleteTenant}
                        isDarkMode={isDarkMode}
                        title="Delete Tenant"
                        message="Are you sure you want to delete this tenant? This action will remove the tenant and all family members permanently."
                      />
                    </>
                  )}
                  {activeTab === 'tenant-details' && (
                    <TenantDetailView
                      tenants={tenants}
                      selectedTenantId={selectedTenantId}
                      isDarkMode={isDarkMode}
                      setActiveTab={setActiveTab}
                      setSelectedTenantId={setSelectedTenantId}
                      showNotificationToast={showNotificationToast}
                      onUpdateStatus={handleUpdatePaymentStatus}
                    />
                  )}
                  {activeTab === 'requests' && (
                    <LandlordRequestsView
                      complaints={complaints}
                      isDarkMode={isDarkMode}
                      showNotificationToast={showNotificationToast}
                      onViewDetails={(id) => {
                        setSelectedComplaintId(id);
                        setActiveTab('request-details');
                      }}
                      onUpdateStatus={handleUpdateComplaintStatus}
                    />
                  )}
                  {activeTab === 'request-details' && (
                    <MaintenanceDetailsView
                      complaint={complaints.find(c => c.id === selectedComplaintId)}
                      onBack={() => setActiveTab('requests')}
                      isDarkMode={isDarkMode}
                      onUpdateStatus={handleUpdateComplaintStatus}
                    />
                  )}
                  {activeTab === 'finance' && <LandlordFinanceView isDarkMode={isDarkMode} tenants={tenants} onUpdateStatus={handleUpdatePaymentStatus} />}
                  {activeTab === 'settings' && <SettingsView user={user} isDarkMode={isDarkMode} handleLogout={handleLogout} />}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      {showComplaintModal && <ComplaintModal />}
      <EditPropertyModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} property={selectedProperty} onUpdate={handleUpdateProperty} isDarkMode={isDarkMode} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProperty}
        isDarkMode={isDarkMode}
        title="Delete Property?"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />

      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={selectedPropertyImages}
      />
    </div>
  );
}
