import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import React from "react";
import Swal from "sweetalert2";
import EditSalary from "./EditSalary";

const AllEmployeeTable2 = () => {
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
  const {
    isLoading,
    isError,
    data: data2,
  } = useQuery({
    queryKey: ["allusers"],
    queryFn: getUsers,
  });
  let data = [];
  if (data2) {
    data = data2.filter((d) => d.role != "Admin");
  }

  //   only task related to table

  // Define columns using JSX
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },

      {
        id: "salary",
        header: "salary",
        cell: ({ row }) => (
          <div className="grid grid-cols-2 items-center justify-items-start gap-2">
            <p className="justify-self-end whitespace-nowrap">
              {row.original?.salary} $
            </p>
            <EditSalary data={row.original} />
          </div>
        ),
      },
      {
        id: "role2",
        header: "Role",
        cell: ({ row }) => (
          <button
            className="dark:focus:ring-blue-800z mx-auto block w-20 rounded-lg bg-blue-700 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 md:w-24"
            onClick={() => {
              Swal.fire({
                title: `Are you sure you want to ${row.original?.role !== "HR" ? "remove him as HR" : "make him HR"}?`,

                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${row.original?.role !== "HR" ? "remove" : "make"} !`,
              }).then((result) => {
                if (result.isConfirmed) {
                  mutation.mutate(row.original?._id);
                  Swal.fire({
                    title: "Done !",
                    icon: "success",
                  });
                }
              });
            }}
          >
            {row.original?.role !== "HR" && "Make"} HR
          </button>
        ),
      },
      {
        id: "fired",
        header: "Fired",
        cell: ({ row }) => (
          <button
            className={`dark:focus:ring-blue-800z mx-auto block w-14 rounded-lg ${row.original?.fired === true ? "bg-slate-500" : "bg-red-500"} py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700`}
            onClick={() => {
              Swal.fire({
                title: `Are you sure you want to ${row.original?.fired === true ? "add him" : "Fire him"}?`,

                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: `Yes, ${row.original?.fired === true ? "add" : "fire"}`,
              }).then((result) => {
                if (result.isConfirmed) {
                  mutation2.mutate(row.original?._id);
                  Swal.fire({
                    title: "Fired!",
                    text: "This employee is fired",
                    icon: "success",
                  });
                }
              });
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
    <>
      <div className="w-full p-4">
        {data.length > 0 ? (
          <table className="min-w-full border-collapse border border-gray-300 text-center">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border border-gray-300 bg-gray-200 px-2 py-2"
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
                      className="border border-gray-300 px-2 py-2"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="pt-10 text-center text-xl font-medium sm:text-3xl">
            No employee or HR to show
          </p>
        )}
      </div>
    </>
  );
};

export default AllEmployeeTable2;
