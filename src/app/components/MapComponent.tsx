"use client";
import React, { useEffect } from "react";
import { MeterType } from "@/schemas/meters";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // CSS import fontos
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Default marker ikon fix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface MapComponentProps {
  gasMeters: MeterType[];
  electricityMeters: MeterType[];
}
const FitMapBounds = ({ gasMeters, electricityMeters }: MapComponentProps) => {
  const map = useMap();

  useEffect(() => {
    const allMeters = [...gasMeters, ...electricityMeters];
    if (allMeters.length > 0) {
      const bounds = L.latLngBounds(
        allMeters.map((meter) => [meter.location.lat, meter.location.lon])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [map, gasMeters, electricityMeters]);

  return null;
};
const MapComponent = ({ gasMeters, electricityMeters }: MapComponentProps) => {
  return (
    <div>
      <MapContainer
        center={[47.5, 19.0]}
        zoom={7}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FitMapBounds
          gasMeters={gasMeters}
          electricityMeters={electricityMeters}
        />
        {gasMeters.map((meter) => (
          <Marker
            key={meter.id}
            position={[meter.location.lat, meter.location.lon]}
          >
            <Popup>
              {meter.label} - Gáz ({meter.unit})
            </Popup>
          </Marker>
        ))}

        {electricityMeters.map((meter) => (
          <Marker
            key={meter.id}
            position={[meter.location.lat, meter.location.lon]}
          >
            <Popup>
              {meter.label} - Elektromos ({meter.unit})
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
