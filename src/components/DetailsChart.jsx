import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const DetailsChart = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const getPayments = async () => {
    const { data } = await axiosSecure.get(`details?email=${id}`);
    console.log(data.length);
    return data;
  };
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["userdata", id],
    queryFn: getPayments,
  });
  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  console.log(data);
  return (
    <div>
      {data && data.length == 0 ? (
        <div>
          <p className="text-center">This employee is not paid yet</p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={`chartDate`} />
              <YAxis
                label={{
                  value: "Salary ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Bar dataKey="salary" fill="#8884d8">
                <LabelList dataKey="salary" position="top" />
                {data.map((entry, index) => (
                  <Bar key={index} dataKey="salary" fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DetailsChart;
