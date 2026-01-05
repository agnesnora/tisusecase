"use client";

import { MeterType } from "@/schemas/meters";
import {
  AddReadingSchema,
  AddReadingType,
  EditType,
  ReadingType,
} from "@/schemas/readings";

import {
  addReading,
  deleteReadingById,
  editReading,
  fetchReadingsByMeterId,
} from "@/utils/api/readings";
import { getAvailableDates } from "@/utils/availableMonths";
import { orderReadingsDesc } from "@/utils/dateOrderHelper";
import { formatUnit } from "@/utils/formatUnit";
import { calculateMeterStats } from "@/utils/meterUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "../styles/MeterDetailsClient.module.scss";
import { Button } from "./Button";
import { InfoBox } from "./InfoBox";
import ReadingModal from "./ReadingModal";
import Table from "./Table";
import { useTranslations } from "next-intl";
interface MeterDetailsClientProps {
  meter: MeterType;
}

const MeterDetailsClient = ({ meter }: MeterDetailsClientProps) => {
  const i18nDetail = useTranslations("details");
  const i18nToast = useTranslations("toast");
  const queryClient = useQueryClient();
  const [editingReading, setEditingReading] = useState<ReadingType | null>(
    null
  );
  const [deletingReading, setDeletingReading] = useState<ReadingType | null>(
    null
  );

  const {
    data: readings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["readings", meter.id],
    queryFn: () => fetchReadingsByMeterId(meter.id),
  });

  const stats = calculateMeterStats(readings);

  const deleteReadingMutation = useMutation({
    mutationFn: deleteReadingById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings", meter.id] });
      toast.success(i18nToast("readingDeleted"));
    },
    onError: () => {
      toast.error(i18nToast("readingNotDeleted"));
    },
  });

  const addReadingMutation = useMutation({
    mutationFn: addReading,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings", meter.id] });
      reset();
      toast.success(i18nToast("readingAdded"));
    },
    onError: () => {
      toast.error(i18nToast("readingNotAdded"));
    },
  });

  const editReadingMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditType }) =>
      editReading(id, data),
    onSuccess: (partialResponse, variables) => {
      const originalReading = readings.find((r) => r.id === variables.id);

      if (originalReading) {
        const updatedReading: ReadingType = {
          ...originalReading,
          value: variables.data.value,
        };

        queryClient.setQueryData(
          ["readings", meter.id],
          (oldData: ReadingType[]) =>
            oldData?.map((reading) =>
              reading.id === variables.id ? updatedReading : reading
            ) || []
        );
        toast.success(i18nToast("readingSaved"));
      }
    },
    onError: () => {
      toast.error(i18nToast("readingNotSaved"));
    },
  });
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(AddReadingSchema),
  });

  const availableDates = getAvailableDates(readings);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = e.target.value.split("|");
    setValue("year", parseInt(year));
    setValue(
      "month",
      month as
        | "JAN"
        | "FEB"
        | "MAR"
        | "APR"
        | "MAY"
        | "JUN"
        | "JUL"
        | "AUG"
        | "SEP"
        | "OCT"
        | "NOV"
        | "DEC"
    );
  };

  const handleAddReading = (data: AddReadingType) => {
    const latestReading = [...readings].sort(orderReadingsDesc)[0];
    if (latestReading && data.value < latestReading.value) {
      setError("value", {
        type: "manual",
        message: `${i18nToast("lowerThan")} (${latestReading.value})`,
      });
      toast.warning(i18nToast("validationError"));
      setTimeout(() => {
        setError("value", { type: "manual", message: "" });
      }, 3000);
      return;
    }
    const newReading = {
      ...data,
      meterId: meter.id,
    };
    addReadingMutation.mutate(newReading);
  };

  const handleEdit = (reading: ReadingType) => {
    setEditingReading(reading);
  };

  const handleSaveEdit = (id: string, newValue: number) => {
    editReadingMutation.mutate({
      id,
      data: { value: newValue },
    });
    setEditingReading(null);
  };

  const handleDelete = (reading: ReadingType) => {
    setDeletingReading(reading);
  };

  const handleConfirmDelete = (id: string) => {
    deleteReadingMutation.mutate(id);
    setDeletingReading(null);
  };
  const sortedReadings = [...readings].sort(orderReadingsDesc);
  if (!meter) {
    return <div>{i18nDetail("meterNotFound")}</div>;
  }
  if (isLoading) return <div>{i18nDetail("loading")}</div>;
  if (error) return <div>{i18nDetail("errorLoadingReadings")}</div>;

  return (
    <div className={styles.container}>
      <h2>{meter.label}</h2>

      <div className={styles.statistics}>
        <InfoBox
          title={i18nDetail("average")}
          subtitle={`${
            stats.average !== undefined
              ? stats.average.toFixed(2)
              : i18nDetail("noData")
          } ${meter.unit}`}
          variant="average"
        />
        <InfoBox
          title={i18nDetail("highestMonth")}
          subtitle={`${stats.highestMonth?.month}
          ${stats.highestMonth?.year}`}
          variant="highest"
          value={`${stats.highest} ${formatUnit(meter.unit)}`}
        />
        <InfoBox
          title={i18nDetail("lowestMonth")}
          subtitle={`${stats.lowestMonth?.month}
          ${stats.lowestMonth?.year}`}
          variant="lowest"
          value={`${stats.lowest} ${formatUnit(meter.unit)}`}
        />
      </div>
      <div className={styles.addReading}>
        <h3>{i18nDetail("addNewReadingToConsumer")}</h3>
        <form className={styles.form} onSubmit={handleSubmit(handleAddReading)}>
          {availableDates.length > 0 ? (
            <>
              <select
                onChange={handleDateChange}
                defaultValue=""
                className={styles.select}
              >
                <option value="" disabled>
                  {i18nDetail("selectMonth")}
                </option>
                {availableDates.map((date) => (
                  <option
                    key={`${date.year}-${date.month}`}
                    value={`${date.year}|${date.month}`}
                  >
                    {date.label}
                  </option>
                ))}
              </select>

              {/* Hidden input fields for Zod validation and react hook form */}
              <input
                type="hidden"
                {...register("year", { valueAsNumber: true })}
              />
              <input type="hidden" {...register("month")} />

              <input
                {...register("value", { valueAsNumber: true })}
                type="number"
                step="any"
                placeholder={i18nDetail("value")}
                className={styles.valueInput}
              />
              <Button type="submit" disabled={addReadingMutation.isPending}>
                {" "}
                {i18nDetail("addNew")}
              </Button>
            </>
          ) : (
            <p>{i18nDetail("noMore")}</p>
          )}
          {errors.value && <span>{errors.value.message}</span>}
        </form>
      </div>
      <Table
        data={sortedReadings}
        unit={meter.unit}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ReadingModal
        currentReading={editingReading}
        isOpen={!!editingReading}
        onClose={() => setEditingReading(null)}
        onSave={handleSaveEdit}
        unit={meter.unit}
        mode="edit"
        allReadings={readings}
      />

      <ReadingModal
        currentReading={deletingReading}
        isOpen={!!deletingReading}
        onClose={() => setDeletingReading(null)}
        onDelete={handleConfirmDelete}
        unit={meter.unit}
        mode="delete"
        allReadings={readings}
      />
    </div>
  );
};

export default MeterDetailsClient;
