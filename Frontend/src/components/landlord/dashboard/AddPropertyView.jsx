import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    PlusCircle,
    FileText,
    Briefcase,
    Store,
    Users2,
    Home,
    Building,
    Users,
    Wrench,
    Maximize,
    ImageIcon,
    Upload,
    CheckCircle2,
    Trash2,
    X,
    IndianRupee,
    Clock,
    Sparkles,
    TrendingUp,
    Shield,
    Globe,
    Sun,
    ChevronLeft,
    Check
} from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

// Removed statically defined AMENITIES_LIST
const getAmenityIcon = (name) => {
    switch (name) {
        case 'Pool':
        case 'Swimming Pool': return Sparkles;
        case 'Gym':
        case 'Gym / Fitness Center': return TrendingUp;
        case 'Parking':
        case 'Car Parking': return Building;
        case 'Security':
        case '24/7 Security': return Shield;
        case 'Wifi / Internet': return Globe;
        case 'Garden':
        case 'Garden / Park': return Sun;
        case 'Power Backup': return Clock;
        case 'Lift':
        case 'Elevator': return ChevronLeft;
        default: return CheckCircle2;
    }
};

const INITIAL_NEW_PROPERTY = {
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
    security_deposit: "", rent_escalation_desc: "", upi_id: "", qr_code: "",
    rent_due_day: "5", late_penalty_amount: "", guidelines: "",
    sharing_capacity: "1"
};

