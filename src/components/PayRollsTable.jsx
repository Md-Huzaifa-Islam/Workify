import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { format } from "date-fns";

export default function PayRollsTable() {
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

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["payrolls"],
    queryFn: getPayRolls,
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
              Salary
            </th>
            <th scope="col" className="px-6 py-3">
              Month
            </th>
            <th scope="col" className="px-6 py-3">
              Year
            </th>
            <th scope="col" className="px-6 py-3">
              payment date
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Pay</span>
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
                <td className="px-6 py-4">{d?.salary} $</td>
                <td className="px-6 py-4">{d?.month} </td>
                <td className="px-6 py-4">{d?.year} </td>
                <td className="px-6 py-4">
                  {d?.paymentDate
                    ? `${format(d?.paymentDate, "dd/MM/yyyy")}`
                    : ""}
                </td>

                <td className="px-6 py-4">
                  <button
                    disabled={Boolean(d?.paymentDate)}
                    onClick={() => {
                      mutation.mutate(d?._id);
                    }}
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
