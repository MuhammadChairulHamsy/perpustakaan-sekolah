"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";

export const FineCollectionTrend = ({data}) => {
  const chartConfig = {
   amount: {
      label: "Pendapatan",
      color: "#43B7EC",
    },
  };

  return (
   <div className="flex flex-col h-full bg-card">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader>
          <CardTitle>Tren Koleksi Terbaik</CardTitle>
          <CardDescription>Pendapatan 7 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ left: 40, right: 60 }}
            >
              <XAxis type="number" dataKey="amount" hide />
              <YAxis
                dataKey="date"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="amount"
                fill="var(--color-amount)"
                layout="vertical"
                radius={5}
                barSize={20}
              >
                <LabelList
                  dataKey="amount"
                  position="right"
                  formatter={(value) => `Rp ${value.toLocaleString()}`}
                  className="fill-foreground font-medium"
                  fontSize={10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
