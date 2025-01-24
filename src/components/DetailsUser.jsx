import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function DetailsUser() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const fetchUser = async () => {
    const { data } = await axiosSecure.get(`userhr?email=${id}`);
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userdata1", id],
    queryFn: fetchUser,
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 border-b pb-6">
        <img
          src={data?.image}
          alt={`${data?.name}'s profile`}
          className="h-32 w-32 rounded-full border-2 border-gray-300"
        />
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-800">{data?.name}</h1>
          <p className="text-gray-500">{data?.designation}</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-4 text-gray-700 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Email</h3>
          <p>{data?.email}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Bank Account</h3>
          <p>{data?.bank}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Status</h3>
          <p>{data?.verified ? "" : "Not"} Verified</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Salary</h3>
          <p>{data?.salary} $</p>
        </div>
      </div>
    </div>
  );
}
