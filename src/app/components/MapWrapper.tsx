"use client";
import dynamic from "next/dynamic";
import { MeterType } from "@/schemas/meters";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div>Loading Map...</div>,
});

interface MapWrapperProps {
  gasMeters: MeterType[];
  electricityMeters: MeterType[];
}

export default function MapWrapper({
  gasMeters,
  electricityMeters,
}: MapWrapperProps) {
  return (
    <MapComponent gasMeters={gasMeters} electricityMeters={electricityMeters} />
  );
}
