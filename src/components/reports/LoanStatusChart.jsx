"use client"

import * as React from "react"
import { Pie, PieChart, Label } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const COLORS = {
  borrowed: "#0DA2E7",
  returned: "#21C45D", 
  overdue: "#f59e0b", 
};

const chartConfig = {
  total: {
    label: "Total",
  },
  borrowed: {
    label: "Dipinjam",
    color: COLORS.borrowed,
  },
  returned: {
    label: "Kembali",
    color: COLORS.returned,
  },
  overdue: {
    label: "Terlambat",
    color: COLORS.overdue,
  },
}

const LoanStatusChart = ({ data }) => {
  // Format data dan hitung total untuk angka di tengah
  const { formattedData, totalLoans } = React.useMemo(() => {
    let total = 0;
    const formatted = data.map((item) => {
      total += Number(item.total || 0);
      return {
        status: item.status,
        total: Number(item.total || 0),
        fill: COLORS[item.status] || "#e5e7eb",
      };
    });
    return { formattedData: formatted, totalLoans: total };
  }, [data]);

  if (!formattedData || formattedData.length === 0) {
    return (
      <Card className="flex h-[400px] items-center justify-center border-none shadow-none bg-transparent">
        <p className="text-muted-foreground text-sm italic">Memuat data statistik...</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-none bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Status Peminjaman</CardTitle>
        <CardDescription>Persentase sirkulasi buku saat ini</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
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
              innerRadius={65}
              strokeWidth={5}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalLoans.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs uppercase tracking-wider"
                        >
                          Total Peminjam
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* Legend Manual yang lebih cantik */}
      <div className="flex flex-wrap justify-center gap-4 py-4 text-sm">
        {formattedData.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5 text-muted-foreground">
            <div 
              className="h-2 w-2 rounded-full" 
              style={{ backgroundColor: item.fill }}
            />
            <span>{chartConfig[item.status]?.label || item.status}</span>
            <span className="font-medium text-foreground">{item.total}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LoanStatusChart;