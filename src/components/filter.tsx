import { useMemo } from "react";
import { Column, RowData } from "@tanstack/react-table";
import "@tanstack/react-table";
import React from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}
export const Filter = React.memo(
  ({ column }: { column: Column<any, unknown> }) => {
    // const Filter = React.memo({ column }: { column: Column<any, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {};

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues = useMemo(
      () =>
        filterVariant === "range"
          ? []
          : Array.from(column.getFacetedUniqueValues().keys())
              .sort()
              .slice(0, 5000),
      [column.getFacetedUniqueValues(), filterVariant]
    );

    return filterVariant === "select" ? (
      <select
        className="w-full text-center"
        onChange={(e) => column.setFilterValue(e.target.value)}
        value={columnFilterValue?.toString()}
      >
        <option value="">All</option>
        {sortedUniqueValues.map((value) => (
          //dynamically generated select options from faceted values feature
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    ) : (
      <>
        {/* Autocomplete suggestions from faceted values feature */}
        <datalist id={column.id + "list"}>
          {sortedUniqueValues.map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        {/* <DebouncedInput
          type="text"
          value={(columnFilterValue ?? "") as string}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-36 border shadow rounded"
          list={column.id + "list"}
        /> */}
        <div className="h-1" />
      </>
    );
  }
);
