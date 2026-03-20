import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 h-full animate-pulse">
            <div className="h-72 bg-white/5" /> {/* Image placeholder */}

            <div className="p-6">
                <div className="h-6 w-3/4 bg-white/5 rounded-lg mb-4" /> {/* Title */}
                <div className="h-4 w-1/2 bg-white/5 rounded-lg mb-6" /> {/* Location */}

                <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="h-12 bg-white/5 rounded-xl" />
                    <div className="h-12 bg-white/5 rounded-xl" />
                    <div className="h-12 bg-white/5 rounded-xl" />
                </div>

                <div className="flex gap-3 mt-auto">
                    <div className="h-10 flex-1 bg-white/5 rounded-xl" />
                    <div className="h-10 flex-[2] bg-white/5 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
