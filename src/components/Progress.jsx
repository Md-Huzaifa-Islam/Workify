import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Loading from "./Loading";
import ProgressOptions from "./ProgressOptions";
import ProgressTable from "./ProgressTable";

export default function Progress() {
  const axiosSecure = useAxiosSecure();
  const [month, setMonth] = useState("");
  const [name, setName] = useState("");

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

      {data && <ProgressTable data2={data} month={month} name={name} />}
    </div>
  );
}
