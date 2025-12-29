import styles from "../styles/Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;

  type: "submit" | "button";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,

  type,
  onClick,
  disabled,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={styles.btn}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
