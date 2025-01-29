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
import { format } from "date-fns";
import useAuth from "../Hooks/CustomHooks";
import Swal from "sweetalert2";

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
            className="mx-auto block rounded-lg bg-red-500 px-3 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 sm:px-5"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
              }).then((result) => {
                if (result.isConfirmed) {
                  mutation.mutate(row?.original?._id);
                  Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success",
                  });
                }
              });
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
      {data.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-300 text-center">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border border-gray-300 bg-gray-200 px-2 py-2 sm:px-4"
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
                    className="border border-gray-300 px-2 py-2 sm:px-4"
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
          You don&apos;t have any task to show
        </p>
      )}
    </div>
  );
};

export default WorkSheetTable;
