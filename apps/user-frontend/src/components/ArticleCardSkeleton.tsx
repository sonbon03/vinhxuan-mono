/**
 * Article Card Skeleton Component
 * Used for loading states while fetching articles
 */

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ArticleCardSkeletonProps {
  variant?: 'featured' | 'sidebar' | 'grid';
}

export const ArticleCardSkeleton = ({ variant = 'grid' }: ArticleCardSkeletonProps) => {
  // Featured article skeleton (large)
  if (variant === 'featured') {
    return (
      <article className="mb-8 xs:mb-12">
        <Skeleton className="w-full aspect-[16/10] mb-4 xs:mb-6 rounded-lg" />
        <div className="max-w-2xl space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Sidebar article skeleton
  if (variant === 'sidebar') {
    return (
      <article className="border-b border-gray-100 pb-4 xs:pb-6 last:border-b-0">
        <Skeleton className="h-3 w-24 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid article skeleton (default)
  return (
    <article className="group">
      <Skeleton className="w-full aspect-[4/3] mb-3 xs:mb-4 rounded-lg" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-3" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </article>
  );
};

/**
 * Breaking News Skeleton
 */
export const BreakingNewsSkeleton = () => {
  return (
    <div className="border-t-4 border-primary bg-white mb-12">
      <div className="p-4 border-l-4 border-primary">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-6 w-20" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Article Detail Skeleton
 */
export const ArticleDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-3 xs:px-4 xxs:px-6 sm:px-6 lg:px-8 py-6 xs:py-8">
        <Skeleton className="h-10 w-32 mb-6" />

        <article className="space-y-8">
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>

            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />

            <div className="flex flex-col xxs:flex-row xxs:items-center xxs:justify-between py-6 border-y border-gray-200 gap-4">
              <div className="flex items-center space-x-3 xs:space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </header>

          <Skeleton className="w-full aspect-video rounded-xl" />

          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};
