"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  borrowed: {
    label: "Dipinjam",
    color: "hsl(var(--chart-1))",
  },
  returned: {
    label: "Dikembalikan",
    color: "hsl(var(--chart-2))",
  },
}

const MonthlyLoanChart = ({ data }) => {
  const [timeRange, setTimeRange] = React.useState("90d")

  // Format data agar sesuai dengan kebutuhan grafik
  const formattedData = React.useMemo(() => {
    return data.map((item) => ({
      // Mengasumsikan item.month berformat "YYYY-MM"
      date: item.month + "-01",
      borrowed: Number(item.borrowed || 0),
      returned: Number(item.returned || 0),
    }))
  }, [data])

  // Filter data berdasarkan range waktu (Opsional, jika data kamu banyak)
  const filteredData = formattedData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date() // Menggunakan waktu sekarang sebagai acuan
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7
    
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Tren Peminjaman Buku</CardTitle>
          <CardDescription>
            Menampilkan statistik sirkulasi buku bulanan
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Pilih rentang waktu"
          >
            <SelectValue placeholder="3 Bulan Terakhir" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 Bulan Terakhir
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 Hari Terakhir
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 Hari Terakhir
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBorrowed" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-borrowed)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-borrowed)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillReturned" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-returned)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-returned)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", {
                  month: "short",
                  year: "2-digit",
                })
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="returned"
              type="monotone"
              fill="url(#fillReturned)"
              stroke="var(--color-returned)"
              stackId="a"
              name="Dikembalikan"
            />
            <Area
              dataKey="borrowed"
              type="monotone"
              fill="url(#fillBorrowed)"
              stroke="var(--color-borrowed)"
              stackId="a"
              name="Dipinjam"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MonthlyLoanChart