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

const data = [
  { month: "OCT '23", salary: 110, color: "#28a745" },
  { month: "NOV '23", salary: 100, color: "#ff5722" },
  { month: "DEC '23", salary: 105, color: "#fdd835" },
  { month: "JAN '24", salary: 150, color: "#03a9f4" },
];

const DetailsChart = () => {
  return (
    <div className="mx-auto max-w-4xl">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            label={{ value: "Salary ($)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Bar dataKey="salary" fill="#8884d8">
            {/* Dynamically assign color to each bar */}
            <LabelList dataKey="salary" position="top" />
            {data.map((entry, index) => (
              <Bar key={index} dataKey="salary" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailsChart;
