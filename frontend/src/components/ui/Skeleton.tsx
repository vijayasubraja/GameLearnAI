import React from 'react';
import { cn } from '../../lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...rest }) => {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse-soft rounded-md bg-white/[0.06]', className)}
      {...rest}
    />
  );
};

export const SkeletonLine: React.FC<{ width?: string; className?: string }> = ({ width = '100%', className }) => (
  <Skeleton className={cn('h-3', className)} style={{ width }} />
);

interface SkeletonCardProps {
  lines?: number;
  showTitle?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 3, showTitle = true }) => (
  <div className="panel rounded-xl p-5 space-y-3">
    {showTitle && (
      <>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-2 w-1/5" />
      </>
    )}
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className="h-3 w-full" style={{ width: `${92 - i * 12}%` }} />
    ))}
  </div>
);