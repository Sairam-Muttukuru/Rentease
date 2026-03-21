// import React, { useState } from 'react';
// import { X, CheckCircle, Smartphone, CreditCard, Building2, Wallet, ChevronRight, Hash, Loader2 } from 'lucide-react';
// import { toast } from 'react-toastify';

// const RazorpayCheckout = ({ amount, tenantId, propertyId, tenantName, onClose, onSuccess }) => {
//     const [method, setMethod] = useState('upi'); // upi | card | netbanking
//     const [loading, setLoading] = useState(false);
//     const [processing, setProcessing] = useState(false);
//     const [errorVpa, setErrorVpa] = useState('');
//     const [vpa, setVpa] = useState('');

//     // Mock UPI Apps
//     const upiApps = [
//         { id: 'gpay', name: 'Google Pay', icon: Smartphone, color: 'bg-blue-500' },
//         { id: 'phonepe', name: 'PhonePe', icon: Smartphone, color: 'bg-violet-600' },
//         { id: 'paytm', name: 'Paytm', icon: Smartphone, color: 'bg-sky-400' },
//     ];
 
//     // Mock NetBanking Banks
//     const banks = [
//         { id: 'hdfc', name: 'HDFC Bank', logo: 'H' },
//         { id: 'icici', name: 'ICICI Bank', logo: 'I' },
//         { id: 'sbi', name: 'SBI', logo: 'S' },
//         { id: 'axis', name: 'Axis Bank', logo: 'A' },
//     ];

//     const handlePay = async () => {
//         if (method === 'upi' && !vpa && !document.querySelector('input[type="radio"]:checked')) {
//             // If generic VPA input is empty and no app selected, show simplistic validation for demo
//             // But here we rely on the buttons.
//         }

//         setLoading(true);
//         setProcessing(true); // Show overlay

//         try {
//             const res = await fetch("/api/payment/create-razorpay", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
//                 },
//                 body: JSON.stringify({
//                     amount: amount,
//                     method: method, // 'upi', 'card', 'netbanking'
//                     tenant_id: tenantId,
//                     property_id: propertyId,
//                     paid_by: tenantName
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok) throw new Error(data.error || "Payment failed");

//             // Artificial Delay for "Real Feel"
//             setTimeout(() => {
//                 setProcessing(false);
//                 setLoading(false);
//                 onSuccess(data); // Return DB record
//             }, 2000);

//         } catch (err) {
//             console.error(err);
//             toast.error(err.message);
//             setProcessing(false);
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

//             {/* Processing Overlay */}
//             {processing && (
//                 <div className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center rounded-xl">
//                     <Loader2 className="w-12 h-12 text-violet-600 animate-spin mb-4" />
//                     <h3 className="text-xl font-bold text-gray-800">Processing Payment...</h3>
//                     <p className="text-gray-500">Please do not close this window</p>
//                 </div>
//             )}

//             <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden relative font-sans">

//                 {/* Header - Razorpay Style */}
//                 <div className="bg-[#2b2d42] text-white p-6 relative">
//                     <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors">
//                         <X size={20} className="opacity-80" />
//                     </button>
//                     <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
//                             <Building2 size={24} />
//                         </div>
//                         <div>
//                             <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">PAYING TO</p>
//                             <h2 className="font-bold text-lg leading-tight">RentEase Properties</h2>
//                         </div>
//                     </div>
//                     <div className="flex items-baseline gap-1">
//                         <span className="text-2xl font-bold">₹{amount.toLocaleString()}</span>
//                         <span className="text-blue-200 text-sm">.00</span>
//                     </div>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className="p-0 bg-gray-50 h-[400px] overflow-y-auto">

//                     {/* Preferred Method (UPI) */}
//                     <div className="bg-white p-4 mb-2 shadow-sm">
//                         <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
//                             <span className="w-1 h-3 bg-violet-500 rounded-full"></span> PREFERRED METHOD
//                         </p>
//                         <button
//                             onClick={() => setMethod('upi')}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${method === 'upi' ? 'border-violet-600 bg-violet-50' : 'border-gray-100 hover:border-violet-200'}`}
//                         >
//                             <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center p-2">
//                                 <Smartphone className="text-violet-600" />
//                             </div>
//                             <div className="text-left flex-1">
//                                 <p className="font-bold text-gray-800">UPI</p>
//                                 <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
//                             </div>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'upi' ? 'border-violet-600' : 'border-gray-300'}`}>
//                                 {method === 'upi' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full" />}
//                             </div>
//                         </button>

