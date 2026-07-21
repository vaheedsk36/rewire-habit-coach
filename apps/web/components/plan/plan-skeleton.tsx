import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that mirrors the plan layout to avoid layout shift. */
export function PlanSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="w-full space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
