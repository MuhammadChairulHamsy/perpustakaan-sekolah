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

if (!formatted || formatted.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center">
        <p className="text-muted-foreground text-sm">Memuat data...</p>
      </div>
    );
  }

  return (
      <div className="dashboard-card ">
      <h3 className="mb-4 text-lg font-semibold">
        Status Peminjaman
      </h3>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={formatted.length}>
            <Pie
              data={formatted}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label
              paddingAngle={5}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
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
