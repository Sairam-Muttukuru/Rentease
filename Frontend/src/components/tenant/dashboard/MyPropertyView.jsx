import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, FileText, Users, Sparkles, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, Landmark, AlertTriangle, Download, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ImageGalleryModal from '../../ui/ImageGalleryModal';

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
    const [downloading, setDownloading] = React.useState(false);
    const [showGallery, setShowGallery] = React.useState(false);

    const handleDownloadReceipt = async () => {
        setDownloading(true);
        try {
            const res = await fetch(`https://rentease-1-pwm5.onrender.com/api/payment/security-deposit/tenant/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to fetch receipt data");

            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            const purpleColor = [124, 58, 237];
            const subTextColor = [100, 116, 139];
            const blackColor = [15, 23, 42];
            const greenColor = [22, 163, 74];
            const navyColor = [30, 41, 59];

            // --- Header Section ---
            doc.setFont("helvetica", "bold");
            doc.setFontSize(36);
            doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.text("RentEase", 20, 30);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
            doc.text("Premium Property Management", 20, 38);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
            doc.text("PAYMENT RECEIPT", 190, 30, { align: "right" });

            doc.setFontSize(12);
            doc.setTextColor(greenColor[0], greenColor[1], greenColor[2]);
            doc.text("PAID SUCCESSFUL", 190, 38, { align: "right" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
            doc.text(`Receipt #: ${data.receipt_number}`, 190, 47, { align: "right" });
            doc.text(`Date: ${new Date(data.payment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 190, 54, { align: "right" });

            doc.setDrawColor(241, 245, 249);
            doc.line(20, 68, 190, 68);

            // --- Info Section ---
            let infoY = 85;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
            doc.text("Received From:", 20, infoY);
            doc.text("Property Details:", 110, infoY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
            doc.text(user.tenantName || user.name || "N/A", 20, infoY + 7);
            doc.text(`Resident ID: ${user.id || 'N/A'}`, 20, infoY + 14);
            doc.text(user.propertyName || "RentEase Properties", 110, infoY + 7);

            // --- Table ---
            let tableY = 125;
            doc.setFillColor(navyColor[0], navyColor[1], navyColor[2]);
            doc.rect(20, tableY, 170, 12, 'F');

            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text("DESCRIPTION", 25, tableY + 8);
            doc.text("PAYMENT METHOD", 100, tableY + 8);
            doc.text("AMOUNT", 185, tableY + 8, { align: "right" });

            doc.setFont("helvetica", "normal");
            doc.setTextColor(blackColor[0], blackColor[1], blackColor[2]);
            doc.text("Security Deposit Payment", 25, tableY + 22);
            doc.text(data.payment_gateway || "Stripe", 100, tableY + 22);
            doc.text(`${Number(data.amount).toLocaleString('en-IN')}`, 185, tableY + 22, { align: "right" });

            let totalY = tableY + 45;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(purpleColor[0], purpleColor[1], purpleColor[2]);
            doc.text(`Total Paid: INR ${Number(data.amount).toLocaleString('en-IN')}`, 185, totalY, { align: "right" });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
            doc.text("All prices in INR", 185, totalY + 7, { align: "right" });

            let footerY = 230;
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(20, footerY, 170, 35, 2, 2, 'D');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(navyColor[0], navyColor[1], navyColor[2]);
            doc.text("Transaction Details", 25, footerY + 8);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2]);
            doc.text(`Transaction ID: ${data.transaction_id}`, 25, footerY + 18);
            doc.text(`Status: COMPLETED (Verified)`, 25, footerY + 26);

            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.text("This is a computer-generated receipt, no signature required.", 105, 280, { align: "center" });

            doc.save(`Security_Deposit_Receipt_${user.id}.pdf`);
        } catch (err) {
            console.error("Download error:", err);
            alert(err.message);
        } finally {
            setDownloading(false);
        }
    };
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
                    <div
                        className={`relative aspect-video rounded-2xl overflow-hidden shadow-2xl group border transition-all duration-500 cursor-zoom-in ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
                        onClick={() => setShowGallery(true)}
                    >
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
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100 z-10"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Type', value: user.property_type || 'Luxury Villa', icon: Building },
                            { label: 'Size', value: user.area_sqft ? `${user.area_sqft} sq ft` : '2,400 sq ft', icon: FileText },
                            { label: 'Bedrooms', value: user.bedrooms ? `${user.bedrooms} Beds` : '4 Beds', icon: Users },
                            { label: 'Bathrooms', value: user.bathrooms ? `${user.bathrooms} Baths` : '3 Baths', icon: Sparkles }
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

            {/* Financial Terms Section - Scaled down for better balance */}
            <div className="mt-8">
                <Card className={`p-6 border-t-2 border-t-violet-500 shadow-xl transition-all duration-500 ${isDarkMode ? 'shadow-violet-500/5' : 'shadow-violet-500/10'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className={`text-xl font-bold mb-1 flex items-center gap-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Landmark className="text-violet-500" size={20} /> Financial Overview
                            </h3>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                Management of your property deposits and lease terms.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Security Deposit Card */}
                        <div className={`p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${isDarkMode
                            ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-violet-500/10'
                            }`}>
                            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <ShieldCheck size={80} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${user.securityDepositStatus === 'Paid'
                                            ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                                            : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                            }`}>
                                            {user.securityDepositStatus || 'Unpaid'}
                                        </span>
                                        {user.securityDepositStatus === 'Paid' && (
                                            <button
                                                onClick={handleDownloadReceipt}
                                                disabled={downloading}
                                                className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-md active:scale-95 ${isDarkMode
                                                    ? 'bg-violet-600/20 text-violet-300 hover:bg-violet-600 border border-violet-500/40'
                                                    : 'bg-violet-600 text-white hover:bg-violet-700 shadow-violet-500/20'
                                                    }`}
                                            >
                                                {downloading ? (
                                                    <Loader2 size={12} className="animate-spin" />
                                                ) : (
                                                    <Download size={12} />
                                                )}
                                                {downloading ? 'Fetching...' : 'Receipt'}
                                            </button>
                                        )}
                                        {user.securityDepositStatus !== 'Paid' && (
                                            <button
                                                onClick={() => {
                                                    setPaymentType('SECURITY_DEPOSIT');
                                                    setShowPaymentModal(true);
                                                }}
                                                className="text-[10px] font-bold px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/30"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className={`text-[10px] uppercase font-bold mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Security Deposit</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{user.securityDeposit ? Math.floor(user.securityDeposit).toLocaleString() : "30,000"}</span>
                                        <span className="text-[10px] font-bold text-slate-500">INR</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rent Escalation Card */}
                        <div className={`p-5 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${isDarkMode
                            ? 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10'
                            }`}>
                            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <TrendingUp size={80} />
                            </div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="mb-4">
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl dark:bg-blue-900/30 dark:text-blue-400 w-fit">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>

                                <div>
                                    <p className={`text-[10px] uppercase font-bold mb-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Rent Escalation</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.rentEscalation || "5"}%</span>
                                        <span className="text-[10px] font-bold text-slate-500">p.a.</span>
                                    </div>
                                    <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Next Increase: <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            {(() => {
                                                const startDateStr = user.start_date || user.startDate;
                                                if (!startDateStr) return "N/A";

                                                const dateParts = new Date(startDateStr);
                                                // Create date using local year, month, day to avoid timezone shifts
                                                const start = new Date(dateParts.getFullYear(), dateParts.getMonth(), dateParts.getDate());

                                                const now = new Date();
                                                // Normalize 'now' to start of day for accurate comparison
                                                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                                let next = new Date(start);
                                                next.setFullYear(next.getFullYear() + 1); // First escalation is after 1 year

                                                // If the calculated next date is in the past or today, move to next year
                                                while (next <= today) {
                                                    next.setFullYear(next.getFullYear() + 1);
                                                }
                                                return next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                                            })()}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Image Gallery Modal */}
            <ImageGalleryModal
                isOpen={showGallery}
                onClose={() => setShowGallery(false)}
                images={propertyImages}
                initialIndex={currentImageIndex}
            />
        </div>
    );
};

export default MyPropertyView;
