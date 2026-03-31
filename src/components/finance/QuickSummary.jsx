export const QuickSummary = ({ fines = [] }) => {
  const total = fines.length;
  const statusData = [
    {
      label: "Dibayar",
      count: fines.filter((f) => f.status === "returned").length,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      label: "Tidak dibayar",
     count: fines.filter((f) => f.status === "overdue" || f.status === "borrowed").length,
      color: "bg-amber-500",
      textColor: "text-amber-500",
    },
    {
      label: "Dikecualikan",
      count: 0, 
      color: "bg-slate-400",
      textColor: "text-slate-400",
    },
  ];

  const paidCount = statusData[0].count;
  const collectionRate = total > 0 ? Math.round((paidCount / total) * 100) : 0;

  return (
    <div className="flex flex-col justify-between h-full p-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-6">Rincian Status</h2>
        <div className="space-y-6">
          {statusData.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className={`font-medium ${item.textColor}`}>{item.label}</span>
                <span className="text-muted-foreground font-medium">
                  {item.count} / {total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-700`}
                  style={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-muted/50 p-4 border border-border/50">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Tingkat Pengumpulan</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-bold text-foreground">{collectionRate}%</p>
          <p className="text-xs text-muted-foreground">dari semua denda</p>
        </div>
      </div>
    </div>
  );
};