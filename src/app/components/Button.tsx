import styles from "../styles/Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  type: "submit" | "button";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  variant?: "success" | "warning" | "danger" | "icon";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  type,
  onClick,
  disabled,
  variant = "primary",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
