import { Skeleton } from "../ui/skeleton";

export const SettingSkeleton = () => {
  return (
    <div className="container space-y-6 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <Skeleton className="h-4 w-60 bg-gray-200" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-8 flex-1 max-w-sm bg-gray-200 rounded-md" />
      </div>
      <div className="space-y-4 px-6">
        <Skeleton className="h-4 w-40 bg-gray-200 rounded-xl" />
        <Skeleton className="h-4 w-64 bg-gray-200 rounded-xl" />
        <div className="flex flex-col overflow-x-auto">
          <div className="w-full">
            <Skeleton className="h-96 w-full rounded-xl border bg-gray-200" />
          </div>
          <hr className="mt-6 w-full" />
          <div className="flex flex-col items-end">
            <Skeleton className="h-7 w-40 my-4 rounded-md border bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
