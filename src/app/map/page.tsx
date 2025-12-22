import React from "react";
import fetchMetersList from "@/utils/api/meters";
import MapWrapper from "../components/MapWrapper";

import "leaflet/dist/leaflet.css";
import { separateMetersByType } from "@/utils/meterUtils";

const MapPage = async () => {
  const allMeters = await fetchMetersList();
  const { gasMeters, electricityMeters } = separateMetersByType(allMeters);
  return (
    <div>
      <h2>Mérőórák térképe</h2>
      <MapWrapper gasMeters={gasMeters} electricityMeters={electricityMeters} />
    </div>
  );
};

export default MapPage;
