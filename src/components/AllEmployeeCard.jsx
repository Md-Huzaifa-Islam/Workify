import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import Swal from "sweetalert2";
import EditSalary from "./EditSalary";

const AllEmployeeCard = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const getUsers = async () => {
    const { data } = await axiosSecure.get(`allusers`);
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
  const {
    isLoading,
    isError,
    data: data2,
  } = useQuery({
    queryKey: ["allusers"],
    queryFn: getUsers,
  });
  let data = [];
  if (data2) {
    data = data2.filter((d) => d.role != "Admin");
  }

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data!</p>;

  return (
    <div className="grid justify-items-center gap-6 pl-5 pt-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7 xl:grid-cols-4 xl:gap-10">
      {data &&
        data.map((person) => (
          <div
            key={person._id}
            className="card card-compact w-full max-w-96 border-2 py-4 shadow-xl sm:py-6 xl:py-10"
          >
            <figure className="mx-auto size-28 rounded-full xl:size-40">
              <img
                className="size-full rounded-full object-cover object-center"
                src={person?.image}
                alt="Shoes"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title mx-auto text-center">{person?.name}</h2>
              <p className="text-center">{person?.designation}</p>
              <div className="mx-auto flex w-max items-center justify-items-start gap-2">
                <p className="text-lg">{person?.salary} $</p>
                <div className="text-xl text-green-600">
                  <EditSalary data={person} />
                </div>
              </div>
              <div className="card-actions flex justify-center gap-4">
                <button
                  className="dark:focus:ring-blue-800z mx-0 block w-24 rounded-lg bg-blue-700 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => {
                    Swal.fire({
                      title: `Are you sure you want to ${person?.role !== "HR" ? "remove him as HR" : "make him HR"}?`,

                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: `Yes, ${person?.role !== "HR" ? "remove" : "make"} !`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        mutation.mutate(person?._id);
                        Swal.fire({
                          title: "Done !",
                          icon: "success",
                        });
                      }
                    });
                  }}
                >
                  {person?.role !== "HR" && "Make"} HR
                </button>
                <button
                  className={`dark:focus:ring-blue-800z mx-0 block w-14 rounded-lg ${person?.fired === true ? "bg-slate-500" : "bg-red-500"} py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700`}
                  onClick={() => {
                    Swal.fire({
                      title: `Are you sure you want to ${person?.fired === true ? "add him" : "Fire him"}?`,

                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: `Yes, ${person?.fired === true ? "add" : "fire"}`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        mutation2.mutate(person?._id);
                        Swal.fire({
                          title: "Fired!",
                          text: "This employee is fired",
                          icon: "success",
                        });
                      }
                    });
                  }}
                >
                  {person?.fired === true ? "Fired" : "Fire"}
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllEmployeeCard;
