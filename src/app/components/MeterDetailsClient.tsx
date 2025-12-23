"use client";

import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import React from "react";
import Table from "./Table";
import { useMemo } from "react";
import { orderReadingsDesc } from "@/utils/dateOrderHelper";
import { calculateMeterStats } from "@/utils/meterUtils";

interface MeterDetailsClientProps {
  meter: MeterType;
  readings: ReadingType[];
}

const MeterDetailsClient = ({ meter, readings }: MeterDetailsClientProps) => {
  const stats = calculateMeterStats(readings);
  console.log("Stats:", stats);
  console.log("Average:", stats.average);

  const sortedReadings = useMemo(() => {
    return [...readings].sort(orderReadingsDesc);
  }, [readings]);
  return (
    <div>
      <h1>Meter Details</h1>
      <div>
        <h2>{meter.label}</h2>
        <p>Type: {meter.type}</p>
        <p>Unit: {meter.unit}</p>
        <p>
          Location: {meter.location.lat}, {meter.location.lon}
        </p>
      </div>

      <Table data={sortedReadings} unit={meter.unit} />
      <div>
        <h3>Statistics</h3>
        <p>
          Average Consumption:{" "}
          {stats.avarage !== undefined ? stats.avarage.toFixed(2) : "No data"}{" "}
          {meter.unit}
        </p>
        <p>
          Highest: {stats.highest} {meter.unit} ({stats.highestMonth?.month}{" "}
          {stats.highestMonth?.year})
        </p>
        <p>
          Lowest: {stats.lowest} {meter.unit} ({stats.lowestMonth?.month}{" "}
          {stats.lowestMonth?.year})
        </p>
      </div>
    </div>
  );
};

export default MeterDetailsClient;
