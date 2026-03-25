import { Skeleton } from "../ui/skeleton"

export const CatalogSkeleton = () => {
  return (
    <div className="container space-y-6 p-6 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 bg-gray-200" />
          <Skeleton className="h-4 w-80 bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-7 flex-1 max-w-md bg-gray-200 rounded-md" />
          <Skeleton className="h-7 w-40 bg-gray-200 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
          {[...Array(10)].map((_, item) => (
            <div
              key={item}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white"
            >
              <Skeleton className="aspect-3/4 w-full bg-gray-200 rounded-none" />

              <div className="space-y-3 p-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                </div>
                <Skeleton className="h-3 w-[50%] bg-gray-200" />
                <div className="flex flex-col gap-2 pt-7">
                  <Skeleton className="h-3 w-20 bg-gray-200" />
                  <Skeleton className="h-3 w-16 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

