"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useTranslations } from "next-intl";
import { ReadingType } from "@/schemas/readings";
import { formatUnit } from "@/utils/formatUnit";

import styles from "../styles/Table.module.scss";

interface ReadingsTableProps {
  data: ReadingType[];
  unit: string;
  onEdit: (reading: ReadingType) => void;
  onDelete: (reading: ReadingType) => void;
}
const Table = ({ data, unit, onEdit, onDelete }: ReadingsTableProps) => {
  const i18nReadings = useTranslations("readings");
  const columns = useMemo<ColumnDef<ReadingType>[]>(
    () => [
      { accessorKey: "year", header: () => i18nReadings("year") },
      { accessorKey: "month", header: () => i18nReadings("month") },
      {
        accessorKey: "value",
        header: () => i18nReadings("value"),
        cell: (info) => `${info.getValue()}`,
      },
      {
        id: "unit",
        header: () => i18nReadings("unit"),
        cell: () => formatUnit(unit),
      },

      {
        id: "Actions",
        header: () => i18nReadings("actions"),
        cell: ({ row }) => {
          const isLatest = row.index === 0;
          return (
            <div className={styles.actionContainer}>
              <button
                className={styles.iconBtn}
                onClick={() => onEdit(row.original)}
              >
                <TbEdit color="var(--color-primaryText)" size={20} />
              </button>
              {isLatest && (
                <button
                  className={styles.iconBtn}
                  onClick={() => onDelete(row.original)}
                >
                  <TbTrash size={20} color="var(--color-primaryText)" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [i18nReadings, unit, onEdit, onDelete]
  );

  // const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
