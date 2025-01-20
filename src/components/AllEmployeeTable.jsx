import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import React from "react";

const DemoEmployeeTable = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const getUsers = async () => {
    const { data } = await axiosSecure.get(`allusers`);
    return data;
  };

  const changeRole = async (id) => {
    const { data } = await axiosSecure.patch(`updaterole/${id}`);
    return data;
  };

  const mutation = useMutation({
    mutationFn: changeRole,
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"]);
    },
  });
  const changeFired = async (id) => {
    const { data } = await axiosSecure.patch(`updatefired/${id}`);
    return data;
  };

  const mutation2 = useMutation({
    mutationFn: changeFired,
    onSuccess: () => {
      queryClient.invalidateQueries(["allusers"]);
    },
  });
  const { isLoading, isError, data } = useQuery({
    queryKey: ["allusers"],
    queryFn: getUsers,
  });

  //   only task related to table

  // Define columns using JSX
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "designation",
        header: "Designation",
      },
      {
        id: "role2",
        header: "Role",
        cell: ({ row }) => (
          <button
            onClick={() => {
              mutation.mutate(row.original?._id);
            }}
          >
            {row.original?.role !== "HR" && "Make"} HR
          </button>
        ),
      },
      {
        id: "role",
        header: "Role",
        cell: ({ row }) => (
          <button
            onClick={() => {
              mutation2.mutate(row.original?._id);
            }}
          >
            {row.original?.fired === true ? "Fired" : "Fire"}
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

export default DemoEmployeeTable;
