import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Hooks/CustomHooks";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { format } from "date-fns";
import Loading from "./Loading";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const fetchProfile = async () => {
    const { data } = await axiosSecure.get(`/user?email=${user?.email}`);
    return data;
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data!</p>;
  // Static user details

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mx-5 rounded-lg bg-white p-6 shadow-lg sm:mx-0">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 border-b pb-6 sm:flex-row">
          <img
            src={user?.photoURL}
            alt={`${data?.name}'s profile`}
            className="h-32 w-32 rounded-full border-2 border-gray-300"
          />
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {data?.name}
            </h1>
            <p className="text-gray-500">{data?.designation}</p>
            <p className="w-max rounded-lg bg-green-100 px-2 py-1 text-green-700">
              {data?.role}
            </p>
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
            <h3 className="text-sm font-semibold">Join Date</h3>
            <p>{format(data?.created, "dd/MM/yyyy")}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Salary</h3>
            <p>{data?.salary} $</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
