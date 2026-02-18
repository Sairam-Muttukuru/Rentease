import React from 'react';
import { Filter, CheckCircle2, Wrench, Building, Calendar, AlertCircle } from 'lucide-react';
import { Card } from '../../ui/card';
import LandlordButton from '../common/LandlordButton';

const LandlordRequestsView = ({ complaints, isDarkMode, onViewDetails }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end">
            <div>
                <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Issues at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Property</span>
                </h2>
                <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-black'}`}>
                    Handle tenant issues and repair tickets.
                </p>
            </div>
            <div className="flex gap-3">
                <LandlordButton isDarkMode={isDarkMode} variant="outline" icon={Filter}>Filter</LandlordButton>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {complaints.length === 0 ? (
                <Card isDarkMode={isDarkMode} className="p-12 text-center text-slate-500">
                    <div className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={40} className="text-slate-600" />
                    </div>
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
                                <LandlordButton isDarkMode={isDarkMode} variant="outline" className="flex-1 md:flex-none" onClick={() => onViewDetails(req.id)}>Details</LandlordButton>
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </div>
    </div>
);

export default LandlordRequestsView;
