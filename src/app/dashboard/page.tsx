import { calculateMonthlyConsumption } from "@/utils/calculateMonthlyConsumption";
import { fetchMetersList } from "@/utils/api/meters";
import { fetchReadingsList } from "@/utils/api/readings";
import ConsumptionChart from "../components/ConsumptionChart";
import React from "react";

const DashboardPage = async () => {
  const [meters, readings] = await Promise.all([
    fetchMetersList(),
    fetchReadingsList(),
  ]);

  const consumptionData = calculateMonthlyConsumption(readings, meters);

  return (
    <div>
      <h2>Gas Consumption</h2>
      <ConsumptionChart data={consumptionData.gas} />

      <h2>Electricity Consumption</h2>
      <ConsumptionChart data={consumptionData.electricity} />
    </div>
  );
};

export default DashboardPage;
