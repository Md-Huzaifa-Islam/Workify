import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import { format } from "date-fns";
import React from "react";

const DemoEmployeeTable = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch tasks function
  const fetchTasks = async () => {
    const { data } = await axiosSecure.get(`alltask`);
    return data;
  };

  // Query for fetching tasks
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  //   only task related to table

  // Define columns using JSX
  const columns = React.useMemo(
    () => [
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
      //   {
      //     id: "verifyButton",
      //     header: "Verify",
      //     cell: ({ row }) => (
      //       <button
      //         className="rounded bg-blue-500 px-3 py-1 text-white"
      //         onClick={() => handleVerify(row.original._id)}
      //       >
      //         {row.original?.verified ? "✅" : "❌"}
      //       </button>
      //     ),
      //   },
      //   {
      //     id: "payButton",
      //     header: "Pay",
      //     cell: ({ row }) => <PayButton data={row.original} />,
      //   },
      //   {
      //     id: "profileLink",
      //     header: "Profile",
      //     cell: ({ row }) => (
      //       <Link
      //         to={`/dashboard/details/${row.original?.email}`}
      //         className="text-blue-600 underline"
      //       >
      //         Details
      //       </Link>
      //     ),
      //   },
    ],
    [],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data!</p>;

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

export default DemoEmployeeTable;
