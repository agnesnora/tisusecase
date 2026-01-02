"use client";
import { MeterType } from "@/schemas/meters";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LuFlame, LuZap } from "react-icons/lu";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import styles from "../styles/MapComponent.module.scss";

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

const gasIconHTML = renderToStaticMarkup(
  <div className={`${styles.icon} ${styles.gas}`}>
    <LuFlame size={20} />
  </div>
);

const customGasIcon = L.divIcon({
  html: gasIconHTML,
  className: "custom-div-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const elecIconHTML = renderToStaticMarkup(
  <div className={`${styles.icon} ${styles.electric}`}>
    <LuZap size={20} />
  </div>
);

const customElecIcon = L.divIcon({
  html: elecIconHTML,
  className: "custom-div-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const MapComponent = ({ gasMeters, electricityMeters }: MapComponentProps) => {
  return (
    <div className={styles.container}>
      <MapContainer
        center={[47.5, 19.0]}
        zoom={7}
        className={styles.mapContainer}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <FitMapBounds
          gasMeters={gasMeters}
          electricityMeters={electricityMeters}
        />
        {gasMeters.map((meter) => (
          <Marker
            key={meter.id}
            position={[meter.location.lat, meter.location.lon]}
            icon={customGasIcon}
          >
            <Popup className={styles.popUp}>{meter.label}</Popup>
          </Marker>
        ))}

        {electricityMeters.map((meter) => (
          <Marker
            key={meter.id}
            position={[meter.location.lat, meter.location.lon]}
            icon={customElecIcon}
          >
            <Popup className={styles.popUp}>{meter.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className={styles.legend}>
        <h4>Legend</h4>
        <ul>
          <li>
            <LuFlame
              size={8}
              className={`${styles.icon} ${styles.gas} ${styles.legendIcon}`}
            />

            <span>Meters of Gas</span>
          </li>
          <li>
            <LuZap
              size={8}
              className={`${styles.icon} ${styles.electric} ${styles.legendIcon}`}
            />

            <span>Meters of Electricity</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
