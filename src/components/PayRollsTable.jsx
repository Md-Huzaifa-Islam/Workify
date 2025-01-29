import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import AdminPaymentModal from "./AdminPaymentModal";
import Loading from "./Loading";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const PayRollsTable = () => {
  const stripePromise = loadStripe(import.meta.env.VITE_stripe);
  const axiosSecure = useAxiosSecure();
  const getPayRolls = async () => {
    const { data } = await axiosSecure.get(`payrolls`);
    return data;
  };

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
          <Elements stripe={stripePromise}>
            <AdminPaymentModal data={row?.original} />
          </Elements>
        ),
      },
    ],
    [stripePromise],
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
          No payment made or due
        </p>
      )}
    </div>
  );
};

export default PayRollsTable;
