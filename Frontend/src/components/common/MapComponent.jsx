import React from 'react';
import { MapPin } from 'lucide-react';

const MapComponent = ({ address }) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;

    if (!apiKey) {
        return (
            <div className="w-full h-80 bg-gray-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-dashed border-gray-300 dark:border-white/10 p-8 text-center">
                <div className="p-4 bg-violet-500/10 text-violet-500 rounded-full mb-4">
                    <MapPin size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Map View Not Configured</h4>
                <p className="text-gray-500 max-w-md"> Please add <code className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your <code className="bg-gray-200 dark:bg-white/10 px-2 py-1 rounded">.env</code> file to enable the map view.</p>
                <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 text-sm">
                    <strong>Preview Address:</strong> {address}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg group">
            <div className="relative h-96 w-full">
                <iframe
                    title="Property Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen
                    loading="lazy"
                    className="transition-all duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Live Location</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;
