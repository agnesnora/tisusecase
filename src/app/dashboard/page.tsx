import { calculateMonthlyConsumption } from "@/utils/calculateMonthlyConsumption";
import { fetchMetersList } from "@/utils/api/meters";
import { fetchReadingsList } from "@/utils/api/readings";
import ConsumptionChart from "../components/ConsumptionChart";
import React from "react";
import styles from "./page.module.scss";
import { formatUnit } from "@/utils/formatUnit";

const DashboardPage = async () => {
  const [meters, readings] = await Promise.all([
    fetchMetersList(),
    fetchReadingsList(),
  ]);

  const consumptionData = calculateMonthlyConsumption(readings, meters);

  return (
    <div className={styles.container}>
      <ConsumptionChart
        data={consumptionData.gas}
        unit={formatUnit("m3")}
        type="gas"
      />

      <ConsumptionChart
        data={consumptionData.electricity}
        unit={formatUnit("kWh")}
        type="electricity"
      />
    </div>
  );
};

export default DashboardPage;
