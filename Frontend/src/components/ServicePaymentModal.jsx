import React from 'react';
import { X, Shield } from 'lucide-react';
import { Elements } from "@stripe/react-stripe-js";
import ServiceCheckoutForm from "./ServiceCheckoutForm";

const ServicePaymentModal = ({
    isDarkMode,
    onClose,
    booking,
    stripePromise,
    userName,
    onSuccess
}) => (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
        <div className={`w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            
            {/* Emerald Accent Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600"></div>

            <div className={`px-8 py-6 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white'}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Service Payout</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure Transaction</p>
                    </div>
                </div>
                <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'}`}>
                    <X size={20} />
                </button>
            </div>

            <div className="p-8">
                <div className="mb-6">
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Paying for: <span className="text-emerald-500">{booking.service_name}</span>
                    </p>
                </div>

                <Elements stripe={stripePromise}>
                    <ServiceCheckoutForm
                        amount={booking.amount}
                        bookingId={booking.id}
                        userName={userName}
                        isDarkMode={isDarkMode}
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                </Elements>
            </div>
        </div>
    </div>
);

export default ServicePaymentModal;
