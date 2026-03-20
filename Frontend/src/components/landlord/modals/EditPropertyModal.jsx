import React, { useState } from 'react';
import { X, CheckCircle2, Trash2, Building, Calendar, IndianRupee } from 'lucide-react';
import { toast } from 'react-toastify';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const AMENITIES_LIST = [
    { id: 1, name: "Swimming Pool", icon: Building }, // Use Building or other icon
    { id: 2, name: "Gym", icon: Building },
    { id: 3, name: "Parking", icon: Building },
    // ... more amenities as needed
];

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
                        <LandlordButton onClick={onClose} variant="secondary" className="flex-1" isDarkMode={isDarkMode}>Cancel</LandlordButton>
                        <LandlordButton type="submit" className="flex-1" isDarkMode={isDarkMode}>Save Changes</LandlordButton>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditPropertyModal;
