import { EditSchema, ReadingType } from "@/schemas/readings";
import { validateMonotonicValue } from "@/utils/validateMonotonicValue";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from "../styles/ReadingModal.module.scss";
import { Button } from "./Button";
import { useTranslations } from "next-intl";
interface ReadingModalProps {
  currentReading: ReadingType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, newValue: number) => void;
  onDelete?: (id: string) => void;
  unit: string;
  mode: "edit" | "delete";
}

const ReadingModal = ({
  currentReading,
  isOpen,
  onClose,
  onSave,
  onDelete,
  unit,
  mode,
  allReadings,
}: ReadingModalProps & { allReadings: ReadingType[] }) => {
  const i18nEdit = useTranslations("actions");
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EditSchema),
    defaultValues: { value: currentReading?.value || 0 },
  });

  useEffect(() => {
    if (currentReading) {
      reset({ value: currentReading.value });
    }
  }, [currentReading, reset]);

  if (!isOpen || !currentReading) return null;

  const onSubmit = (data: { value: number }) => {
    if (!currentReading) return;

    const validationError = validateMonotonicValue({
      currentReading,
      newValue: data.value,
      allReadings,
    });

    if (validationError) {
      setError("value", {
        type: "manual",
        message: validationError,
      });
      return;
    }

    onSave?.(currentReading.id, data.value);
    onClose();
  };

  const handleDelete = () => {
    if (!currentReading) return;
    onDelete?.(currentReading.id);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3>
          {mode === "edit"
            ? `${i18nEdit("editReading")} - ${currentReading.month} ${
                currentReading.year
              }`
            : i18nEdit("delete")}
        </h3>
        {mode === "edit" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="number"
              {...register("value", { valueAsNumber: true })}
              placeholder={currentReading.value.toString()}
              autoFocus
            />
            <span>{unit}</span>
            {errors.value && <span>{errors.value.message}</span>}
            <div className={styles.flex}>
              <Button type="submit" variant="success">
                {i18nEdit("save")}
              </Button>
              <Button type="button" variant="warning" onClick={onClose}>
                {i18nEdit("cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2>{i18nEdit("confirmation")}</h2>
            <div>
              <Button type="button" variant="danger" onClick={handleDelete}>
                {i18nEdit("delete")}
              </Button>
              <Button type="button" variant="warning" onClick={onClose}>
                {i18nEdit("cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingModal;
