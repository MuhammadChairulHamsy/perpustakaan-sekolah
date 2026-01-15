import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyLoanChart = ({ data }) => {
  const formattedData = data.map((item) => ({
    month: new Date(item.month).toLocaleString("id-ID", {
      month: "short",
      year: "numeric",
    }),
    borrowed: item.borrowed,
    returned: item.returned,
  }));

  return (
    <div className="dashboard-card">
      <h3 className="mb-4 text-lg font-semibold">
        Tren Peminjaman Bulanan
      </h3>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="borrowed"
              stroke="#0DA2E7"
              strokeWidth={2}
              name="Dipinjam"
            />
            <Line
              type="monotone"
              dataKey="returned"
              stroke="#21C45D"
              strokeWidth={2}
              name="Dikembalikan"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyLoanChart;
