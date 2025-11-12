/**
 * Listing Card Skeleton
 * Loading placeholder for listing cards
 */

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ListingCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-video w-full" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-3">
          {/* Category Badge Skeleton */}
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Title Skeleton */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="space-y-4">
          {/* Location and Price Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Author and Date Skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex space-x-1">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>

          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Grid of skeleton cards
 */
export const ListingCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  );
};
