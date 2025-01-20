import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import React from "react";
import { format } from "date-fns";

const PayRollsTable = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const getPayRolls = async () => {
    const { data } = await axiosSecure.get(`payrolls`);
    return data;
  };
  const HandlePay = async (id) => {
    const { data } = await axiosSecure.patch(`payrolls/${id}`);
    return data;
  };

  const mutation = useMutation({
    mutationFn: HandlePay,
    onSuccess: () => {
      queryClient.invalidateQueries(["payrolls"]);
    },
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ["payrolls"],
    queryFn: getPayRolls,
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
        accessorKey: "salary",
        header: "Salary",
      },
      {
        accessorKey: "month",
        header: "Month",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        id: "paymentDate",
        header: "Payment Date",
        cell: ({ row }) => (
          <p>
            {row?.original?.paymentDate
              ? `${format(row?.original?.paymentDate, "dd/MM/yyyy")}`
              : ""}
          </p>
        ),
      },
      {
        id: "pay2",
        header: "Pay",
        cell: ({ row }) => (
          <button
            disabled={Boolean(row?.original?.paymentDate)}
            onClick={() => {
              mutation.mutate(row?.original?._id);
            }}
          >
            Pay
          </button>
        ),
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

export default PayRollsTable;