//                         {/* UPI Sub-options */}
//                         {method === 'upi' && (
//                             <div className="mt-3 pl-14 space-y-2 animate-in slide-in-from-top-2">
//                                 <div className="relative">
//                                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//                                         <Hash size={16} />
//                                     </div>
//                                     <input
//                                         type="text"
//                                         placeholder="Enter UPI ID (e.g. user@bank)"
//                                         className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
//                                         value={vpa}
//                                         onChange={(e) => setVpa(e.target.value)}
//                                     />
//                                     <button className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-violet-600 px-2 py-1 bg-violet-100 rounded hover:bg-violet-200">
//                                         VERIFY
//                                     </button>
//                                 </div>
//                                 <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-none">
//                                     {upiApps.map(app => (
//                                         <button key={app.id} className="flex flex-col items-center gap-1 min-w-[60px]">
//                                             <div className={`w-10 h-10 rounded-full ${app.color} text-white flex items-center justify-center shadow-md`}>
//                                                 <app.icon size={18} />
//                                             </div>
//                                             <span className="text-[10px] font-medium text-gray-600">{app.name}</span>
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Card Method */}
//                     <div className="bg-white p-4 mb-2 shadow-sm">
//                         <button
//                             onClick={() => setMethod('card')}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${method === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}
//                         >
//                             <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center">
//                                 <CreditCard className="text-blue-600" />
//                             </div>
//                             <div className="text-left flex-1">
//                                 <p className="font-bold text-gray-800">Card</p>
//                                 <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
//                             </div>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'card' ? 'border-blue-600' : 'border-gray-300'}`}>
//                                 {method === 'card' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
//                             </div>
//                         </button>
//                         {/* Card Form (Mock) */}
//                         {method === 'card' && (
//                             <div className="mt-3 pl-14 space-y-3 animate-in slide-in-from-top-2">
//                                 <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl text-white shadow-lg relative overflow-hidden">
//                                     <div className="absolute top-0 right-0 p-4 opacity-10"><CreditCard size={100} /></div>
//                                     <div className="relative z-10">
//                                         <p className="text-xs text-gray-400 mb-1">Card Number</p>
//                                         <p className="font-mono text-lg tracking-widest mb-4">4242 4242 4242 4242</p>
//                                         <div className="flex justify-between">
//                                             <div>
//                                                 <p className="text-[10px] text-gray-400">Expiry</p>
//                                                 <p className="font-medium">12/28</p>
//                                             </div>
//                                             <div>
//                                                 <p className="text-[10px] text-gray-400">CVV</p>
//                                                 <p className="font-medium">•••</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
//                                     <CheckCircle size={12} className="text-green-500" /> Securely saved for faster checkout
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                     {/* NetBanking Method */}
//                     <div className="bg-white p-4 shadow-sm">
//                         <button
//                             onClick={() => setMethod('netbanking')}
//                             className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${method === 'netbanking' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'}`}
//                         >
//                             <div className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center">
//                                 <Building2 className="text-emerald-600" />
//                             </div>
//                             <div className="text-left flex-1">
//                                 <p className="font-bold text-gray-800">NetBanking</p>
//                                 <p className="text-xs text-gray-500">All Indian banks supported</p>
//                             </div>
//                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === 'netbanking' ? 'border-emerald-600' : 'border-gray-300'}`}>
//                                 {method === 'netbanking' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
//                             </div>
//                         </button>
//                         {/* Bank Grid */}
//                         {method === 'netbanking' && (
//                             <div className="mt-3 pl-14 grid grid-cols-4 gap-2 animate-in slide-in-from-top-2">
//                                 {banks.map(bank => (
//                                     <button key={bank.id} className="flex flex-col items-center gap-1 p-2 border rounded-lg hover:bg-gray-50 transition-colors">
//                                         <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs shadow-sm">
//                                             {bank.logo}
//                                         </div>
//                                         <span className="text-[9px] font-medium text-gray-500 text-center leading-tight">{bank.name}</span>
//                                     </button>
//                                 ))}
//                                 <button className="flex flex-col items-center gap-1 p-2 border rounded-lg hover:bg-gray-50">
//                                     <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
//                                         <ChevronRight size={16} />
//                                     </div>
//                                     <span className="text-[9px] font-medium text-gray-500">More</span>
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 {/* Footer */}
//                 <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0">
//                     <button
//                         onClick={handlePay}
//                         disabled={loading}
//                         className="w-full bg-[#2b2d42] hover:bg-[#3d405b] text-white py-4 rounded-xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
//                     >
//                         {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()}`}
//                         {!loading && <ChevronRight size={20} />}
//                     </button>
//                     <div className="flex justify-center items-center gap-2 mt-3 opacity-60">
//                         <div className="flex gap-1">
//                             <div className="w-2 h-2 rounded-full bg-gray-400"></div>
//                             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
//                             <div className="w-2 h-2 rounded-full bg-gray-300"></div>
//                         </div>
//                         <span className="text-[10px] font-semibold text-gray-500">Secured by Stripe (Test)</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
// export default RazorpayCheckout;
