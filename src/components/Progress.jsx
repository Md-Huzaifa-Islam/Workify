import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import ProgressTable from "./ProgressTable";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import ProgressOptions from "./ProgressOptions";

export default function Progress() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [month, setMonth] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    queryClient.invalidateQueries(["tasks"]);
  }, [name, month, queryClient]);
  // Fetch tasks function
  const fetchTasks = async () => {
    const { data } = await axiosSecure.get(
      `alltask?name=${name}&month=${month}`,
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
      <div>
        <ProgressOptions
          setMonth={setMonth}
          name={name}
          month={month}
          setName={setName}
          data={data}
        />
      </div>

      {data && <ProgressTable data={data} />}
    </div>
  );
}
