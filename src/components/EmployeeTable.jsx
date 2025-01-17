import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import PayButton from "./PayButton";

export default function EmployeeTable() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const getUsers = async () => {
    const { data } = await axiosSecure.get(`users`);
    return data;
  };
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

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Verified
            </th>
            <th scope="col" className="px-6 py-3">
              Bank Account
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Pay</span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Details</span>
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
                  {d?.name}
                </th>
                <td className="px-6 py-4">{d?.email} </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      mutation.mutate(d?._id);
                    }}
                  >
                    {d?.verified ? "✅" : "❌"}
                  </button>
                </td>
                <td className="px-6 py-4">{d?.bank} </td>
                <td className="px-6 py-4">
                  <PayButton data={d} />
                </td>
                <td className="px-6 py-4">details </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
