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
import { useTranslations } from "next-intl";
interface ConsumptionChartProps {
  data: {
    date: string;
    meters: {
      meterId: string;
      consumption: number;
    }[];
    total: number;
  }[];
  unit: string;
  type: "electricity" | "gas";
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

const ConsumptionChart = ({ data, unit, type }: ConsumptionChartProps) => {
  const i18nDash = useTranslations("dashboard");
  return (
    <div className={styles.wrapper}>
      <h2>
        {type === "electricity" ? i18nDash("electricity") : i18nDash("gas")}
      </h2>
      <BarChart
        responsive
        data={data}
        className={styles.barChart}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const [year, month] = value.split("-");
            return `${month}/${year.slice(-2)}`;
          }}
          interval="preserveStartEnd"
          minTickGap={20}
          tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
          axisLine={{ stroke: "var(--chart-axis)" }}
          tickLine={{ stroke: "var(--chart-axis)" }}
        />
        <YAxis
          width="auto"
          tick={{ fill: "var(--chart-tick)", fontSize: 12 }}
          axisLine={{ stroke: "var(--chart-axis)" }}
          tickLine={{ stroke: "var(--chart-axis)" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-primaryBg)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            color: "var(--color-primaryText)",
          }}
          formatter={(value?: number, name?: string) => {
            if (value == null) return ["–", name ?? "Consumption"];
            return [`${value} ${unit}`, name ?? "Consumption"];
          }}
          labelFormatter={(value) => {
            if (!value) return "";
            const [year, month] = value.split("-");
            return `${i18nDash("period")}: ${month}/${year}`;
          }}
        />
        <Legend
          wrapperStyle={{
            paddingTop: "1.5rem",
          }}
          iconType="circle"
          iconSize={14}
          formatter={(value) => (
            <span
              style={{
                marginRight: "25px",
                display: "inline-block",
                fontSize: "12px",
                color: "var(--color-primaryText)",
              }}
            >
              {value}
            </span>
          )}
        />

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
    </div>
  );
};

export default ConsumptionChart;
