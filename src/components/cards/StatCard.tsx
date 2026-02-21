import { Skeleton } from '../ui/Skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  description?: string;
  badge?: React.ReactNode;
  valueColor?: string;
  loading?: boolean;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  description,
  badge,
  valueColor = 'text-ink-900',
  loading = false,
  delay = 0,
}: StatCardProps) => {
  if (loading) {
    return (
      <div
        className="bg-white p-6 rounded-2xl shadow-sm border border-surface-300 animate-fade-in-up"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-24 mb-2" />
        <Skeleton className="h-3 w-36" />
      </div>
    );
  }

  return (
    <div
      className="
        bg-white p-6 rounded-2xl shadow-sm 
        border border-surface-300
        hover-lift group
        animate-fade-in-up
      "
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 bg-surface-100 rounded-xl group-hover:bg-brand-50 transition-colors duration-300">
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2.5 mb-1">
        <h3 className={`text-3xl font-bold tracking-tight font-display ${valueColor}`}>
          {value}
        </h3>
        {trend && (
          <span
            className={`
              inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full
              ${trend.isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-brand-50 text-brand-600'
              }
            `}
          >
            <svg
              width="10" height="10" viewBox="0 0 10 10"
              className={`${!trend.isPositive ? 'rotate-180' : ''}`}
            >
              <path d="M5 2L8 6H2L5 2Z" fill="currentColor" />
            </svg>
            {Math.abs(trend.value)}%
          </span>
        )}
        {badge && <div className="ml-auto">{badge}</div>}
      </div>

      {/* Subtitle or Description */}
      {(subtitle || description) && (
        <p className="text-xs text-ink-400 mt-1.5 leading-relaxed">{subtitle || description}</p>
      )}
    </div>
  );
};
