import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useAuth } from "../Hooks/CustomHooks";

export default function PaymentTable() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const getPayRolls = async () => {
    const { data } = await axiosSecure.get(`ownpayment?email=${user.email}`);
    return data;
  };

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
              Month
            </th>
            <th scope="col" className="px-6 py-3">
              Year
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Transaction Id
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
                <td className="px-6 py-4">{d?.month} </td>
                <td className="px-6 py-4">{d?.year} </td>
                <td className="px-6 py-4">{d?.salary} $</td>
                <td className="px-6 py-4">{d?.transactionid} </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
