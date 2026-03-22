import React, { useState } from 'react';
import { Home, UserCheck, UserX } from 'lucide-react';
import { Card } from '../../ui/card';

const LandlordBookingsView = ({ isDarkMode, bookings, onUpdateStatus, onRentToApplicant }) => {
    const [filter, setFilter] = useState('All');
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');

    const handleApproveClick = (booking) => {
        setSelectedBooking(booking);
        if (booking.visit_slot) {
            const date = new Date(booking.visit_slot);
            // Use local time components to avoid UTC shift
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setVisitDate(`${year}-${month}-${day}`);

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            setVisitTime(`${hours}:${minutes}`);
        }
        setIsApproveModalOpen(true);
    };

    const confirmApproval = () => {
        if (!visitDate || !visitTime) return;
        const visitSlot = new Date(`${visitDate}T${visitTime}`);
        onUpdateStatus(selectedBooking.id, 'Approved', visitSlot.toISOString());
        setIsApproveModalOpen(false);
        setSelectedBooking(null);
        setVisitDate('');
        setVisitTime('');
    };

    const filteredBookings = filter === 'All'
        ? bookings
        : bookings.filter(b => b.status.toUpperCase() === filter.toUpperCase());

    const getStatusStyle = (status) => {
        switch (status.toUpperCase()) {
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'VISITED': return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Bookings</h2>
                    <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage applicant requests and vetting</p>
                </div>
                <div className={`flex gap-2 p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                    {['All', 'Pending', 'Approved', 'Visited', 'Rejected'].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === opt
                                ? 'bg-violet-600 text-white shadow-lg'
                                : isDarkMode
                                    ? 'text-slate-400 hover:text-white'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <Card isDarkMode={isDarkMode} className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property</th>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Applicant</th>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date Requested</th>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>User Type</th>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Action</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                                <Home size={16} className="text-violet-500" />
                                            </div>
                                            <div>
                                                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.propertyName}</p>
                                                <p className="text-xs text-slate-500">{booking.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{booking.tenantName}</span>
                                            {booking.email && <span className="text-xs text-slate-500">{booking.email}</span>}
                                        </div>
                                    </td>
                                    <td className={`p-6 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </td>
                                    <td className={`p-6 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.userType}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-3 py-1 w-fit rounded-full text-xs font-black uppercase tracking-wide border ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                            {['Approved', 'APPROVED'].includes(booking.status) && booking.visit_slot && (
                                                <span className={`text-xs font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                    Visit: {new Date(booking.visit_slot).toLocaleString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                            {['Pending', 'PENDING'].includes(booking.status) && booking.visit_slot && (
                                                <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                    Requested: {new Date(booking.visit_slot).toLocaleString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2">
                                            {['Pending', 'PENDING'].includes(booking.status) && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproveClick(booking)}
                                                        className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all font-bold text-xs flex items-center gap-2"
                                                        title="Approve"
                                                    >
                                                        <UserCheck size={14} /> Accept
                                                    </button>
                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, 'Rejected')}
                                                        className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all font-bold text-xs flex items-center gap-2"
                                                        title="Reject"
                                                    >
                                                        <UserX size={14} /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {['Approved', 'APPROVED'].includes(booking.status) && (
                                                <>
                                                    <button
                                                        onClick={() => onUpdateStatus(booking.id, 'Visited')}
                                                        className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all font-bold text-xs flex items-center gap-2 shadow-lg shadow-violet-500/20"
                                                        title="Mark as Visited"
                                                    >
                                                        <UserCheck size={14} /> Visited
                                                    </button>
                                                    <button
                                                        onClick={() => handleApproveClick(booking)}
                                                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-bold text-xs flex items-center gap-2"
                                                        title="Reschedule Visit"
                                                    >
                                                        <UserCheck size={14} /> Reschedule
                                                    </button>
                                                </>
                                            )}
                                            {['Visited', 'VISITED'].includes(booking.status) && (
                                                <button
                                                    onClick={() => onRentToApplicant(booking)}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                                    title="Move in as Tenant"
                                                >
                                                    <UserCheck size={14} /> Rent to Applicant
                                                </button>
                                            )}
                                            {!['Pending', 'PENDING', 'Approved', 'APPROVED', 'Visited', 'VISITED'].includes(booking.status) && (
                                                <button
                                                    onClick={() => onUpdateStatus(booking.id, 'PENDING')}
                                                    className="text-xs font-bold text-slate-500 hover:text-violet-500 transition-colors"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Approval Modal */}
            {
                isApproveModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Approve Booking</h3>
                            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Select a visit time slot for <strong>{selectedBooking?.tenantName}</strong>.
                            </p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date</label>
                                    <input
                                        type="date"
                                        value={visitDate}
                                        onChange={(e) => setVisitDate(e.target.value)}
                                        className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} outline-none focus:ring-2 focus:ring-violet-500`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Time</label>
                                    <input
                                        type="time"
                                        value={visitTime}
                                        onChange={(e) => setVisitTime(e.target.value)}
                                        className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} outline-none focus:ring-2 focus:ring-violet-500`}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsApproveModalOpen(false)}
                                    className={`px-4 py-2 rounded-lg font-bold ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmApproval}
                                    disabled={!visitDate || !visitTime}
                                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Confirm & Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LandlordBookingsView;
