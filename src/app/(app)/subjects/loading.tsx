import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/ui/card-grid-skeleton";

export default function SubjectsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <CardGridSkeleton count={6} />
    </div>
  );
}
