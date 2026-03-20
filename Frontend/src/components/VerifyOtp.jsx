import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Missing email. Please start from Forgot Password.');
      navigate('/forgot-password');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      toast.success('OTP verified');
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-[#020617] text-slate-50">
      <div className="w-full flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate('/forgot-password')}
            className="mb-6 inline-flex items-center text-sm text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-3">
              <ShieldCheck size={14} />
              <span>Secure verification</span>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-white">Enter OTP</h2>
            <p className="text-slate-400 text-sm">
              We've sent a 6-digit code to
              <span className="font-semibold text-slate-100"> {email || 'your email'} </span>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">One-Time Password (OTP)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                className="block w-full text-center tracking-[0.6em] text-lg font-semibold pl-4 pr-4 py-3.5 rounded-xl border bg-[#0f172a] border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:bg-[#1e293b]/50 outline-none transition-all"
                placeholder="••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] hover:shadow-lg hover:shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Verify OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
