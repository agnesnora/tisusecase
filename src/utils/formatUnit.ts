export const formatUnit = (unit: string): string => {
  switch (unit) {
    case "m3":
      return "m³";
    case "kWh":
      return "kWh";
    default:
      return unit;
  }
};
