import React from 'react';
import {
    PlusCircle,
    Building,
    MapPin,
    Home,
    Users,
    IndianRupee,
    Edit,
    Trash2
} from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const LandlordPropertiesView = ({
    landlordProperties,
    loadingProperties,
    isDarkMode,
    setActiveTab,
    onEditClick,
    onDeleteClick,
    onGalleryClick
}) => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-black'}`}>My Properties</h2>
                    <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage and track all your properties</p>
                </div>
                <LandlordButton
                    icon={PlusCircle}
                    onClick={() => setActiveTab('add-property')}
                >
                    Add Property
                </LandlordButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {loadingProperties ? (
                    <p className="text-slate-500">Loading properties...</p>
                ) : landlordProperties.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <Building size={32} className="text-slate-500" />
                        </div>
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Properties Listed</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8">Your portfolio is currently empty. Start building your real estate empire today!</p>
                        <LandlordButton icon={PlusCircle} onClick={() => setActiveTab('add-property')}>Add Your First Property</LandlordButton>
                    </div>
                ) : (
                    landlordProperties.map(prop => (
                        <div key={prop.id} className={`group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col`}>

                            {/* Image Section */}
                            <div className="aspect-[4/3] relative overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-950 shadow-inner" onClick={() => onGalleryClick(prop)}>
                                {/* Blurred Backdrop */}
                                <img
                                    src={prop.image || prop.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"}
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-125"
                                />
                                {/* Main Fitted Image */}
                                <img
                                    src={prop.image || prop.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80"}
                                    alt={prop.name}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80";
                                    }}
                                    className="relative w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                {/* Status Badge - Like the reference */}
                                <div className="absolute top-4 right-4">
                                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm ${prop.status === 'Occupied'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-yellow-400 text-slate-900'
                                        }`}>
                                        {prop.type === 'PG' ? `${prop.tenant_count || 0}/${prop.sharing_capacity || 1} Rented` : (prop.status === 'Occupied' ? 'Rented' : 'Available')}
                                    </span>
                                    {prop.is_fake && (
                                        <div className="mt-2 flex justify-end">
                                            <span className="bg-rose-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg border border-rose-500 animate-pulse">
                                                Fake Reported
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className={`p-6 flex-1 flex flex-col ${prop.is_fake ? 'opacity-75 grayscale-[0.3]' : ''}`}>
                                <div className="mb-4">
                                    <h3 className={`text-xl font-bold mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{prop.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                        <MapPin size={16} className="shrink-0" />
                                        <span className="truncate">{prop.address || "No address provided"}</span>
                                    </div>
                                    {prop.room_number && (
                                        <div className="mt-3 flex items-center gap-2">
                                            <span className="px-3 py-1 rounded-lg bg-indigo-600/10 text-indigo-500 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest">
                                                Room {prop.room_number}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Stats Grid - Based on Reference */}
                                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Home size={18} className="text-slate-400" />
                                        <span className="font-medium">{prop.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Users size={18} className="text-slate-400" />
                                        <span className="font-medium text-xs">
                                            {prop.type === 'PG' ? `${prop.tenant_count || 0}/${prop.sharing_capacity || 1} Occupied` : (prop.status === 'Occupied' ? 'Occupied' : 'Vacant')}
                                        </span>
                                    </div>

                                    {/* Dynamic Amenities Row based on Type */}
                                    <div className="col-span-2 flex flex-wrap gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        {/* Configuration */}
                                        {prop.bhk && (
                                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                <Building size={12} /> {prop.bhk} BHK
                                            </span>
                                        )}
                                        {prop.area_sqft > 0 && (
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                {prop.area_sqft} sqft
                                            </span>
                                        )}

                                        {/* Smart Highlights based on Property Type */}
                                        {(() => {
                                            const highlights = [];

                                            // PG Specific
                                            if (prop.type === 'PG') {
                                                if (prop.food_included) highlights.push('Food Included');
                                                if (prop.electricity_included) highlights.push('Power Inc.');
                                                if (prop.gender_allowed) highlights.push(`${prop.gender_allowed}`);
                                                if (prop.room_type) highlights.push(prop.room_type);
                                            }

                                            // Commercial/Office
                                            else if (['COMMERCIAL_SHOP', 'OFFICE_SPACE'].includes(prop.type)) {
                                                if (prop.shop_use_type) highlights.push(prop.shop_use_type.replace(/_/g, ' '));
                                                if (prop.office_type) highlights.push(`${prop.office_type} Office`);
                                                if (prop.seating_capacity) highlights.push(`${prop.seating_capacity} Seats`);
                                                if (prop.conference_room) highlights.push('Conf. Room');
                                                if (prop.cabins_available) highlights.push('Cabins');
                                                if (prop.water_available) highlights.push('Water');
                                            }

                                            // Villa/Independent
                                            else if (['VILLA', 'INDEPENDENT', 'INDEPENDENT_FLOOR'].includes(prop.type)) {
                                                if (prop.private_garden) highlights.push('Pvt. Garden');
                                                if (prop.duplex_type) highlights.push('Duplex');
                                                if (prop.private_parking_slots) highlights.push(`${prop.private_parking_slots} Parking`);
                                                if (prop.is_gated) highlights.push('Gated');
                                            }

                                            // Apartment/General
                                            else {
                                                if (prop.has_lift) highlights.push('Elevator');
                                                if (prop.is_gated) highlights.push('Gated');
                                                if (prop.parking_type && prop.parking_type !== 'NONE') highlights.push('Parking');
                                            }

                                            // Fallback to generic features if few specific ones
                                            if (highlights.length < 2 && prop.features) {
                                                highlights.push(...JSON.parse(JSON.stringify(prop.features)).slice(0, 2));
                                            }

                                            return highlights.slice(0, 4).map((feat, i) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 whitespace-nowrap">
                                                    {feat.toString().replace(/_/g, ' ')}
                                                </span>
                                            ));
                                        })()}
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        ₹{(prop.price || 0).toLocaleString()}
                                        <span className="text-sm font-normal text-slate-400 ml-1">/month</span>
                                    </div>

                                    {/* Action Buttons - Side by Side Outline */}
                                    <div className="flex flex-col gap-3">
                                        {prop.status !== 'Occupied' && (
                                            <button 
                                                onClick={() => setActiveTab('tenants')}
                                                className="w-full py-3 rounded-xl text-sm font-black bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                                            >
                                                <PlusCircle size={18} /> Add Tenant {prop.type === 'PG' ? `(Bed ${Number(prop.tenant_count || 0) + 1})` : ''}
                                            </button>
                                        )}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => onEditClick(prop)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-colors ${isDarkMode
                                                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                    }`}
                                            >
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteClick(prop.id)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-colors ${isDarkMode
                                                    ? 'border-rose-900/30 text-rose-400 hover:bg-rose-900/20'
                                                    : 'border-rose-100 text-rose-600 hover:bg-rose-50'
                                                    }`}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LandlordPropertiesView;
