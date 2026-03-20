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

    // Helper to get POI icons
    const getPoiIcon = (category) => {
        let color = '#8B5CF6'; // Default violet
        switch (category) {
            case 'education': color = '#8B5CF6'; break;
            case 'healthcare': color = '#F43F5E'; break;
            case 'commute': color = '#3B82F6'; break;
            case 'food': color = '#F97316'; break;
            case 'shopping': color = '#10B981'; break;
            default: color = '#64748B';
        }

        return L.divIcon({
            className: 'custom-poi-marker',
            html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 10px; display: flex; items-center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); transform: rotate(45deg);"><div style="transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;"><div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div></div></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
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
                    .leaflet-popup-content-wrapper {
                        background: white;
                        color: #1a1a1a;
                        border-radius: 16px;
                        padding: 0;
                        overflow: hidden;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
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
                    const position = [
                        parseFloat(property.latitude),
                        parseFloat(property.longitude)
                    ];

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
                            }) : DefaultIcon}
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
