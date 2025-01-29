import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import PayButton from "./PayButton";
import Loading from "./Loading";
import Swal from "sweetalert2";
import SingleHeader from "./SingleHeader";

const EmployeeTable2 = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const changeVerify = async (id) => {
    const { data } = await axiosSecure.patch(`updateverified/${id}`);
    return data;
  };
  const mutation = useMutation({
    mutationFn: changeVerify,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });
  // Button handlers
  const handleVerify = (id) => {
    mutation.mutate(id);
  };
  const getUsers = async () => {
    const { data } = await axiosSecure.get(`users`);
    return data;
  };
  // Fetch data using React Query
  const { isLoading, isError, data } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Define columns using JSX
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "bank",
        header: "Bank Account",
      },
      {
        id: "verifyButton",
        header: "Verify",
        cell: ({ row }) => (
          <button
            className="mx-auto w-max rounded bg-blue-500 px-3 py-1 text-white"
            onClick={() => {
              Swal.fire({
                title: `Are you sure you wanna ${row.original?.verified ? "remove verification of" : "verify"} ${row.original.name}?`,

                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${row.original?.verified ? "remove verification" : "Verify him"}!`,
              }).then((result) => {
                if (result.isConfirmed) {
                  handleVerify(row.original._id);
                  Swal.fire({
                    title: `${row.original?.verified ? "Removed verification" : "Verified"}!`,

                    icon: "success",
                  });
                }
              });
            }}
          >
            {row.original?.verified ? "✅" : "❌"}
          </button>
        ),
      },
      {
        id: "payButton",
        header: "Pay",
        cell: ({ row }) => <PayButton data={row.original} />,
      },
      {
        id: "profileLink",
        header: "Profile",
        cell: ({ row }) => (
          <Link
            to={`/dashboard/details/${row.original?.email}`}
            className="text-center text-blue-600 underline"
          >
            Details
          </Link>
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
      <div className="pb-2 sm:pb-1 md:pb-2 lg:pb-3">
        <SingleHeader heading="EmployeeList" />
      </div>
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
          You don&apos;t have any task to show
        </p>
      )}
    </div>
  );
};

export default EmployeeTable2;
