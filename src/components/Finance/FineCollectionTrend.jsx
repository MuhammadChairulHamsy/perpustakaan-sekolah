"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

export const FineCollectionTrend = ({ data }) => {
  const chartConfig = {
    amount: {
      label: "Pendapatan",
      color: "hsl(var(--primary))", 
    },
  };

  return (
    <Card className="border-none shadow-sm bg-white dark:bg-slate-950">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">Tren Pendapatan Denda</CardTitle>
            <CardDescription>Performa denda dalam 7 hari terakhir</CardDescription>
          </div>
          <div className="h-8 w-24 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary">Live Data</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart
            data={data}
            margin={{ top: 20, right: 300, left: -10, bottom: 0 }}
          >
            {/* Garis bantu horizontal yang halus */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-muted-foreground font-medium"
            />
            
            <YAxis 
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tickFormatter={(value) => `Rp${value / 1000}k`}
              className="text-muted-foreground"
            />

            <ChartTooltip 
              cursor={{ fill: '#f8fafc' }} 
              content={<ChartTooltipContent indicator="dot" />} 
            />
            
            <Bar
              dataKey="amount"
              fill="currentColor"
              className="fill-primary"
              radius={[6, 6, 0, 0]}
              barSize={35}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};