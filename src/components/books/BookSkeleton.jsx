import { Skeleton } from "../ui/skeleton";

const BookSkeleton = () => {
  return (
    <div className="container space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <Skeleton className="h-4 w-60 bg-gray-200" />
        </div>
        <div>
          <Skeleton className="h-7 w-40 bg-gray-200 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-8 flex-1 max-w-md bg-gray-200 rounded-md" />
      </div>

      <div className="flex w-full rounded-lg border flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 border-b px-4 py-3">
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
          <Skeleton className="h-4 w-20 bg-gray-200" />
        </div>

        {/* Table Rows */}
        <div className="divide-y">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="grid grid-cols-7 items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-16 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-16 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSkeleton;