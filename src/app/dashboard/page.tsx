import { fetchMetersList } from "@/utils/api/meters";
import { fetchReadingsList } from "@/utils/api/readings";
import { calculateMonthlyConsumption } from "@/utils/calculateMonthlyConsumption";
import { formatUnit } from "@/utils/formatUnit";
import ConsumptionChart from "../components/ConsumptionChart";
import styles from "./page.module.scss";

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
