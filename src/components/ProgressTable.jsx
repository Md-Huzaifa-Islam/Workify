import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ProgressTable = ({ data2, month, name }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (month != "" && name != "") {
      const temp = data2.filter(
        (item) => item.name == name && item.month === month,
      );
      setData([...temp]);
      console.log(data);
    } else if (name != "") {
      const temp = data2.filter((item) => item.name == name);
      setData([...temp]);
      console.log(data);
    } else if (month != "") {
      const temp = data2.filter((item) => item.month === month);
      setData([...temp]);
      console.log(data);
    } else {
      const temp = data2;
      setData([...temp]);
    }
  }, [name, month, data, data2]);
  // Define columns using JSX
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
      <table className="min-w-full border-collapse border border-gray-300">
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
                <td key={cell.id} className="border border-gray-300 px-4 py-2">
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
ProgressTable.propTypes = {
  data2: PropTypes.array.isRequired,
  month: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default ProgressTable;
