import React, { useEffect } from "react";
import { ReadingType, EditSchema } from "@/schemas/readings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../styles/EditReadingModal.module.scss";
import { validateMonotonicValue } from "@/utils/validateMonotonicValue";
import { useTranslations } from "next-intl";
interface EditReadingModalProps {
  currentReading: ReadingType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, newValue: number) => void;
  unit: string;
}

const EditReadingModal = ({
  currentReading,
  isOpen,
  onClose,
  onSave,
  unit,
  allReadings,
}: EditReadingModalProps & { allReadings: ReadingType[] }) => {
  const t = useTranslations("actions");
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

    // 1. Lefuttatjuk a szigorú ellenőrzést
    const validationError = validateMonotonicValue({
      currentReading,
      newValue: data.value,
      allReadings,
    });

    // 2. Ha hiba van, megállítjuk és kiírjuk
    if (validationError) {
      setError("value", {
        type: "manual",
        message: validationError,
      });
      return; // NEM hívjuk meg az onSave-et, a modal nyitva marad a hibaüzenettel
    }

    // 3. Csak ha minden oké, akkor mentünk
    onSave(currentReading.id, data.value);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h3>
          {t("editReading")} - {currentReading.month} {currentReading.year}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="number"
            {...register("value", { valueAsNumber: true })}
            placeholder={currentReading.value.toString()}
            autoFocus
          />
          <span>{unit}</span>
          {errors.value && <span>{errors.value.message}</span>}
          <div>
            <button type="submit">{t("save")}</button>
            <button type="button" onClick={onClose}>
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReadingModal;
