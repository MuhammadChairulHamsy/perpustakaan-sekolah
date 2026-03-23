import { Skeleton } from "../ui/skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="container space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-48 bg-gray-200" />
          <Skeleton className="h-4 w-80 bg-gray-200" />
        </div>
        <div>
          <Skeleton className="h-8 w-40 bg-gray-200" />
        </div>
      </div>

      {/* Stats Cards Skeleton (4 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, item) => (
          <div
            key={item}
            className="flex flex-col space-y-3 p-6 border rounded-xl bg-white"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-25 bg-gray-200" />
              <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
            <Skeleton className="h-8 w-30 bg-gray-200" />
            <Skeleton className="h-3 w-45 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton (Table & Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Aktivitas Terkini */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-36 bg-gray-200" />
          <div className="border rounded-xl p-4 space-y-4">
            {[...Array(5)].map((_, item) => (
              <Skeleton key={item} className="h-12 w-full bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Chart Status */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-36 bg-gray-200" />
          <Skeleton className="h-chart-main w-full rounded-xl border bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
