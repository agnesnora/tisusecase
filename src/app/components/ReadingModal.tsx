import React, { useEffect } from "react";
import { ReadingType, EditSchema } from "@/schemas/readings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../styles/ReadingModal.module.scss";
import { validateMonotonicValue } from "@/utils/validateMonotonicValue";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
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
  const i18nAct = useTranslations("actions");
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
            ? `${i18nAct("editReading")} - ${currentReading.month} ${
                currentReading.year
              }`
            : i18nAct("delete")}
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
                {i18nAct("save")}
              </Button>
              <Button type="button" variant="warning" onClick={onClose}>
                {i18nAct("cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2>{i18nAct("confirmDelete")}</h2>
            <div>
              <Button type="button" variant="danger" onClick={handleDelete}>
                {i18nAct("delete")}
              </Button>
              <Button type="button" variant="warning" onClick={onClose}>
                {i18nAct("cancel")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingModal;
