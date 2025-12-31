"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  TiArrowUnsorted,
  TiArrowSortedUp,
  TiArrowSortedDown,
} from "react-icons/ti";

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
import { fetchMetersList } from "@/utils/api/meters";
import { fetchReadingsList } from "@/utils/api/readings";
import { MeterType, MeterWithReadingsType } from "@/schemas/meters";
import { ReadingType } from "@/schemas/readings";
import { combineMetersWithLatestReading } from "@/utils/combineMetersWithLatestReading";
import { useRouter } from "next/navigation";
import styles from "../styles/FilteredTable.module.scss";
import { getTypeStyle, MeterTypeEnum } from "@/utils/meterTypeStyles";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { formatUnit } from "@/utils/formatUnit";
import { useTranslations } from "next-intl";

const FilteredTable = () => {
  const i18nMet = useTranslations("meters");
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
      { accessorKey: "id", header: () => i18nMet("id"), enableSorting: true },
      {
        accessorKey: "label",
        header: () => i18nMet("label"),
        enableSorting: true,
      },
      {
        header: () => i18nMet("location"),
        accessorFn: (row) => `${row.location.lat}, ${row.location.lon}`,
        id: "location",
      },
      {
        accessorKey: "type",
        header: () => i18nMet("type"),
        enableSorting: true,
        cell: ({ row }) => {
          const type = row.original.type as MeterTypeEnum;
          const typeStyle = getTypeStyle(type);
          return <span style={typeStyle}>{type}</span>;
        },
      },
      {
        header: () => i18nMet("latestReading"),
        accessorFn: (row) => {
          const value = row.latestReading?.value;
          const unit = row.unit;
          if (value === undefined || value === null) return "-";
          return `${value} ${formatUnit(unit)}`;
        },
        id: "latestReading",
        enableSorting: true,
      },
    ],
    [i18nMet]
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
    <div className={styles.container}>
      <div className={styles.selectWrapper}>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className={`${styles.select} ${styles.pageSelect}`}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {i18nMet("show")} {pageSize}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted() === "asc" ? (
                          <TiArrowSortedUp />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <TiArrowSortedDown />
                        ) : (
                          <TiArrowUnsorted />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
          <tr className={styles.filterRow}>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <select
                value={
                  (table.getColumn("type")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) => {
                  table
                    .getColumn("type")
                    ?.setFilterValue(e.target.value || undefined);
                }}
                className={`${styles.select} ${styles.typeSelect}`}
              >
                <option value="">{i18nMet("allTypes")}</option>
                <option value="electricity">{i18nMet("electricity")}</option>
                <option value="gas">{i18nMet("gas")}</option>
              </select>
            </td>
            <td></td> {/* Latest Reading oszlop - üres */}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => handleRowClick(row.original.id!)}
              style={{ cursor: "pointer" }}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className={styles.paginationButton}
          style={{
            borderTopLeftRadius: "8px",
            borderBottomLeftRadius: "8px",
          }}
        >
          <span className={styles.spanFlexLeft}>
            <BsArrowLeft /> Previous
          </span>
        </button>

        {Array.from({ length: table.getPageCount() }, (_, i) => (
          <button
            key={i}
            onClick={() => table.setPageIndex(i)}
            className={`${styles.paginationButton} ${
              i === table.getState().pagination.pageIndex
                ? styles.activePage
                : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className={styles.paginationButton}
          style={{
            borderTopRightRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <span className={styles.spanFlexRight}>
            <BsArrowRight />
            Next
          </span>
        </button>
      </div>
    </div>
  );
};

export default FilteredTable;
