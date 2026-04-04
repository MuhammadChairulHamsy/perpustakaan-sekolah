import { Skeleton } from "../ui/skeleton";

export const NotificationSkeleton = () => {
  return (
    <div className="container space-y-6 animate-pulse">
      <div className="flex flex-col justify-between items-center lg:flex lg:flex-row">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 bg-gray-200" />
          <Skeleton className="h-4 w-60 bg-gray-200" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-40 bg-gray-200" />
          <Skeleton className="h-7 w-48 bg-gray-200 rounded-md" />
        </div>
      </div>

      <div  className="p-0 divide-y divide-border overflow-hidden">
        <Skeleton className="h-28 w-full bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};
