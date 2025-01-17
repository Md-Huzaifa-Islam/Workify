import useAxiosSecure from "../Hooks/useAxiosSecure";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function AllEmployeeTable() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const getUsers = async () => {
    const { data } = await axiosSecure.get(`users?admin=true`);
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
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["allusers"],
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
              Designation
            </th>

            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Make HR</span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Fire</span>
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
                <td className="px-6 py-4">{d?.designation} hr</td>
                <td>
                  {d?.role == "Admin" ? (
                    <button disabled>Admin</button>
                  ) : (
                    <button
                      onClick={() => {
                        mutation.mutate(d?._id);
                      }}
                    >
                      {d?.role == "HR" && "Make"} HR
                    </button>
                  )}
                </td>
                <td>
                  {d?.role == "Admin" || (
                    <button
                      onClick={() => {
                        mutation2.mutate(d?._id);
                      }}
                    >
                      {d?.fired === "True" ? "Fired" : "Fire"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
