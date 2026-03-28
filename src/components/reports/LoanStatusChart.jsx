import * as React from "react";
import { Pie, PieChart, Label } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = {
  borrowed: "#00BCFF",
  returned: "#05DF72",
  overdue: "#FF8904",
};

const chartConfig = {
  total: { label: "Total" },
  borrowed: { label: "Dipinjam", color: COLORS.borrowed },
  returned: { label: "Kembali", color: COLORS.returned },
  overdue: { label: "Terlambat", color: COLORS.overdue },
};

export const LoanStatusChart = ({ data }) => {
  const { formattedData, totalLoans } = React.useMemo(() => {
    if (!Array.isArray(data)) return { formattedData: [], totalLoans: 0 };

    let total = 0;
    const formatted = data.map((item) => {
      const statusKey = typeof item.status === 'object' ? item.status?.name || "unknown" : String(item.status);
      const val = Number(item.total || 0);
      
      total += val;
      
      return {
        status: statusKey,
        total: val,
        fill: COLORS[statusKey] || "#e5e7eb",
      };
    });
    return { formattedData: formatted, totalLoans: total };
  }, [data]);

  // 2. Loading State: Berikan tinggi minimal agar layout tidak melompat
  if (!formattedData || formattedData.length === 0) {
    return (
      <div className="flex h-[350px] items-center justify-center">
         <p className="text-muted-foreground text-sm animate-pulse">Menghitung statistik...</p>
      </div>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-none bg-transparent w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-base">Status Peminjaman</CardTitle>
        <CardDescription className="text-xs">Distribusi sirkulasi buku</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedData}
              dataKey="total"
              nameKey="status"
              innerRadius={60}
              strokeWidth={8}
              stroke="white"
              paddingAngle={2}
              isAnimationActive={true} 
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalLoans.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-[10px] uppercase font-medium"
                        >
                          Total Sirkulasi
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* 3. Refactor Legend: Proteksi render string */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-4 pb-4 text-xs">
        {formattedData.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-muted-foreground">
              {/* Amankan akses ke chartConfig */}
              {chartConfig[item.status]?.label || String(item.status)}
            </span>
            <span className="font-bold text-foreground">{item.total}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
