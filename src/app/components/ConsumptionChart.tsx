"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ConsumptionChartProps {
  data: {
    date: string;
    meters: {
      meterId: string;
      consumption: number; // meterLabel-t töröld
    }[];
    total: number;
  }[];
}

const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 20,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis width="auto" />
      <Tooltip />
      <Legend />
      {/* Dinamikusan generált Bar-ok minden meter-hez */}
      {data[0]?.meters.map((_, index) => (
        <Bar
          key={index}
          dataKey={`meters.${index}.consumption`}
          stackId="a"
          fill={`hsl(${index * 60}, 70%, 50%)`}
        />
      ))}
    </BarChart>
  );
};

export default ConsumptionChart;
