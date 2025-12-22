"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSortAlphaUp, FaSortAlphaDown, FaRedo } from "react-icons/fa";
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import fetchMetersList from "@/utils/api/meters";
import fetchReadingsList from "@/utils/api/readings";
import { MeterType, MeterWithReadingsType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { combineMetersWithLatestReading } from "@/utils/combineMetersWithLatestReading";
import { useRouter } from "next/navigation";

const FilteredTable = () => {
  const metersQuery = useQuery<MeterType[]>({
    queryKey: ["meters"],
    queryFn: fetchMetersList,
  });
  const readingsQuery = useQuery<ReadingType[]>({
    queryKey: ["readings"],
    queryFn: fetchReadingsList,
  });

  const metersColumns: ColumnDef<MeterWithReadingsType>[] = useMemo(
    () => [
      { accessorKey: "id", header: "Id", enableSorting: true },
      { accessorKey: "label", header: "Label", enableSorting: true },
      {
        header: "Location",
        accessorFn: (row) => `${row.location.lat}, ${row.location.lon}`,
        id: "location",
      },
      { accessorKey: "type", header: "Type", enableSorting: true },
      {
        header: "Latest Reading",
        accessorFn: (row) => {
          const value = row.latestReading?.value;
          const unit = row.unit;
          if (value === undefined || value === null) return "-";
          return `${value} ${unit}`;
        },
        id: "latestReading",
        enableSorting: true,
      },
    ],
    []
  );
  const router = useRouter();

  const handleRowClick = (rowId: string) => {
    router.push(`/meters/${rowId}`);
  };
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const combinedData = useMemo(() => {
    if (!metersQuery.data || !readingsQuery.data) return [];
    return combineMetersWithLatestReading(metersQuery.data, readingsQuery.data);
  }, [metersQuery.data, readingsQuery.data]);
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: combinedData,
    columns: metersColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
  });

  if (metersQuery.isLoading || readingsQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (metersQuery.isError || readingsQuery.isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "Sort ascending"
                          : header.column.getNextSortingOrder() === "desc"
                          ? "Sort descending"
                          : "Clear sort"
                        : undefined
                    }
                    style={{
                      display: "inline-block",
                      width: "calc(100% - 10px)",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}{" "}
                    {header.column.id === "type" && (
                      <div
                        className="column-filter"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Az e.stopPropagation() megakadályozza, hogy a select kattintása rendezze a táblázatot */}
                        <select
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) => {
                            header.column.setFilterValue(
                              e.target.value || undefined
                            );
                          }}
                          className="type-select"
                        >
                          <option value="">All Types</option>
                          <option value="electricity">Electricity</option>
                          <option value="gas">Gas</option>
                        </select>
                      </div>
                    )}
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted() === "asc"
                          ? "↑"
                          : header.column.getIsSorted() === "desc"
                          ? "↓"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} onClick={() => handleRowClick(row.original.id!)}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[5, 10, 20].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>{" "}
      <div>Page</div>
      <strong>
        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </strong>{" "}
      <button
        className="border rounded p-1"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </button>
      <div> {table.getState().pagination.pageIndex + 1}</div>
      <button
        className="border rounded p-1"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </button>
    </div>
  );
};

export default FilteredTable;
