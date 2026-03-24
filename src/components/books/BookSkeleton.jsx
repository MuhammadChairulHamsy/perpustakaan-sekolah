import { Skeleton } from "../ui/skeleton";

const BookSkeleton = () => {
  return (
    <div className="container space-y-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <Skeleton className="h-4 w-60 bg-gray-200" />
        </div>
        <div>
          <Skeleton className="h-7 w-40 my-2 bg-gray-200 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Skeleton className="h-8 flex-1 max-w-md bg-gray-200 rounded-md" />
      </div>

      <div className="flex w-full rounded-lg border flex-col gap-3">
        <div className="grid grid-cols-7 gap-4 border-b pb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="grid grid-cols-4 gap-4 border rounded-lg" key={i}>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSkeleton;
