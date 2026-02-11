import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, FileText, Users, Sparkles, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, Landmark, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const MyPropertyView = ({
    isDarkMode,
    user,
    propertyImages,
    currentImageIndex,
    setCurrentImageIndex,
    prevImage,
    nextImage,
    setPaymentType,
    setShowPaymentModal
}) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>My Property</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-500 ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                    Active Resident
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl group border transition-all duration-500 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="absolute inset-0">
                            <img
                                key={currentImageIndex}
                                src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
                                alt="Property View"
                                className="w-full h-full object-cover animate-in fade-in duration-700"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${isDarkMode ? 'from-slate-900 via-transparent to-transparent' : 'from-black/50 via-transparent to-transparent'}`}></div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                            <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                                <h3 className="text-3xl font-bold text-white mb-1 shadow-black/50 drop-shadow-md">{user.propertyName}</h3>
                                <p className="text-white/90 flex items-center gap-2 text-sm backdrop-blur-md bg-black/30 w-fit px-3 py-1 rounded-full">
                                    <Building size={14} /> {user.address}
                                </p>
                            </div>
                            <div className="hidden sm:block shrink-0">
                                <span className="text-white/80 text-sm bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 whitespace-nowrap">
                                    {currentImageIndex + 1} / {propertyImages.length}
                                </span>
                            </div>
                        </div>

                        {propertyImages.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronLeft size={24} />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Type', value: 'Luxury Villa', icon: Building },
                            { label: 'Size', value: '2,400 sq ft', icon: FileText },
                            { label: 'Bedrooms', value: '4 Beds', icon: Users },
                            { label: 'Bathrooms', value: '3 Baths', icon: Sparkles }
                        ].map((item, idx) => (
                            <Card key={idx} className="p-4 flex flex-col items-center justify-center text-center gap-2 hover:scale-105 transition-transform cursor-default">
                                <item.icon size={24} className={`transition-colors duration-500 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                                <div>
                                    <p className={`text-xs font-medium uppercase transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</p>
                                    <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.value}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Residents</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {user.members && user.members.map((member) => (
                                <div key={member.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                                        {member.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{member.full_name}</p>
                                        <p className={`text-xs uppercase tracking-wider font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{member.relation || 'Resident'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Financial Terms Card */}
                    <div className="mt-8">
                        <Card className="p-6">
                            <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Financial Terms</h3>
                            <div className="space-y-4">
                                <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Security Deposit</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.securityDepositStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {user.securityDepositStatus || 'Unpaid'}
                                                </span>
                                                {user.securityDepositStatus !== 'Paid' && (
                                                    <button
                                                        onClick={() => {
                                                            setPaymentType('SECURITY_DEPOSIT');
                                                            setShowPaymentModal(true);
                                                        }}
                                                        className="text-xs font-bold px-5 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/30 active:scale-[0.98]"
                                                    >
                                                        Pay Now
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{user.securityDeposit ? user.securityDeposit.toLocaleString() : "50,000"}</p>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                        <TrendingUp size={20} />
                                    </div>
                                    <div>
                                        <p className={`text-xs uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Rent Escalation</p>
                                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.rentEscalation || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Landlord Details</h3>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
                                {(user.landlord || "?").charAt(0)}
                            </div>
                            <div>
                                <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.landlord}</p>
                                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property Owner</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Button variant="ghost" className="w-full">View Profile</Button>
                        </div>
                    </Card>

                    {/* Amenities Card */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <Sparkles size={18} className="text-violet-500" /> Amenities
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(user.amenities && user.amenities.length > 0 ? user.amenities : ['Swimming Pool', 'Gym', 'High Speed Wi-Fi', 'Power Backup', '24/7 Security', 'Club House']).map((amenity, idx) => (
                                <span key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </Card>

                    {/* Payment Information Card */}
                    <Card className="p-6">
                        <h3 className={`text-lg font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Details</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Landmark size={18} className="text-slate-400" />
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Bank Transfer / NEFT</p>
                                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                        {user.bankAccount ? `${user.bankAccount} (${user.ifscCode})` : "Ask Landlord"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold">₹</div>
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>UPI ID</p>
                                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.upiId || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Late Fee Policy Card */}
                    <Card className="p-6 border-l-4 border-l-rose-500">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={24} className="text-rose-500 shrink-0" />
                            <div>
                                <h3 className={`text-lg font-bold mb-1 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Late Fee Policy</h3>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Rent needs to be paid by {user.rentDueDay ? `${user.rentDueDay}th` : "5th"}. A penalty of <span className="font-bold text-rose-500">₹{user.latePenaltyAmount || 0}/day</span> applies thereafter.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyPropertyView;
