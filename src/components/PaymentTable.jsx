import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import React from "react";
import { useAuth } from "../Hooks/CustomHooks";

const PaymentTable = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const getPayRolls = async () => {
    const { data } = await axiosSecure.get(`ownpayment?email=${user.email}`);
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
        accessorKey: "month",
        header: "Month",
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "salary",
        header: "Amount",
      },
      {
        accessorKey: "transactionid",
        header: "Transaction Id",
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

export default PaymentTable;
