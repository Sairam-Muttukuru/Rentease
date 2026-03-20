import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ImageGalleryModal = ({ isOpen, onClose, images = [], initialIndex = 0, isDarkMode }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';

            const handleKeyDown = (e) => {
                if (e.key === 'Escape') onClose();
                if (e.key === 'ArrowRight') handleNext();
                if (e.key === 'ArrowLeft') handlePrev();
            };
            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen, initialIndex]);

    const handleNext = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        if (e) e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl animate-in fade-in duration-300 ${isDarkMode ? 'bg-slate-950/98' : 'bg-white/95'}`}
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className={`absolute top-8 right-8 p-3.5 rounded-full transition-all z-[10000] hover:rotate-90 duration-300 shadow-2xl ${isDarkMode
                        ? 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/5'
                        : 'bg-black/5 text-slate-700 hover:text-black hover:bg-black/10 border border-black/5'
                    }`}
            >
                <X size={28} />
            </button>

            {/* Navigation - Left */}
            {images.length > 1 && (
                <button
                    onClick={handlePrev}
                    className={`absolute left-8 top-1/2 -translate-y-1/2 p-5 rounded-full backdrop-blur-md transition-all z-[10000] shadow-2xl flex items-center justify-center group/btn hover:scale-110 ${isDarkMode
                            ? 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                            : 'bg-white/50 text-slate-700 hover:text-black hover:bg-white border border-slate-200'
                        }`}
                    aria-label="Previous image"
                >
                    <ChevronLeft size={40} className="group-hover/btn:-translate-x-1 transition-transform" />
                </button>
            )}

            {/* Main Image Container */}
            <div
                className="relative max-w-7xl max-h-[85vh] w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative group">
                    <img
                        src={images[currentIndex]?.image_url || images[currentIndex]}
                        alt={`Property view ${currentIndex + 1}`}
                        className={`max-h-[85vh] max-w-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-500 ring-1 ${isDarkMode ? 'ring-white/10' : 'ring-black/5'}`}
                    />

                    {/* Subtle Internal Navigation Overlay */}
                    <div className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize" onClick={handlePrev}></div>
                    <div className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize" onClick={handleNext}></div>
                </div>

                {/* Counter Badge */}
                <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full backdrop-blur-md border text-xs font-bold shadow-2xl tracking-[0.3em] uppercase ${isDarkMode
                        ? 'bg-white/5 border-white/10 text-white/80'
                        : 'bg-black/5 border-black/5 text-slate-700'
                    }`}>
                    {currentIndex + 1} <span className={`mx-3 ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}>/</span> {images.length}
                </div>
            </div>

            {/* Navigation - Right */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className={`absolute right-8 top-1/2 -translate-y-1/2 p-5 rounded-full backdrop-blur-md transition-all z-[10000] shadow-2xl flex items-center justify-center group/btn hover:scale-110 ${isDarkMode
                            ? 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                            : 'bg-white/50 text-slate-700 hover:text-black hover:bg-white border border-slate-200'
                        }`}
                    aria-label="Next image"
                >
                    <ChevronRight size={40} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            )}
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ImageGalleryModal;


