import { useEffect, useState } from "react";
import { useAuth } from "../Hooks/CustomHooks";
import useAxiosSecure from "../Hooks/useAxiosSecure";

import { format } from "date-fns";

export default function EmployeeTable() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [data, setData] = useState();
  useEffect(() => {
    axiosSecure
      .get(`owntask?email=${user.email}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

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
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
