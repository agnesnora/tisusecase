"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

import { ReadingType } from "@/schemas/readings";
import { formatUnit } from "@/utils/formatUnit";
import { useTranslations } from "next-intl";
import styles from "../styles/Table.module.scss";

interface ReadingsTableProps {
  data: ReadingType[];
  unit: string;
  onEdit: (reading: ReadingType) => void;
  onDelete: (reading: ReadingType) => void;
}
const Table = ({ data, unit, onEdit, onDelete }: ReadingsTableProps) => {
  const i18nRead = useTranslations("readings");
  const columns = useMemo<ColumnDef<ReadingType>[]>(
    () => [
      { accessorKey: "year", header: () => i18nRead("year") },
      { accessorKey: "month", header: () => i18nRead("month") },
      {
        accessorKey: "value",
        header: () => i18nRead("reading"),
        cell: (info) => `${info.getValue()}`,
      },
      {
        id: "unit",
        header: () => i18nRead("unit"),
        cell: () => formatUnit(unit),
      },

      {
        id: "actions",
        header: () => i18nRead("actions"),
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
    [unit, onEdit, onDelete, i18nRead]
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
