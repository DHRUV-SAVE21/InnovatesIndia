import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ mode, onAddPoint }) {
    useMapEvents({
        click(e) {
            if (mode === 'manual') {
                onAddPoint(e.latlng);
            }
        },
    });
    return null;
}

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        // ALWAYS CLEAR OLD LOCATION (Fresh Policy)
        localStorage.removeItem('last_known_location');

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0 // Fresh data
        };

        const onLocationFound = (e) => {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 16);
            localStorage.setItem('last_known_location', JSON.stringify({
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                timestamp: Date.now(),
                status: 'gps'
            }));
        };

        const onLocationError = async (err) => {
            console.warn("GPS failed in LandMap. Trying IP.", err);
            try {
                const res = await fetch('https://ipapi.co/json/').then(r => r.json());
                if (res.latitude && res.longitude) {
                    const latlng = { lat: res.latitude, lng: res.longitude };
                    setPosition(latlng);
                    map.setView(latlng, 16);
                }
            } catch (ipErr) {
                console.error("IP fallback failed in LandMap.");
            }
        };

        map.locate(geoOptions)
            .on("locationfound", onLocationFound)
            .on("locationerror", onLocationError);
    }, [map]);

    return position === null ? null : (
        <Marker position={position} />
    );
}

const LandMap = ({ onPolygonChange, otherLands = [] }) => {
    const { t } = useTranslation();
    const [markers, setMarkers] = useState([]);
    const [mode, setMode] = useState('manual'); // 'manual' or 'tracking'
    const [trackingId, setTrackingId] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);

    // Initial center — null until GPS resolves (LocationMarker handles flyTo)
    const [initialCenter, setInitialCenter] = useState(null);

    useEffect(() => {
        // Try live IP as a quick initial center while GPS warms up
        fetch('https://ipapi.co/json/')
            .then(r => r.json())
            .then(data => {
                if (data.latitude && data.longitude) {
                    setInitialCenter([data.latitude, data.longitude]);
                }
            })
            .catch(() => setInitialCenter([20.5937, 78.9629])); // absolute last resort
    }, []);

    const handleAddPoint = (latlng) => {
        const newMarkers = [...markers, { lat: latlng.lat, lng: latlng.lng, accuracy: 5.0 }]; // Manual points assumed accurate (~5m)
        setMarkers(newMarkers);
        onPolygonChange(newMarkers);
    };

    const startTracking = () => {
        setMode('tracking');
        setMarkers([]); // Clear previous markers
        if (navigator.geolocation) {
            const id = navigator.geolocation.watchPosition(
                (position) => {
                    const latlng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    setCurrentPos(latlng);
                    setMarkers(prev => {
                        const newMarkers = [...prev, latlng];
                        onPolygonChange(newMarkers);
                        return newMarkers;
                    });
                },
                (error) => console.error(error),
                { enableHighAccuracy: true }
            );
            setTrackingId(id);
        }
    };

    const stopTracking = () => {
        if (trackingId !== null) {
            navigator.geolocation.clearWatch(trackingId);
            setTrackingId(null);
        }
        setMode('manual'); // Default back to manual
    };

    const clearMap = () => {
        setMarkers([]);
        onPolygonChange([]);
        stopTracking();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 mb-2">
                <button
                    className={`px-4 py-2 rounded ${mode === 'manual' ? 'bg-blue-600' : 'bg-gray-600'}`}
                    onClick={() => { stopTracking(); setMode('manual'); }}
                >
                    {t('manual_points')}
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'tracking' ? 'bg-green-600' : 'bg-gray-600'}`}
                    onClick={mode === 'tracking' ? stopTracking : startTracking}
                >
                    {mode === 'tracking' ? t('stop_tracking') : t('start_tracking')}
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-600"
                    onClick={clearMap}
                >
                    {t('clear_map')}
                </button>
            </div>

            <div className="h-[400px] w-full border rounded-lg overflow-hidden relative">
                {!initialCenter ? (
                    <div className="h-full flex items-center justify-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                        <span className="animate-pulse">📡 Detecting your location...</span>
                    </div>
                ) : (
                    <MapContainer center={initialCenter} zoom={15} maxZoom={19} scrollWheelZoom={true} className="h-full w-full">
                        <TileLayer
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        />
                        <LocationMarker />
                        <MapEvents mode={mode} onAddPoint={handleAddPoint} />

                        {/* Current Drawing */}
                        {markers.map((position, idx) => (
                            <Marker key={`marker-${idx}`} position={position} />
                        ))}

                        {markers.length > 2 && (
                            <Polygon
                                positions={markers}
                                pathOptions={{ color: 'green', fillColor: 'green' }}
                            />
                        )}

                        {/* Verified Lands from Backend */}
                        {Array.isArray(otherLands) && otherLands.map((land) => {
                            if (!land.polygon_coordinates) return null;
                            const positions = land.polygon_coordinates.map(p => [p.lat, p.lng]);
                            const color = land.status === 'VERIFIED' ? 'blue' : (land.status === 'REJECTED' ? 'red' : 'orange');

                            return (
                                <Polygon
                                    key={land.id}
                                    positions={positions}
                                    pathOptions={{ color: color, fillColor: color, fillOpacity: 0.2 }}
                                >
                                    <Popup>
                                        <div className="text-gray-900 text-sm">
                                            <strong>{t('status')}:</strong> {land.status}<br />
                                            <strong>{t('area')}:</strong> {land.area_sqm?.toFixed(2)} sqm<br />
                                            <span className="text-xs text-slate-500 dark:text-gray-500">ID: {land.id.substring(0, 8)}...</span>
                                        </div>
                                    </Popup>
                                </Polygon>
                            );
                        })}
                    </MapContainer>
                )}

                {/* Legend overlay */}
                <div className="absolute bottom-4 left-4 z-[400] bg-white p-2 rounded shadow text-xs text-black opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-green-500 rounded-full"></span> {t('your_drawing')}</div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> {t('verified_land')}</div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full"></span> {t('rejected_failed')}</div>
                </div>
            </div>

            <div className="text-sm text-slate-600 dark:text-gray-400">
                {markers.length} {t('points_recorded')}
            </div>
        </div>
    );
};

export default LandMap;
