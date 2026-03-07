"use client";

import React, { useRef, useState, useEffect } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ItineraryContent } from '@/types/itinerary';
import { MapPin } from '@/components/Icons';

interface ItineraryMapProps {
    content: ItineraryContent;
}

export default function ItineraryMap({ content }: ItineraryMapProps) {
    const mapRef = useRef<any>(null);
    const [viewState, setViewState] = useState({
        longitude: 0,
        latitude: 0,
        zoom: 2
    });

    const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
    const [markers, setMarkers] = useState<{ lng: number, lat: number, title: string, type: 'daily' | 'hotel' }[]>([]);

    useEffect(() => {
        const coords: [number, number][] = [];
        const mapMarkers: { lng: number, lat: number, title: string, type: 'daily' | 'hotel' }[] = [];

        // 1. Get Hotel Locations First
        if (content.accommodation?.hotelRecommendations) {
            content.accommodation.hotelRecommendations.forEach(hotel => {
                if (hotel.locationCoordinates) {
                    const lng = Array.isArray(hotel.locationCoordinates) ? hotel.locationCoordinates[0] : (hotel.locationCoordinates as any).longitude;
                    const lat = Array.isArray(hotel.locationCoordinates) ? hotel.locationCoordinates[1] : (hotel.locationCoordinates as any).latitude;

                    if (typeof lng === 'number' && typeof lat === 'number') {
                        coords.push([lng, lat]);
                        mapMarkers.push({
                            lng,
                            lat,
                            title: hotel.name,
                            type: 'hotel'
                        });
                    }
                }
            });
        }

        // 2. Get Daily Activities
        const days = content.days || (content as any).dailyItinerary;
        if (days && Array.isArray(days)) {
            days.forEach(day => {
                // Handle the array of coordinates on the day object (Schema v2)
                if (day.locationCoordinates && Array.isArray(day.locationCoordinates)) {
                    day.locationCoordinates.forEach((coord: any) => {
                        const lng = typeof coord.longitude === 'number' ? coord.longitude : coord[0];
                        const lat = typeof coord.latitude === 'number' ? coord.latitude : coord[1];

                        if (typeof lng === 'number' && typeof lat === 'number') {
                            coords.push([lng, lat]);
                            mapMarkers.push({
                                lng,
                                lat,
                                title: day.title || 'Stop',
                                type: 'daily'
                            });
                        }
                    });
                }

                // Fallback for older schema where coordinates were on specific activities
                const addIfHasCoords = (activity: any) => {
                    if (activity && activity.locationCoordinates) {
                        const lng = Array.isArray(activity.locationCoordinates) ? activity.locationCoordinates[0] : activity.locationCoordinates.longitude;
                        const lat = Array.isArray(activity.locationCoordinates) ? activity.locationCoordinates[1] : activity.locationCoordinates.latitude;

                        if (typeof lng === 'number' && typeof lat === 'number') {
                            coords.push([lng, lat]);
                            mapMarkers.push({
                                lng,
                                lat,
                                title: activity.activity || activity.location || 'Stop',
                                type: 'daily'
                            });
                        }
                    }
                };

                addIfHasCoords(day.morning);
                addIfHasCoords(day.afternoon);
                addIfHasCoords(day.evening);
            });
        }

        if (coords.length > 0) {
            setRouteCoordinates(coords);
            setMarkers(mapMarkers);

            // Calculate bounding box to fit all markers
            if (coords.length === 1) {
                setViewState({
                    longitude: coords[0][0],
                    latitude: coords[0][1],
                    zoom: 12
                });
            } else {
                // Average for simple centering (Mapbox has fitBounds, but requires map instance)
                const lngSum = coords.reduce((acc, curr) => acc + curr[0], 0);
                const latSum = coords.reduce((acc, curr) => acc + curr[1], 0);
                setViewState({
                    longitude: lngSum / coords.length,
                    latitude: latSum / coords.length,
                    zoom: 10 // Approximate, ideally use fitBounds
                });
            }
        }
    }, [content]);

    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
        return <div className="p-4 text-center bg-gray-100 rounded-lg dark:bg-zinc-800">Mapbox token is missing.</div>;
    }

    if (routeCoordinates.length === 0) {
        return <div className="p-8 text-center bg-gray-50 rounded-lg dark:bg-zinc-800 text-gray-500">No mappable locations found in this itinerary yet. Add locations to the Daily Plan or Hotels.</div>;
    }

    const geojson: any = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates
                }
            }
        ]
    };

    return (
        <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden relative border border-gray-200 dark:border-zinc-800">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt: any) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            >
                <NavigationControl position="bottom-right" />

                <Source id="route" type="geojson" data={geojson}>
                    <Layer
                        id="route-line"
                        type="line"
                        paint={{
                            'line-color': '#ec4899', // Pink theme
                            'line-width': 4,
                            'line-opacity': 0.8,
                            'line-dasharray': [2, 2] // Dashed line for route
                        }}
                    />
                </Source>

                {markers.map((marker, index) => (
                    <Marker
                        key={`marker-${index}`}
                        longitude={marker.lng}
                        latitude={marker.lat}
                        anchor="bottom"
                    >
                        <div className="group relative flex flex-col items-center cursor-pointer">
                            <div className="absolute bottom-full mb-1 bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                {marker.title}
                            </div>
                            <div className={`p-1 rounded-full ${marker.type === 'hotel' ? 'bg-blue-500' : 'bg-pink-500'} text-white shadow-md transform hover:scale-110 transition-transform`}>
                                <MapPin size={20} />
                            </div>
                        </div>
                    </Marker>
                ))}
            </Map>
        </div>
    );
}
