import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import PropTypes from "prop-types";
import React from "react";

const ProgressTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "task",
        header: "Task",
      },
      {
        accessorKey: "hour",
        header: "Hour Worked",
      },
      {
        id: "Date",
        header: "Date Worked",
        cell: ({ row }) => <p>{format(row.original?.date, "dd/MM/yyyy")}</p>,
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-4">
      {data.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300 text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 bg-gray-200 px-4 py-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
                  <td
                    key={cell.id}
                    className="border border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="pt-10 text-center text-xl font-medium sm:text-3xl">
          The progress table is empty
        </p>
      )}
    </div>
  );
};
ProgressTable.propTypes = {
  data: PropTypes.array,
};

export default ProgressTable;
