import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopBooksChart = ({ data }) => {
  return (
    <div className="dashboard-card">
      <h3 className="mb-4 text-lg font-semibold">
        Buku Paling Sering Dipinjam
      </h3>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="title" type="category" width={150} />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#0DA2E7"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopBooksChart;
