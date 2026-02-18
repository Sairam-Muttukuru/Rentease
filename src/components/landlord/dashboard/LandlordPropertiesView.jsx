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
                        <Card key={prop.id} isDarkMode={isDarkMode} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
                            {/* Image Section */}
                            <div className="h-80 relative overflow-hidden cursor-pointer" onClick={() => onGalleryClick(prop)}>
                                <img
                                    src={prop.image}
                                    alt={prop.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                />
                                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md rounded-full p-1">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border shadow-2xl ${prop.status === 'Occupied' ? 'bg-white text-slate-900' : 'bg-emerald-500 text-white border-emerald-400'}`}>
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

                                    {/* Additional Details - Dynamic Tags */}
                                    <div className="flex flex-wrap gap-2 pt-3">
                                        {/* Common Details */}
                                        {prop.area_sqft > 0 && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.area_sqft} sqft
                                            </span>
                                        )}
                                        {prop.bhk && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.bhk} BHK
                                            </span>
                                        )}
                                        {(!prop.bhk && prop.bedrooms > 0) && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.bedrooms} Bed
                                            </span>
                                        )}
                                        {prop.parking_type && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.parking_type.replace(/_/g, ' ')}
                                            </span>
                                        )}

                                        {/* Apartment/House Specific */}
                                        {prop.is_gated && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                Gated
                                            </span>
                                        )}

                                        {/* Commercial/Office Specific */}
                                        {prop.shop_use_type && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.shop_use_type.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                        {prop.office_type && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.office_type.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                        {prop.water_available && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                Water Avail.
                                            </span>
                                        )}
                                        {prop.cabins_available && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                Cabins
                                            </span>
                                        )}
                                        {prop.conference_room && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                Conf. Room
                                            </span>
                                        )}
                                        {prop.seating_capacity > 0 && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.seating_capacity} Seats
                                            </span>
                                        )}

                                        {/* PG/Hostel Specific */}
                                        {prop.room_type && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.room_type.replace(/_/g, ' ')}
                                            </span>
                                        )}
                                        {prop.food_included && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                Food
                                            </span>
                                        )}
                                        {prop.gender_allowed && (
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                {prop.gender_allowed}
                                            </span>
                                        )}
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
                                        onClick={() => onEditClick(prop)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                                    >
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(prop.id)}
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
};

export default LandlordPropertiesView;
