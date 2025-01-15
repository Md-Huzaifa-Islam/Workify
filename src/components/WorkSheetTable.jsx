import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useAuth } from "../Hooks/CustomHooks";
import { format } from "date-fns";
import CrudModal from "./EditToggle";

export default function WorkSheetTable() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [data, setData] = useState();
  useEffect(() => {
    axiosSecure
      .get(`owntask?email=${user.email}`)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [axiosSecure, user]);
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
              Added date
            </th>

            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">Delete</span>
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
                <td className="px-6 py-4 text-right">
                  <CrudModal data={d} />
                </td>
                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
