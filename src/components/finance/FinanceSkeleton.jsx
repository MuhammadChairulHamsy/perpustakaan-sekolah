import { Skeleton } from "../ui/skeleton";

export const FinanceSkeleton = () => {
  return (
    <div className="container space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <Skeleton className="h-4 w-60 bg-gray-200" />
        </div>
      </div>

      {/* Stats Cards */}
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
            <Skeleton className="h-4 w-30 bg-gray-200" />
            <Skeleton className="h-4 w-45 bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Chart Status — setengah halaman */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-7">
          <Skeleton className="h-96 w-full rounded-xl border bg-gray-200" />
        </div>
         <div className="lg:col-span-3">
         <Skeleton className="h-96 w-full rounded-xl border bg-gray-200" />
         </div>
      </div>
    </div>
  );
};
