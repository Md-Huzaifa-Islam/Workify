import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import React from "react";
import CrudModal from "./EditToggle";
import { useAuth } from "../Hooks/CustomHooks";
import { format } from "date-fns";

const WorkSheetTable = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks function
  const fetchTasks = async () => {
    const { data } = await axiosSecure.get(`owntask?email=${user.email}`);
    return data;
  };

  // Delete task function
  const deleteTask = async (id) => {
    const { data } = await axiosSecure.delete(`owntask/${id}`);
    return data;
  };

  // Mutation for deleting tasks
  const mutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Invalidate tasks query to refetch data
    },
  });

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
        id: "DateWorked",
        header: "Date Worked",
        cell: ({ row }) => <p>{format(row?.original?.date, "dd/MM/yyyy")}</p>,
      },

      {
        id: "pay3",
        header: "Pay",
        cell: ({ row }) => <CrudModal data={row?.original} />,
      },
      {
        id: "delete",
        header: "Delete",
        cell: ({ row }) => (
          <button
            onClick={() => {
              mutation.mutate(row?.original?._id);
            }}
          >
            Delete
          </button>
        ),
      },
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

export default WorkSheetTable;
