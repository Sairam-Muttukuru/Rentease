import React, { useState } from 'react';
import { X, CheckCircle2, Trash2, Building, Calendar, IndianRupee, Upload, ImageIcon, Sparkles, TrendingUp, Shield, Globe, Sun, Clock, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

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

const EditPropertyModal = ({ isOpen, onClose, property, onUpdate, isDarkMode }) => {
    if (!isOpen || !property) return null;

    const [formData, setFormData] = useState({
        title: property.title || property.name || "",
        description: property.description || "",
        property_type: property.property_type || property.type || "Apartment",
        price: property.price || property.rent || 0,
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
        upi_id: property.upi_id || "",
        qr_code: property.qr_code || "",
        rent_due_day: property.rent_due_day || 5,
        late_penalty_amount: property.late_penalty_amount || 0,
        sharing_capacity: property.sharing_capacity || 1,
        room_number: property.room_number || property.room_no || "",
        guidelines: property.guidelines || ""
    });

    const [images, setImages] = useState(property.images || []);
    const [amenities, setAmenities] = useState(property.amenities?.map(a => a.id) || []);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [amenitiesList, setAmenitiesList] = useState([]);
    
    React.useEffect(() => {
        if (!isOpen) return;
        const fetchAmenities = async () => {
            try {
                const token = localStorage.getItem("accessToken");
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
    }, [isOpen]);

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
        } catch (err) { toast.error("Upload failed"); }
        finally { setUploadingImages(false); }
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetCover = (index) => {
        setImages(prev => prev.map((img, i) => ({ ...img, is_cover: i === index })));
    };

    const handleToggleAmenity = (id) => {
        setAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitting(true);
        try {
            await onUpdate({ ...property, ...formData, images, amenities });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClass = `w-full px-4 py-3 rounded-2xl border outline-none transition-all duration-200 ${
        isDarkMode 
            ? 'bg-slate-900/50 border-slate-800 text-white focus:border-violet-500 focus:bg-slate-900' 
            : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-violet-500 focus:bg-white'
    }`;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-hidden">
            <div className={`relative w-full max-w-4xl max-h-[85vh] mt-20 flex flex-col ${isDarkMode ? 'bg-[#0f172a] text-white' : 'bg-white'} rounded-[2.5rem] shadow-2xl border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'} animate-in zoom-in-95 duration-300`}>
                
                {/* Header - Fixed */}
                <div className="p-8 border-b border-slate-800/50 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Edit Property</h2>
                        <p className="text-slate-500 text-sm font-medium">Update your property listing information</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-800/50 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                    {/* Basic Info Group */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/30">
                            <Building size={18} className="text-violet-500" />
                            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Basic Information</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Property Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Luxury Apartment in Guntur" required />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Property Type</label>
                                <select name="property_type" value={formData.property_type} onChange={handleChange} className={inputClass}>
                                    <option value="PG">PG/Hostel</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="House">House</option>
                                    <option value="Commercial">Commercial Shop</option>
                                    <option value="Office">Office Space</option>
                                </select>
                            </div>

                            {formData.property_type === 'PG' && (
                                <>
                                    <div className="animate-in slide-in-from-left duration-300">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Room Number</label>
                                        <input name="room_number" value={formData.room_number} onChange={handleChange} className={inputClass} placeholder="e.g. 101, B-4" />
                                    </div>
                                    <div className="animate-in slide-in-from-right duration-300">
                                        <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <Sparkles size={12} /> Sharing Capacity (Beds)
                                        </label>
                                        <input type="number" name="sharing_capacity" value={formData.sharing_capacity} onChange={handleChange} className={`${inputClass} border-indigo-500/30 bg-indigo-500/5`} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass} placeholder="Describe your property amenities and rules..."></textarea>
                        </div>
                    </div>

                    {/* Specifications Group */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/30">
                            <TrendingUp size={18} className="text-emerald-500" />
                            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Specifications</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Rent (₹)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Area (sqft)</label><input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">BHK</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Baths</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputClass} /></div>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">City</label><input name="city" value={formData.city} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Locality</label><input name="locality" value={formData.locality} onChange={handleChange} className={inputClass} /></div>
                            <div className="md:col-span-2"><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Full Address</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" className={inputClass}></textarea></div>
                         </div>
                    </div>

                    {/* Media Group */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/30">
                            <ImageIcon size={18} className="text-amber-500" />
                            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Property Showcase</h4>
                        </div>
                        <div className="relative border-2 border-dashed border-slate-800 rounded-[2rem] p-8 text-center hover:border-violet-500 transition-all group/upload">
                            <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>{uploadingImages ? 'Uploading...' : 'Tap to Add Images'}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Max 10MB per image</p>
                                </div>
                            </div>
                        </div>
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                {images.map((img, i) => (
                                    <div key={i} className={`relative group rounded-2xl overflow-hidden border-2 transition-all ${img.is_cover ? 'border-violet-500 ring-4 ring-violet-500/10' : 'border-slate-800'}`}>
                                        <img src={img.image_url || img.url} className="w-full h-24 object-cover" alt="" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                            {!img.is_cover && <button type="button" onClick={() => handleSetCover(i)} className="p-2 bg-violet-600 rounded-lg text-white hover:scale-110"><CheckCircle2 size={16} /></button>}
                                            <button type="button" onClick={() => handleRemoveImage(i)} className="p-2 bg-rose-500 rounded-lg text-white hover:scale-110"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Financials */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/30">
                            <IndianRupee size={18} className="text-violet-500" />
                            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Financials & Policies</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Deposit (₹)</label><input type="number" name="security_deposit" value={formData.security_deposit} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Escalation (%)</label><input type="number" name="rent_escalation_desc" value={formData.rent_escalation_desc} onChange={handleChange} className={inputClass} /></div>
                            <div><label className="text-[10px] font-black text-slate-500 uppercase mb-2 block">Due Day</label><input type="number" name="rent_due_day" value={formData.rent_due_day} onChange={handleChange} className={inputClass} /></div>

                            {/* Payment QR Scanner */}
                            <div className="md:col-span-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-4 block">Payment QR Scanner</label>
                                <div className={`relative border-2 border-dashed ${formData.qr_code ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800'} rounded-[1.5rem] p-6 text-center hover:border-emerald-500 transition-all group/qr`}>
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
                                                setFormData(prev => ({ ...prev, qr_code: url }));
                                                toast.success("QR Scanner updated!");
                                            } catch (err) {
                                                toast.error("Upload failed");
                                            } finally {
                                                setUploadingQr(false);
                                            }
                                        }} 
                                    />
                                    {formData.qr_code ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="relative w-28 h-28 rounded-xl overflow-hidden shadow-2xl border border-emerald-500/20">
                                                <img src={formData.qr_code} alt="QR Scanner" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFormData(prev => ({ ...prev, qr_code: '' })); }}
                                                    className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-md hover:scale-110 shadow-lg z-20"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                            <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">Scanner Active</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center group-hover/qr:bg-emerald-500/20 group-hover/qr:text-emerald-500 transition-all">
                                                <Upload size={20} />
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                                {uploadingQr ? 'Processing...' : 'Click to add Payment QR Scanner'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Edit */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-800/30">
                            <Sparkles size={18} className="text-violet-400" />
                            <h4 className="font-bold uppercase tracking-widest text-xs text-slate-400">Amenities</h4>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {amenitiesList.map((amenity) => {
                                const IconComponent = getAmenityIcon(amenity.name);
                                return (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => handleToggleAmenity(amenity.id)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${amenities.includes(amenity.id) ? 'bg-violet-600/10 border-violet-500 shadow-lg shadow-violet-500/10 text-violet-400' : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconComponent size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{amenity.name}</span>
                                        </div>
                                        {amenities.includes(amenity.id) && <Check size={14} />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </form>

                {/* Footer - Fixed */}
                <div className="p-8 border-t border-slate-800/50 bg-slate-900/10 flex gap-4 shrink-0">
                    <button type="button" onClick={onClose} className="flex-1 py-5 rounded-[1.5rem] font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors uppercase tracking-widest text-xs" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="flex-[2.5] py-5 rounded-[1.5rem] font-black bg-violet-600 text-white hover:bg-violet-500 shadow-2xl shadow-violet-600/30 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs" disabled={isSubmitting}>
                        {isSubmitting ? 'Updating System...' : 'Save Property Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPropertyModal;
