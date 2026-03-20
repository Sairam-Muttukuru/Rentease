import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building, Wrench, ImageIcon, Maximize, CheckCircle2 } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const MaintenanceDetailsView = ({ complaint, onBack, isDarkMode }) => {
    const navigate = useNavigate();

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

                    <LandlordButton
                        onClick={() => {
                            const addressParts = [
                                complaint.property_name,
                                complaint.flat_number,
                                complaint.building_name,
                                complaint.locality,
                                complaint.city,
                                complaint.address
                            ].filter(part => part && part.trim() !== '');

                            const formattedAddress = addressParts.join(', ');

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
                    </LandlordButton>
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

export default MaintenanceDetailsView;
