"use client";

import React, { useMemo } from "react";

import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

import { ReadingType } from "@/schemas/readings";

interface ReadingsTableProps {
  data: ReadingType[];
  unit: string;
}
const Table = ({ data, unit }: ReadingsTableProps) => {
  const columns = useMemo<ColumnDef<ReadingType>[]>(
    () => [
      { accessorKey: "year", header: "Year" },
      { accessorKey: "month", header: "Month" },
      {
        accessorKey: "value",
        header: "Reading",
        cell: (info) => `${info.getValue()} ${unit}`,
      },
      { header: "Unit", cell: () => unit },
    ],
    [unit]
  );

  // const [sorting, setSorting] = useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    // state: {
    //   sorting,
    // },
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {" "}
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}{" "}
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
