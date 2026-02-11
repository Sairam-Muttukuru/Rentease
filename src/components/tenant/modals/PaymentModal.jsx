import React from 'react';
import { X } from 'lucide-react';
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../RentPayment"; // Adjusted path to components/RentPayment (assuming it's in src/components/RentPayment.jsx or similar)
// Note: The original import was "../components/RentPayment". 
// Since we are in src/components/tenant/modals/, we need to go up 3 levels to src/components/
// verify path: src/components/tenant/modals -> src/components/tenant -> src/components -> src -> components is wrong.
// src/components/tenant/modals -> src/components/tenant -> src/components -> src
// Wait, components is in src/components.
// Path: ../../../components/RentPayment
// But the original import was `../components/RentPayment` from `src/pages/TenantDashboard.jsx`.
// `src/pages` -> `src/components`.
// So from `src/components/tenant/modals`, it is `../../../components/RentPayment`.

const PaymentModal = ({
    isDarkMode,
    setShowPaymentModal,
    rentDue,
    user,
    stripePromise,
    paymentType
}) => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative transition-all duration-500 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            {/* Glow effect */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

            <div className={`p-6 border-b flex justify-between items-center transition-colors duration-500 backdrop-blur-md ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white/50'}`}>
                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    {paymentType === 'SECURITY_DEPOSIT' ? 'Pay Security Deposit' : 'Pay Rent'}
                </h3>
                <button onClick={() => setShowPaymentModal(false)} className={`transition-colors rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                    <X size={20} />
                </button>
            </div>

            <div className="p-6">
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        amount={paymentType === 'SECURITY_DEPOSIT' ? (user.securityDeposit || 50000) : rentDue}
                        tenantId={user.id}
                        propertyId={user.propertyId}
                        tenantName={user.name}
                        isDarkMode={isDarkMode}
                        paymentType={paymentType}
                    />
                </Elements>
            </div>

        </div>
    </div>
);

export default PaymentModal;
