export type MeterTypeEnum = "gas" | "electricity";

export const getTypeStyle = (type: MeterTypeEnum): React.CSSProperties => {
  switch (type) {
    case "gas":
      return {
        color: "white",
        backgroundColor: "var(--color-m8)",
        padding: "0.6rem 1rem",
        borderRadius: "16px",
        fontSize: "0.85rem",
        fontWeight: "500",
      };
    case "electricity":
      return {
        color: "var(--color-primaryText)",
        backgroundColor: "var(--color-btnBg)",
        padding: "0.6rem 1rem",
        borderRadius: "16px",
        fontSize: "0.85rem",
        fontWeight: "500",
      };
    default:
      return {};
  }
};
