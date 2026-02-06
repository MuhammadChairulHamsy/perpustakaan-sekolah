"use client"

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"
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

const chartConfig = {
  total: {
    label: "Total Pinjam",
    color: "#43B7EC",
  },
}

const TopBooksChart = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle>Buku Paling Sering Dipinjam</CardTitle>
        <CardDescription>Top 5 koleksi literasi paling populer</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={sortedData}
            layout="vertical"
            margin={{
              left: 30,
            }}
          >
            <XAxis type="number" dataKey="total" hide />
            <YAxis
              dataKey="title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              layout="vertical"
              radius={5}
            >
              <LabelList
                dataKey="total"
                position="right"
                offset={8}
                className="fill-foreground font-semibold"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default TopBooksChart