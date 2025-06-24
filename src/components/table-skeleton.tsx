import { Skeleton } from "./ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-64 w-full rounded-md" />
    </div>
  );
}
