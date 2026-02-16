interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  valueColor?: string;
  loading?: boolean;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtitle,
  valueColor = 'text-slate-900',
  loading = false
}: StatCardProps) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="text-slate-400 text-xl">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2 mb-1">
        <h3 className={`text-3xl font-bold ${valueColor}`}>
          {value}
        </h3>
        {trend && (
          <span className={`text-sm font-semibold ${
            trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};