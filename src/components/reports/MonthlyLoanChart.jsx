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
    // Mengubah '2026-01' menjadi format tanggal yang valid agar bisa dibaca new Date()
    month: item.month
      ? new Date(item.month + "-01").toLocaleString("id-ID", {
          month: "short",
          year: "numeric",
        })
      : "N/A",
    // SESUAIKAN DI SINI:
    borrowed: Number(item.borrowed || 0),
    returned: Number(item.returned || 0),
  }));

  return (
    <div className="dashboard-card h-[400px]">
      <h3 className="mb-4 text-lg font-semibold">Tren Peminjaman Bulanan</h3>

      <div className="h-[300px] w-full">
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
