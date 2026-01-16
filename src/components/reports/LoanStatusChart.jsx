import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  borrowed: "#0DA2E7", 
  returned: "#21C45D",
  overdue: "#f59e0b", 
};


const LoanStatusChart = ({ data }) => {
  const formatted = data.map((item) => ({
    name: item.status,
    value: item.total,
    color: COLORS[item.status] || "#e5e7eb",
  }));

  if (!formatted.length) {
    return <p className="text-muted-foreground">Tidak ada data</p>;
  }

  return (
      <div className="dashboard-card">
      <h3 className="mb-4 text-lg font-semibold">
        Status Peminjaman
      </h3>

      <div className="h-75">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formatted}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {formatted.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default LoanStatusChart;
