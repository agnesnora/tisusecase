"use client";

import { MeterType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import React from "react";
import Table from "./Table";
import { useMemo } from "react";
import { orderReadingsDesc } from "@/utils/dateOrderHelper";

interface MeterDetailsClientProps {
  meter: MeterType;
  readings: ReadingType[];
}

const MeterDetailsClient = ({ meter, readings }: MeterDetailsClientProps) => {
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
    </div>
  );
};

export default MeterDetailsClient;
