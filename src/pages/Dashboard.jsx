import { AlertTriangle } from "lucide-react";
import {
  StatsCard,
  LatestActivityTable,
  DashboardSkeleton,
} from "../components/dashboard";
import { useDashboard } from "../hooks/useDashboard";
import { lazy, Suspense } from "react";
import { useMemo } from "react";
import { getStatsCards, getChartStatusData } from "../data/dataDashboard";

const LoanStatusChart = lazy(() =>
  import("../components/reports/LoanStatusChart").then((module) => ({
    default: module.LoanStatusChart,
  })),
);
export const Dashboard = () => {
  const { data, isLoading, error } = useDashboard();

  const statsCards = useMemo(() => getStatsCards(data), [data]);
  const chartStatusData = useMemo(() => getChartStatusData(data), [data]);
  const latestActivities = data?.latestActivities || [];

  const totalAllLoans = useMemo(() => {
    return chartStatusData.reduce(
      (acc, curr) => acc + (Number(curr.total) || 0),
      0,
    );
  }, [chartStatusData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-chart-large items-center justify-center border-2 border-dashed rounded-xl m-8">
        <div className="text-center">
          <div className="bg-red-50 p-3 rounded-full inline-block mb-4">
            <AlertTriangle className="text-red-500 w-8 h-8" />
          </div>
          <p className="text-red-600 font-bold mb-1">Gagal Memuat Data</p>
          <p className="text-muted-foreground text-sm">
            {typeof error === "object"
              ? error.message || "Terjadi kesalahan sistem"
              : String(error)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container space-y-8">
      <div className="flex flex-col md:flex-row    md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Selamat datang kembali! Berikut ringkasan perpustakaan Anda hari
            ini.
          </p>
        </div>
        <div className="text-sm px-4 py-2 bg-muted/50 rounded-full border text-muted-foreground font-medium">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard
            key={index}
            {...stat}
            value={
              stat.value !== undefined && stat.value !== null
                ? String(stat.value)
                : "0"
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-5">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Aktivitas Terkini
          </h2>
          <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm">
            <LatestActivityTable activities={latestActivities} />
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Statistik Status
          </h2>
          <div className="bg-white border rounded-xl shadow-sm flex-1 items-center justify-center">
            <Suspense fallback={<div>Loading chart...</div>}>
              <LoanStatusChart data={chartStatusData} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
