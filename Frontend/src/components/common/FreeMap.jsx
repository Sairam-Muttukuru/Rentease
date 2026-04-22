import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center the map when properties change
function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const FreeMap = ({
    properties = [],
    pois = [], // New prop for Points of Interest
    center,
    zoom = 13,
    singleProperty = false
}) => {
    const mapCenter = useMemo(() => {
        if (center) return center;
        if (properties.length > 0) {
            return [
                parseFloat(properties[0].latitude) || 13.6288,
                parseFloat(properties[0].longitude) || 79.4192,
            ];
        }
        return [13.6288, 79.4192]; // Tirupati
    }, [center, properties]);

    // Realistic/Natural colors (OpenStreetMap)
    const mapStyle = {
        height: '100%',
        width: '100%',
    };

    const getHomeIcon = (imageUrl) => {
        const fallbackIcon = `<svg viewBox="0 0 24 24" width="28" height="28" fill="white" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
        const imgHtml = imageUrl ? 
            `<img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; transform: rotate(45deg) scale(1.4);" />` :
            `<div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center;">${fallbackIcon}</div>`;

        return L.divIcon({
            className: 'home-marker',
            html: `
                <div style="position: relative; width: 84px; height: 84px;">
                    <div class="pulse-ring"></div>
                    <div style="
                        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); 
                        width: 74px; 
                        height: 74px; 
                        border-radius: 50% 50% 50% 0; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        border: 3px solid rgba(255,255,255,0.9); 
                        box-shadow: 0 15px 35px rgba(99, 102, 241, 0.4), inset 0 0 15px rgba(255,255,255,0.2); 
                        transform: rotate(-45deg);
                        overflow: hidden;
                        z-index: 10;
                        backdrop-filter: blur(8px);
                    ">
                        ${imgHtml}
                    </div>
                    <div style="
                        position: absolute;
                        bottom: -15px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: white;
                        color: #4F46E5;
                        font-size: 11px;
                        font-weight: 900;
                        padding: 3px 12px;
                        border-radius: 30px;
                        border: 1px solid rgba(0,0,0,0.05);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        z-index: 11;
                        white-space: nowrap;
                        letter-spacing: 0.5px;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        text-transform: uppercase;
                    ">
                        <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        Selected
                    </div>
                </div>
            `,
            iconSize: [84, 84],
            iconAnchor: [42, 84]
        });
    };

    // POI Icons with SVG support
    const getPoiIcon = (category) => {
        let color = '#8B5CF6'; 
        let svg = '';
        switch (category) {
            case 'education': 
                color = '#8B5CF6'; 
                svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.89 9L12 4.57 20.11 9 12 13.43 3.89 9zM18 13v2.35l-6 3.27-6-3.27V13l6 3 6-3z"/></svg>';
                break;
            case 'healthcare': 
                color = '#F43F5E';
                // Heart icon - guaranteed NO PLUS symbol
                svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white" stroke="white" stroke-width="1.5"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
                break;
            case 'commute': 
                color = '#3B82F6';
                svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4zM8 6h8v5h-8V6zm4 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>';
                break;
            case 'food': 
                color = '#F97316';
                svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>';
                break;
            case 'shopping': 
                color = '#10B981';
                svg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 1.99 2H19c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/></svg>';
                break;
            default: color = '#64748B'; svg = '';
        }

        return L.divIcon({
            className: 'custom-poi-marker',
            html: `<div style="background: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 6px 15px rgba(0,0,0,0.3); transform: scale(1); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">${svg}</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });
    };

    return (
        <div className="w-full h-full relative overflow-hidden rounded-3xl">
            <style>
                {`
                    .leaflet-container {
                        background: #f0f0f0 !important;
                    }
                    .custom-marker-price {
                        background: #8B5CF6;
                        color: white;
                        font-weight: bold;
                        padding: 4px 10px;
                        border-radius: 999px;
                        font-size: 13px;
                        border: 2px solid white;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        white-space: nowrap;
                    }
                    .pulse-ring {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 70px;
                        height: 70px;
                        border: 4px solid #8B5CF6;
                        border-radius: 50% 50% 50% 0;
                        animation: pulse 2s infinite;
                        transform: rotate(-45deg);
                        z-index: 1;
                    }
                    @keyframes pulse {
                        0% { transform: rotate(-45deg) scale(0.9); opacity: 0.8; }
                        70% { transform: rotate(-45deg) scale(1.5); opacity: 0; }
                        100% { transform: rotate(-45deg) scale(0.9); opacity: 0; }
                    }
                    .leaflet-popup-content-wrapper {
                        background: white;
                        color: #1a1a1a;
                        border-radius: 20px;
                        padding: 0;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    }
                    .leaflet-popup-tip {
                        background: white;
                    }
                    .custom-popup .leaflet-popup-content {
                        margin: 0 !important;
                        width: 220px !important;
                    }
                `}
            </style>
            <MapContainer
                center={mapCenter}
                zoom={zoom}
                style={mapStyle}
                zoomControl={false}
                scrollWheelZoom={true}
            >
                <ChangeView center={mapCenter} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Property Markers */}
                {properties.map((property) => {
                    const propLat = parseFloat(property.latitude);
                    const propLng = parseFloat(property.longitude);
                    
                    // If we are in single property view, ensure the marker is exactly at the map center fallback if needed
                    const position = (singleProperty && (isNaN(propLat) || propLat === 0)) 
                        ? mapCenter 
                        : [propLat, propLng];

                    if (isNaN(position[0]) || isNaN(position[1])) return null;

                    return (
                        <Marker
                            key={property.id}
                            position={position}
                            icon={!singleProperty ? L.divIcon({
                                className: 'price-marker',
                                html: `<div class="custom-marker-price">₹${(property.price / 1000).toFixed(1)}k</div>`,
                                iconSize: [50, 20],
                                iconAnchor: [25, 20]
                            }) : getHomeIcon(property.images?.[0]?.url || property.images?.[0]?.image_url)}
                            zIndexOffset={1000}
                        >
                            <Popup minWidth={220} className="custom-popup">
                                <div className="overflow-hidden">
                                    <img
                                        src={property.images?.[0]?.url || property.images?.[0]?.image_url}
                                        alt={property.title}
                                        className="w-full h-28 object-cover"
                                    />
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm text-gray-900 truncate mb-1">{property.title}</h4>
                                        <p className="text-violet-600 font-extrabold text-sm">₹{property.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}

                {/* POI Markers */}
                {pois.map((poi, idx) => (
                    <Marker
                        key={`poi-${idx}`}
                        position={[poi.latitude, poi.longitude]}
                        icon={getPoiIcon(poi.category)}
                    >
                        <Popup>
                            <div className="p-2">
                                <h4 className="font-bold text-gray-900">{poi.name}</h4>
                                <p className="text-xs text-gray-500">{poi.distance} away</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default FreeMap;
