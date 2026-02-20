import { Spinner } from './Spinner';
import { Skeleton } from './Skeleton';

export const PageLoader = () => {
  return (
    <div className="min-h-screen bg-surface-100 w-full overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-brand-800 w-full h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-700" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-end justify-between">
            <div className="space-y-3">
              <Skeleton className="h-9 w-64 !bg-white/10" />
              <Skeleton className="h-5 w-96 !bg-white/10" />
            </div>
            <Skeleton className="h-12 w-40 rounded-xl !bg-white/10" />
          </div>
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>

        {/* Centered spinner */}
        <div className="flex justify-center py-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Spinner size="lg" label="Carregando dados do dashboard..." />
        </div>

        {/* Lower content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-surface-300">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-8 w-24 mb-3" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
