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
import styles from "../styles/ConsumptionChart.module.scss";
interface ConsumptionChartProps {
  data: {
    date: string;
    meters: {
      meterId: string;
      consumption: number;
    }[];
    total: number;
  }[];
}
const colors = [
  "var(--color-m1)",
  "var(--color-m2)",
  "var(--color-m3)",
  "var(--color-m4)",
  "var(--color-m5)",
  "var(--color-m6)",
  "var(--color-m7)",
  "var(--color-m8)",
  "var(--color-m9)",
  "var(--color-m10)",
];

const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  return (
    <BarChart responsive data={data} className={styles.barChart}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis width="auto" />
      <Tooltip
        contentStyle={{
          backgroundColor: "var(--color-primaryBg)",
          border: "none",
          borderRadius: "8px",
        }}
      />
      <Legend />
      {/* Dinamikusan generált Bar-ok minden meter-hez */}
      {data[0]?.meters.map((meter, index) => (
        <Bar
          className={styles.bar}
          key={index}
          name={meter.meterId}
          dataKey={`meters.${index}.consumption`}
          stackId="a"
          fill={colors[index % colors.length]}
          style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))" }}
        />
      ))}
    </BarChart>
  );
};

export default ConsumptionChart;
