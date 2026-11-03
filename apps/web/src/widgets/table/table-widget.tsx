"use client";

import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, PaginationState, Row, Updater } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useRuntimeScope } from "@/runtime/runtime-context";
import type { WidgetComponentProps, WidgetState } from "../types";
import { isNumericColumn } from "./cell-format";
import { evaluateRows } from "./evaluate-rows";
import { isSelectedRow } from "./is-selected-row";
import type { EvaluatedRow } from "./evaluate-rows";
import { TableCell } from "./table-cell";
import { readColumns, readPageSize, readRecords } from "./table-columns";
import type { TableColumn } from "./table-columns";
import { TablePagination } from "./table-pagination";

export function TableWidget({ id, props, state, setState }: WidgetComponentProps) {
  const scope = useRuntimeScope();
  const columns = useMemo(() => readColumns(props), [props]);
  const pageSize = readPageSize(props);
  const rows = useMemo(
    () => evaluateRows(id, columns, readRecords(id, props.data), scope),
    [id, columns, props, scope],
  );
  const columnDefs = useMemo(() => toColumnDefs(columns), [columns]);
  const pageIndex = Math.min(readPage(state) - 1, lastPageIndex(rows.length, pageSize));
  const pagination = { pageIndex, pageSize };

  const table = useReactTable({
    data: rows,
    columns: columnDefs,
    state: { pagination },
    autoResetPageIndex: false,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setState({ ...state, page: next.pageIndex + 1 });
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isNumeric = (columnId: string) => isNumericColumn(columnId, rows);
  const selectRow = (row: Row<EvaluatedRow>) =>
    setState({ ...state, selectedRow: row.original.source });

  return (
    <div>
      <div className="max-h-[28rem] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm tabular-nums">
          <caption className="sr-only">{id}</caption>
          <thead className="sticky top-0 z-10 bg-card">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className={cn(
                      "border-b px-3 py-2 text-left font-medium whitespace-nowrap text-muted-foreground",
                      isNumeric(header.column.id) && "text-right",
                    )}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                tabIndex={0}
                aria-current={isSelectedRow(state.selectedRow, row.original.source) || undefined}
                onClick={() => selectRow(row)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  selectRow(row);
                }}
                className="cursor-pointer outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset aria-[current=true]:bg-accent"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "border-b px-3 py-2 whitespace-nowrap",
                      isNumeric(cell.column.id) && "text-right",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        rowCount={rows.length}
        canPrevious={table.getCanPreviousPage()}
        canNext={table.getCanNextPage()}
        onPrevious={table.previousPage}
        onNext={table.nextPage}
      />
    </div>
  );
}

function readPage(state: WidgetState) {
  return typeof state.page === "number" ? state.page : 1;
}

function lastPageIndex(rowCount: number, pageSize: number) {
  return Math.max(Math.ceil(rowCount / pageSize) - 1, 0);
}

function toColumnDefs(columns: TableColumn[]): ColumnDef<EvaluatedRow>[] {
  return columns.map((column) => ({
    id: column.key,
    header: column.label,
    accessorFn: (row) => row.cells[column.key],
    cell: ({ getValue }) => <TableCell columnKey={column.key} value={getValue()} />,
  }));
}
