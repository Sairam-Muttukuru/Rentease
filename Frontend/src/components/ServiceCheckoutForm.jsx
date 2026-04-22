import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { CreditCard, CheckCircle, ShieldCheck, X, Loader2, Receipt, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import BASE_URL from "../utils/apiConfig";

// Custom styling for the Stripe Element field
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const ServiceCheckoutForm = ({ amount, bookingId, userName, isDarkMode, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  console.log("💳 Service Checkout Form. Mode:", isDarkMode ? "Dark" : "Light");

  // Dynamic Stripe Element Options
  const cardElementOptions = {
    style: {
      base: {
        color: isDarkMode ? "#ffffff" : "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: isDarkMode ? "#94a3b8" : "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || success) return;

    setLoading(true);
    setErrorStatus(false);
    setErrorMessage("");

    try {
      // 1️⃣ Create payment intent
      const res = await fetch(`${BASE_URL}/api/payment/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error("Failed to initialize payment");

      const { clientSecret } = await res.json();

      // 2️⃣ Create Payment Method
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: userName,
        },
      });

      if (pmError) throw new Error(pmError.message);

      // 3️⃣ Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // 4️⃣ Payment Success - Save to DB
      if (result.paymentIntent?.status === "succeeded") {
        const txId = result.paymentIntent.id;

        const saveRes = await fetch(`${BASE_URL}/api/payment/service-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            service_request_id: bookingId,
            amount: amount,
            transaction_id: txId
          }),
        });

        if (!saveRes.ok) {
          const errData = await saveRes.json();
          throw new Error(errData.error || "DB save failed after Stripe success");
        }

        const data = await saveRes.json();
        setReceiptNumber(data.receipt_number);
        setSuccess(true);
        setLoading(false);
        toast.success("Payment successful!");
        
        if (onSuccess) onSuccess();
        setTimeout(() => {
            if (onClose) onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Payment failed:", err);
      setErrorStatus(true);
      setErrorMessage(err.message || "Payment failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* 🟢 Success Overlay */}
      {success && (
        <div className="absolute inset-0 bg-white/95 dark:bg-slate-900 border border-emerald-500/20 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 transition-all">
            <CheckCircle className="text-emerald-600 dark:text-emerald-400 w-10 h-10 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Payment Received!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Receipt sent to your email.</p>
          <p className="text-[10px] font-mono text-emerald-500 mt-4 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">{receiptNumber}</p>
        </div>
      )}

      {/* 💳 Payment Form */}
      <form onSubmit={handleSubmit} className={`space-y-6 ${errorStatus ? "animate-shake" : ""}`}>
        
        <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 mb-2">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Total Payout</span>
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-300">₹{amount.toLocaleString()}</span>
            </div>
        </div>

        {/* Card Input Container */}
        <div className="space-y-2">
          <label className={`text-[10px] font-black uppercase tracking-widest flex justify-between ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>Secure Card Entry</span>
            <span className="flex items-center gap-1"><ShieldCheck size={10} /> PCI Certified</span>
          </label>
          <div className={`p-4 border-2 rounded-2xl transition-all shadow-sm ${isDarkMode
            ? "bg-slate-800/50 border-slate-700 focus-within:border-emerald-500/50"
            : "bg-slate-50 border-slate-100 focus-within:border-emerald-500/50"
            }`}>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <XCircle size={16} /> {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || loading || success}
          className={`
            w-full py-4 rounded-2xl font-black text-white shadow-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm uppercase tracking-widest
            ${loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 active:scale-[0.98]"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" /> Verifying...
            </>
          ) : (
            <>
              <CreditCard size={18} /> Confirm Payment
            </>
          )}
        </button>

        <div className="flex justify-center items-center gap-2 text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-tighter">
          <ShieldCheck size={12} className="text-slate-300" />
          <span>Encrypted via Stripe Gateway</span>
        </div>
      </form>

      <style>{`
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default ServiceCheckoutForm;
