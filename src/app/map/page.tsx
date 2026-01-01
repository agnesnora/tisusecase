import { fetchMetersList } from "@/utils/api/meters";
import MapWrapper from "../components/MapWrapper";
import styles from "./page.module.scss";

import { separateMetersByType } from "@/utils/meterUtils";

const MapPage = async () => {
  const allMeters = await fetchMetersList();
  const { gasMeters, electricityMeters } = separateMetersByType(allMeters);
  return (
    <div className={styles.container}>
      <MapWrapper gasMeters={gasMeters} electricityMeters={electricityMeters} />
    </div>
  );
};

export default MapPage;
