import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ImageGalleryModal = ({ isOpen, onClose, images = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    if (!images || images.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
                <div className="text-white flex flex-col items-center">
                    <ImageIcon size={48} className="mb-4 text-slate-500" />
                    <p>No images available for this property.</p>
                    <button onClick={onClose} className="mt-8 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all z-[60]"
            >
                <X size={24} />
            </button>

            {/* Navigation - Left */}
            {images.length > 1 && (
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all z-[60] opacity-0 hover:opacity-100 sm:opacity-100"
                >
                    <ChevronLeft size={32} />
                </button>
            )}

            {/* Main Image Container */}
            <div
                className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={images[currentIndex]?.image_url || images[currentIndex]}
                    alt={`Property view ${currentIndex + 1}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                />

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            {/* Navigation - Right */}
            {images.length > 1 && (
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all z-[60] opacity-0 hover:opacity-100 sm:opacity-100"
                >
                    <ChevronRight size={32} />
                </button>
            )}

            {/* Keyboard Support */}
            {/* Note: In a real app, adding keydown listeners for Escape, Left, Right would be good */}
        </div>
    );
};

export default ImageGalleryModal;
