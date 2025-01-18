import useAxiosSecure from "../Hooks/useAxiosSecure";
import { Spinner } from "flowbite-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

export default function ProgressTable() {
  const axiosSecure = useAxiosSecure();

  // Fetch tasks function
  const fetchTasks = async () => {
    const { data } = await axiosSecure.get(`owntask`);
    return data;
  };

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
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((d) => (
              <tr
                key={d?._id}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                >
                  {d?.task}
                </th>
                <td className="px-6 py-4">{d?.hour} hr</td>
                <td className="px-6 py-4">{format(d?.date, "dd/MM/yyyy")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
