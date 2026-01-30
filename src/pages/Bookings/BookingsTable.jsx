import { Home, CheckCircle2, X } from "lucide-react";
import { Card } from "../../components/ui/card"; // Assuming Card component exists or use direct styling if not

export default function BookingsTable({ isDarkMode, bookings, onStatusUpdate }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className={`text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Property Bookings
        </h2>
        <p className={`mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Review and manage booking requests
        </p>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Property</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Applicant</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Move-In</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Offer</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
                <th className={`p-6 text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {bookings.map(booking => (
                <tr key={booking.id} className={`group transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <Home size={16} className="text-violet-500" />
                      </div>
                      <div>
                        <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.propertyName}</p>
                        <p className="text-xs text-slate-500">{booking.location || 'Location Not Set'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                        {booking.tenantName.charAt(0)}
                      </div>
                      <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{booking.tenantName}</span>
                    </div>
                  </td>
                  <td className={`p-6 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{booking.moveInDate}</td>
                  <td className={`p-6 font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>₹{booking.rentOffered.toLocaleString()}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        booking.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-6">
                    {booking.status === "Pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onStatusUpdate(booking.id, "Approved")}
                          className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button
                          onClick={() => onStatusUpdate(booking.id, "Rejected")}
                          className="p-2 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
