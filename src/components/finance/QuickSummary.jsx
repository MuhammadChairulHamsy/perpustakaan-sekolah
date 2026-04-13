import React from "react";

/**
 * Komponen QuickSummary
 * Menampilkan ringkasan status pembayaran denda dalam bentuk progress bar.
 */
export const QuickSummary = ({ summary }) => {
  const paidCount = Number(summary?.paidCount) || 0;
  const unpaidCount = Number(summary?.unpaidCount) || 0;
  const displayTotal = paidCount + unpaidCount;

  const statusData = [
    {
      label: "Dibayar",
      count: paidCount,
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
    },
    {
      label: "Tidak dibayar",
      count: unpaidCount,
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

  return (
    <div className="p-6 space-y-6">
     <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Ringkasan Status</h3>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          Total: {displayTotal} Data
        </span>
      </div>

      <div className="space-y-5">
        {statusData.map((item, index) => {
          const percentage = displayTotal > 0 ? (item.count / displayTotal) * 100 : 0;

          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${item.textColor}`}>{item.label}</span>
                <span className={`font-bold ${item.textColor}`}>
                  {item.count}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-in-out`}
                  style={{ 
                    width: `${percentage}%`,
                    minWidth: item.count > 0 ? "4px" : "0px" 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border/50">
        <p className="text-[12px] text-muted-foreground leading-relaxed italic">
          * Persentase dihitung berdasarkan perbandingan antara denda yang sudah dibayar dan yang belum.
        </p>
      </div>
    </div>
  );
};