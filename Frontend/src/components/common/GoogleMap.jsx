import React, { useMemo, useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const GoogleMapComponent = ({
    properties = [],
    center,
    zoom = 13,
    onMarkerClick,
    singleProperty = false
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const [selectedProperty, setSelectedProperty] = useState(null);

    const mapCenter = useMemo(() => {
        if (center) return center;
        if (properties.length > 0) {
            return {
                lat: parseFloat(properties[0].latitude) || 0,
                lng: parseFloat(properties[0].longitude) || 0,
            };
        }
        return { lat: 13.6288, lng: 79.4192 }; // Default: Tirupati
    }, [center, properties]);

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (!isLoaded) return <div className="w-full h-full bg-gray-100 animate-pulse rounded-3xl" />;

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                zoomControl: true,
            }}
        >
            {properties.map((property) => (
                <Marker
                    key={property.id}
                    position={{
                        lat: parseFloat(property.latitude),
                        lng: parseFloat(property.longitude)
                    }}
                    onClick={() => {
                        setSelectedProperty(property);
                        if (onMarkerClick) onMarkerClick(property);
                    }}
                    label={!singleProperty ? {
                        text: `\u20B9${(property.price / 1000).toFixed(1)}k`,
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        className: 'map-label'
                    } : null}
                    icon={!singleProperty ? {
                        path: 'M 0,0 L 40,0 L 40,20 L 25,20 L 20,25 L 15,20 L 0,20 Z',
                        fillColor: '#8B5CF6',
                        fillOpacity: 1,
                        strokeWeight: 0,
                        labelOrigin: new window.google.maps.Point(20, 10),
                        anchor: new window.google.maps.Point(20, 25)
                    } : undefined}
                />
            ))}

            {selectedProperty && !singleProperty && (
                <InfoWindow
                    position={{
                        lat: parseFloat(selectedProperty.latitude),
                        lng: parseFloat(selectedProperty.longitude)
                    }}
                    onCloseClick={() => setSelectedProperty(null)}
                >
                    <div className="p-2 max-w-[200px] bg-white text-black rounded-lg">
                        <img
                            src={selectedProperty.images?.[0]?.url || selectedProperty.images?.[0]?.image_url}
                            alt={selectedProperty.title}
                            className="w-full h-24 object-cover rounded-md mb-2"
                        />
                        <h4 className="font-bold text-sm truncate">{selectedProperty.title}</h4>
                        <p className="text-violet-600 font-bold text-sm">₹{selectedProperty.price.toLocaleString()}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default React.memo(GoogleMapComponent);
