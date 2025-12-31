"use client";

import { MeterType } from "@/schemas/meters";
import {
  AddReadingSchema,
  ReadingType,
  AddReadingType,
  EditType,
} from "@/schemas/readings";

import React, { useState } from "react";
import Table from "./Table";
import ReadingModal from "./ReadingModal";
import { orderReadingsDesc } from "@/utils/dateOrderHelper";
import { calculateMeterStats } from "@/utils/meterUtils";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  deleteReadingById,
  fetchReadingsByMeterId,
  addReading,
  editReading,
} from "@/utils/api/readings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAvailableDates } from "@/utils/availableMonths";
import { toast } from "react-toastify";
import styles from "../styles/MeterDetailsClient.module.scss";
import { Button } from "./Button";
import { InfoBox } from "./InfoBox";
import { formatUnit } from "@/utils/formatUnit";
import { useTranslations } from "next-intl";
interface MeterDetailsClientProps {
  meter: MeterType;
}

const MeterDetailsClient = ({ meter }: MeterDetailsClientProps) => {
  const i18nStats = useTranslations("statistics");
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
      toast.success(i18nStats("readingDeleted"));
    },
    onError: () => {
      toast.error(i18nStats("readingNotDeleted"));
    },
  });

  const addReadingMutation = useMutation({
    mutationFn: addReading,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readings", meter.id] });
      reset();
      toast.success(i18nStats("readingSaved"));
    },
    onError: () => {
      toast.error(i18nStats("readingNotSaved"));
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
        toast.success(i18nStats("readingSaved"));
      }
    },
    onError: () => {
      toast.error(i18nStats("readingNotSaved"));
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
        message: `Value cannot be lower than the previous reading (${latestReading.value})`,
      });
      toast.warning(i18nStats("validationError"));
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

  if (isLoading) return <div>Loading readings...</div>;
  if (error) return <div>Error loading readings</div>;

  return (
    <div className={styles.container}>
      <h2>{meter.label}</h2>

      <div className={styles.statistics}>
        <InfoBox
          title={i18nStats("average")}
          subtitle={`${
            stats.average !== undefined ? stats.average.toFixed(2) : "No data"
          } ${meter.unit}`}
          variant="average"
        />
        <InfoBox
          title={i18nStats("highestMonth")}
          subtitle={`${stats.highestMonth?.month}
          ${stats.highestMonth?.year}`}
          variant="highest"
          value={`${stats.highest} ${formatUnit(meter.unit)}`}
        />
        <InfoBox
          title={i18nStats("lowestMonth")}
          subtitle={`${stats.lowestMonth?.month}
          ${stats.lowestMonth?.year}`}
          variant="lowest"
          value={`${stats.lowest} ${formatUnit(meter.unit)}`}
        />
      </div>
      <div className={styles.addReading}>
        <h3>{i18nStats("addNewReadingToConsumer")}</h3>
        <form className={styles.form} onSubmit={handleSubmit(handleAddReading)}>
          {availableDates.length > 0 ? (
            <>
              <select
                onChange={handleDateChange}
                defaultValue=""
                className={styles.select}
              >
                <option value="" disabled>
                  {i18nStats("selectMonth")}
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
                placeholder={i18nStats("value")}
                className={styles.valueInput}
              />
              <Button type="submit" disabled={addReadingMutation.isPending}>
                {" "}
                {i18nStats("addNew")}
              </Button>
            </>
          ) : (
            <p>No readings can be added at this time.</p>
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
