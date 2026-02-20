interface SkeletonProps {
  className?: string;
  lines?: number;
  circle?: boolean;
}

export const Skeleton = ({ className = '', lines = 1, circle = false }: SkeletonProps) => {
  if (circle) {
    return <div className={`skeleton rounded-full ${className}`} />;
  }

  if (lines > 1) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 ${i === lines - 1 ? 'w-3/5' : 'w-full'} ${className}`}
          />
        ))}
      </div>
    );
  }

  return <div className={`skeleton ${className}`} />;
};