const AddPropertyView = ({ isDarkMode, onSuccess, showNotificationToast }) => {
    const [newProperty, setNewProperty] = useState(INITIAL_NEW_PROPERTY);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [amenitiesList, setAmenitiesList] = useState([]);
    const [newAmenityName, setNewAmenityName] = useState("");
    const [isAddingAmenity, setIsAddingAmenity] = useState(false);

    React.useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) return;
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/properties/amenities/list`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setAmenitiesList(res.data);
            } catch (err) {
                console.error("Failed to fetch amenities", err);
            }
        };
        fetchAmenities();
    }, []);

    const handleAddCustomAmenity = async () => {
        if (!newAmenityName.trim()) return;
        setIsAddingAmenity(true);
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/properties/amenities/add`, 
            { name: newAmenityName },
            {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            setAmenitiesList(prev => [...prev, res.data]);
            setNewAmenityName("");
            toast.success("Custom amenity added!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to add amenity");
        } finally {
            setIsAddingAmenity(false);
        }
    };


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProperty(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
            const existingImageCount = newProperty.images.length;
            for (let i = 0; i < files.length; i++) {
                const url = await uploadToCloudinary(files[i]);
                uploadedImages.push({ url, is_cover: existingImageCount === 0 && i === 0 });
            }
            setNewProperty(prev => ({ ...prev, images: [...prev.images, ...uploadedImages] }));
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
        setIsSaving(true);
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
                building_name: newProperty.building_name,
                flat_number: newProperty.flat_number,
                floor_number: newProperty.floor_number ? parseInt(newProperty.floor_number) : null,
                bhk: newProperty.bhk ? parseInt(newProperty.bhk) : null,
                is_gated: newProperty.is_gated,
                total_floors: newProperty.total_floors ? parseInt(newProperty.total_floors) : null,
                has_lift: newProperty.has_lift,
                parking_type: newProperty.parking_type,
                house_floor_type: newProperty.house_floor_type,
                duplex_type: newProperty.duplex_type,
                private_parking_slots: newProperty.private_parking_slots ? parseInt(newProperty.private_parking_slots) : 0,
                private_garden: newProperty.private_garden,
                room_type: newProperty.room_type,
                food_included: newProperty.food_included,
                electricity_included: newProperty.electricity_included,
                gender_allowed: newProperty.gender_allowed,
                shop_use_type: newProperty.shop_use_type,
                water_available: newProperty.water_available,
                office_type: newProperty.office_type,
                seating_capacity: newProperty.seating_capacity ? parseInt(newProperty.seating_capacity) : null,
                cabins_available: newProperty.cabins_available,
                conference_room: newProperty.conference_room,
                security_deposit: parseFloat(newProperty.security_deposit) || 0,
                rent_escalation_desc: newProperty.rent_escalation_desc || null,
                upi_id: newProperty.upi_id || null,
                qr_code: newProperty.qr_code || null,
                rent_due_day: parseInt(newProperty.rent_due_day) || 5,
                late_penalty_amount: parseFloat(newProperty.late_penalty_amount) || 0,
                guidelines: newProperty.guidelines || null,
                sharing_capacity: parseInt(newProperty.sharing_capacity) || 1
            };
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/properties/addproperty`, propertyPayload, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            if (response.status === 201) {
                toast.success("Property successfully published!");
                setNewProperty(INITIAL_NEW_PROPERTY);
                onSuccess();
            }
        } catch (error) {
            console.error("Error saving property:", error);
            toast.error(error.response?.data?.error || "Failed to save property");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClasses = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5'}`;
    const numberInputClasses = `${inputClasses} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

    return (
        <form onSubmit={handleSaveProperty} className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Publish New <span className="text-violet-500">Property</span>
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Register a new asset to your marvelous portfolio.</p>
                </div>
                <div className="flex gap-3">
                    <LandlordButton isDarkMode={isDarkMode} type="submit" icon={CheckCircle2} disabled={isSaving}>
                        {isSaving ? "Publishing..." : "Add Property"}
                    </LandlordButton>
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
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Property Name</label>
                                <input required name="title" value={newProperty.title} onChange={handleInputChange} type="text" placeholder="e.g. Modern Luxury Penthouse" className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Description</label>
                                <textarea required name="description" value={newProperty.description} onChange={handleInputChange} rows="4" placeholder="Describe the ambiance..." className={inputClasses}></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">City</label>
                                    <input required name="city" value={newProperty.city} onChange={handleInputChange} type="text" placeholder="e.g. Hyderabad" className={inputClasses} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Locality</label>
                                    <input required name="locality" value={newProperty.locality} onChange={handleInputChange} type="text" placeholder="e.g. Gachibowli" className={inputClasses} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Full Address</label>
                                <textarea required name="fullAddress" value={newProperty.fullAddress} onChange={handleInputChange} rows="2" placeholder="House no, Street name, Landmark..." className={inputClasses}></textarea>
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
                                        <option value="PG">PG/Hostel</option>
                                        <option value="COMMERCIAL_SHOP">Commercial Shop</option>
                                        <option value="OFFICE_SPACE">Office Space</option>
                                    </select>
                                </div>

                                {newProperty.type === 'PG' && (
                                    <div className="animate-in slide-in-from-left duration-300">
                                        <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Room Number</label>
                                        <input type="text" name="room_no" value={newProperty.room_no || ''} onChange={handleInputChange} className={inputClasses} placeholder="e.g. 101, B-4" />
                                    </div>
                                )}

                                {/* Conditional Fields based on Property Type */}
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
                                                <input type="checkbox" name="cabins_available" checked={newProperty.cabins_available} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Cabins Available</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="conference_room" checked={newProperty.conference_room} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
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
                                                <input type="checkbox" name="water_available" checked={newProperty.water_available} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
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
                                        <div>
                                            <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                                <Sparkles size={12} /> Sharing Capacity (Beds)
                                            </label>
                                            <input 
                                                required 
                                                name="sharing_capacity" 
                                                value={newProperty.sharing_capacity} 
                                                onChange={handleInputChange} 
                                                type="number" 
                                                min="1"
                                                placeholder="e.g. 3" 
                                                className={`${inputClasses} border-indigo-500/30 bg-indigo-500/10`} 
                                            />
                                            <p className="text-[10px] text-slate-500 mt-1 italic font-bold">* How many separate tenants can stay here?</p>
                                        </div>
                                        <div className="md:col-span-2 flex gap-6 mt-2">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="food_included" checked={newProperty.food_included} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
                                                <span className="text-sm font-bold text-black dark:text-white">Food Included</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="electricity_included" checked={newProperty.electricity_included} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
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
                                                <input type="checkbox" name="is_gated" checked={newProperty.is_gated} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
                                                <span className="text-sm font-bold text-black dark:text-white">Gated Community</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="duplex_type" checked={newProperty.duplex_type} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
                                                <span className="text-sm font-bold text-black dark:text-white">Duplex</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="private_garden" checked={newProperty.private_garden} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
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
                                                <input type="checkbox" name="is_gated" checked={newProperty.is_gated} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Gated Security</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" name="has_lift" checked={newProperty.has_lift} onChange={handleInputChange} className="w-5 h-5 accent-violet-600 rounded-lg" />
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
                                        <label className="text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Users size={12} /> Bedrooms</label>
                                        <input required name="bedrooms" value={newProperty.bedrooms} onChange={handleInputChange} type="number" placeholder="0" className={numberInputClasses} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Wrench size={12} /> Bathrooms</label>
                                        <input required name="bathrooms" value={newProperty.bathrooms} onChange={handleInputChange} type="number" placeholder="0" className={numberInputClasses} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-black text-black dark:text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Maximize size={12} /> Area (Sqft)</label>
                                        <input required name="area" value={newProperty.area} onChange={handleInputChange} type="number" placeholder="1850" className={numberInputClasses} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Amenities & Financials (Add Property) */}
                    <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
                            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400"><IndianRupee size={24} /></div>
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Financial Details & Guidelines</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Security Deposit (₹)</label>
                                <input name="security_deposit" value={newProperty.security_deposit} onChange={handleInputChange} type="number" placeholder="5000" className={numberInputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Rent Escalation (%)</label>
                                <input name="rent_escalation_desc" value={newProperty.rent_escalation_desc} onChange={handleInputChange} type="number" placeholder="5" className={numberInputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">UPI ID</label>
                                <input name="upi_id" value={newProperty.upi_id} onChange={handleInputChange} type="text" placeholder="username@upi" className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Rent Due Day</label>
                                <input name="rent_due_day" value={newProperty.rent_due_day} onChange={handleInputChange} type="number" min="1" max="31" placeholder="5" className={numberInputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Late Penalty (₹ per day)</label>
                                <input name="late_penalty_amount" value={newProperty.late_penalty_amount} onChange={handleInputChange} type="number" placeholder="50" className={numberInputClasses} />
                            </div>
                            
                            {/* QR Code Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 text-center">Payment QR Code</label>
                                <div className={`relative border-2 border-dashed ${newProperty.qr_code ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800'} rounded-3xl p-6 text-center hover:border-emerald-500 transition-all group/qr`}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            setUploadingQr(true);
                                            try {
                                                const url = await uploadToCloudinary(file);
                                                setNewProperty(prev => ({ ...prev, qr_code: url }));
                                                toast.success("QR Code uploaded!");
                                            } catch (err) {
                                                toast.error("QR upload failed");
                                            } finally {
                                                setUploadingQr(false);
                                            }
                                        }} 
                                    />
                                    {newProperty.qr_code ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg">
                                                <img src={newProperty.qr_code} alt="QR Code" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setNewProperty(prev => ({ ...prev, qr_code: '' }));
                                                    }}
                                                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-lg hover:scale-110 transition-transform z-20"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">QR Code Linked</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover/qr:scale-110 transition-transform">
                                                <Upload size={24} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{uploadingQr ? 'Uploading QR...' : 'Click to upload Payment QR'}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">GPay / PhonePe / Paytm QR</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2">Property Guidelines / Rules</label>
                                <textarea name="guidelines" value={newProperty.guidelines} onChange={handleInputChange} rows="3" placeholder="e.g. No pets allowed, Silent hours after 10 PM..." className={inputClasses}></textarea>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
                            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400"><ImageIcon size={24} /></div>
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Visual Showcase</h4>
                        </div>
                        <div className="relative border-2 border-dashed border-slate-800 rounded-[2rem] p-10 text-center hover:border-violet-500 transition-all group/upload">
                            <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                    <Upload size={32} />
                                </div>
                                <div>
                                    <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{uploadingImages ? 'Uploading...' : 'Upload Property Images'}</p>
                                    <p className="text-sm text-slate-500">Drag & drop or click to browse</p>
                                </div>
                            </div>
                        </div>

                        {newProperty.images.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                {newProperty.images.map((img, i) => (
                                    <div key={i} className={`relative group rounded-3xl overflow-hidden border-2 transition-all ${img.is_cover ? 'border-violet-500 scale-95 shadow-lg shadow-violet-500/20' : 'border-slate-800 hover:border-slate-600 hover:scale-95'}`}>
                                        <img src={img.url} alt="" className="w-full h-32 object-cover" />
                                        {img.is_cover && <div className="absolute top-2 left-2 px-2 py-0.5 bg-violet-600 text-[10px] font-black uppercase rounded-lg text-white">Cover</div>}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                            {!img.is_cover && <button type="button" onClick={() => handleSetCover(i)} className="p-2 bg-white text-black rounded-xl hover:scale-110 transition-transform" title="Set as Cover"><CheckCircle2 size={16} /></button>}
                                            <button type="button" onClick={() => handleRemoveImage(i)} className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-transform" title="Remove Image"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card isDarkMode={isDarkMode} className="p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-slate-800/50 pb-4">
                            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400"><Sparkles size={24} /></div>
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>Amenities</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {amenitiesList.map((amenity) => {
                                const IconComponent = getAmenityIcon(amenity.name);
                                return (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => handleToggleAmenity(amenity.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${newProperty.amenities.includes(amenity.id) ? 'bg-violet-600/10 border-violet-500/50 text-violet-400 shadow-lg shadow-violet-500/5' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent size={18} />
                                            <span className="text-sm font-bold">{amenity.name}</span>
                                        </div>
                                        {newProperty.amenities.includes(amenity.id) && <Check size={16} />}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex gap-2">
                            <input
                                type="text"
                                value={newAmenityName}
                                onChange={(e) => setNewAmenityName(e.target.value)}
                                placeholder="Add custom amenity..."
                                className={`flex-1 px-4 py-2 rounded-xl text-sm border outline-none ${isDarkMode ? 'bg-slate-900 border-slate-700 text-white focus:border-violet-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-violet-500'}`}
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomAmenity}
                                disabled={isAddingAmenity || !newAmenityName.trim()}
                                className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50' : 'bg-slate-200 text-black hover:bg-slate-300 disabled:opacity-50'}`}
                            >
                                <PlusCircle size={16} />
                                {isAddingAmenity ? "Adding..." : "Add"}
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    );
};

export default AddPropertyView;
