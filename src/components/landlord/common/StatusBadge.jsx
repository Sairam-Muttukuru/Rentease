import React from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        "Good Standing": "bg-slate-800 text-slate-300 border-slate-700",
        Occupied: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        Overdue: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        Late: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
        Resolved: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        Open: "bg-violet-500/10 text-violet-500 border-violet-500/20",
        Vacant: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        Rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    };

    const displayStyle = styles[status] || styles.Resolved;

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold border backdrop-blur-sm transition-colors duration-500 ${displayStyle}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
