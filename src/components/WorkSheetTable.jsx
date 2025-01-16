import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useAuth } from "../Hooks/CustomHooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import { format } from "date-fns";
import CrudModal from "./EditToggle";

export default function WorkSheetTable() {
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (isLoading) return <Spinner />; // Show spinner while loading
  if (error) return <p>Error: {error.message}</p>; // Handle errors

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Task
            </th>
            <th scope="col" className="px-6 py-3">
              Hour Worked
            </th>
            <th scope="col" className="px-6 py-3">
              Date Worked
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="sr-only"> Edit</p>
            </th>
            <th scope="col" className="px-6 py-3">
              <p className="sr-only"> Delete</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((d) => (
              <tr
                key={d._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {d.task}
                </th>
                <td className="px-6 py-4">{d.hour} hr</td>
                <td className="px-6 py-4">{format(d.date, "dd/MM/yyyy")}</td>
                <td className="px-6 py-4">
                  <CrudModal data={d} />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      mutation.mutate(d._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
