import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import ProgressOptions from "./ProgressOptions";
import ProgressTable from "./ProgressTable";
import SingleHeader from "./SingleHeader";

export default function Progress() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [month, setMonth] = useState("");
  const [name, setName] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    setTimeout(() => {
      queryClient.invalidateQueries(["tasks"]);
    }, 1);
  }, [page, name, month]);
  // Fetch tasks function
  const fetchTasks = async () => {
    const { data } = await axiosSecure.get(
      `alltask?page=${page}&month=${month}&name=${name}`,
    );

    return data;
  };

  // Query for fetching tasks
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error loading data!</p>;
  return (
    <div>
      <div className="pb-2 sm:pb-1 md:pb-2 lg:pb-3">
        <SingleHeader heading="Progress of all Employee" />
      </div>
      <div>
        <ProgressOptions
          setMonth={setMonth}
          name={name}
          month={month}
          setName={setName}
          uniqueNames={data?.uniqueNames}
        />
      </div>

      {data?.result && <ProgressTable data={data?.result} />}

      {data?.totalPages && (
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* Map through totalPages and render buttons */}
          {Array.from({ length: data?.totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                onClick={() => {
                  setPage(pageNumber);
                }}
                className={`flex size-10 items-center justify-center rounded-full border text-xl ${pageNumber == page && "bg-blue-600 text-white"}`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
