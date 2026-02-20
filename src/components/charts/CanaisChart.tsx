import { useState, useEffect } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { BarChart3 } from 'lucide-react';

interface AtendimentoPorCanal {
  canal: string;
  total: number;
}

interface CanaisChartProps {
  dados: AtendimentoPorCanal[];
  loading?: boolean;
}

// Cores temáticas vermelho + complementos quentes
const cores = [
  { bar: 'bg-brand-500', bg: 'bg-brand-50', text: 'text-brand-700' },
  { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
  { bar: 'bg-rose-400', bg: 'bg-rose-50', text: 'text-rose-700' },
  { bar: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
  { bar: 'bg-red-300', bg: 'bg-red-50', text: 'text-red-600' },
  { bar: 'bg-pink-500', bg: 'bg-pink-50', text: 'text-pink-700' },
];

export const CanaisChart = ({ dados, loading = false }: CanaisChartProps) => {
  const [animatedWidths, setAnimatedWidths] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = dados.reduce((acc, item) => acc + item.total, 0);

  useEffect(() => {
    if (!dados || dados.length === 0) return;

    // Animate widths after a brief delay
    const timer = setTimeout(() => {
      setAnimatedWidths(
        dados.map((item) => (item.total / total) * 100)
      );
    }, 50);

    return () => clearTimeout(timer);
  }, [dados, total]);

  if (loading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-4 w-16" />
            </div>
            <div className="skeleton h-4 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!dados || dados.length === 0) {
    return <EmptyState title="Sem dados de canais" icon={<BarChart3 className="text-ink-300" size={28} />} />;
  }

  return (
    <div className="space-y-5">
      {dados.map((item, index) => {
        const percentual = (item.total / total) * 100;
        const cor = cores[index % cores.length];
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={item.canal}
            className="group animate-fade-in-up cursor-default"
            style={{ animationDelay: `${index * 0.08}s` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Label row */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${cor.bar} transition-transform duration-200 ${isHovered ? 'scale-125' : ''}`} />
                <span className={`text-sm font-semibold transition-colors duration-200 ${isHovered ? 'text-ink-900' : 'text-ink-700'}`}>
                  {item.canal}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold transition-all duration-200 ${isHovered ? 'text-ink-900 scale-105' : 'text-ink-700'}`}>
                  {item.total.toLocaleString('pt-BR')}
                </span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md transition-colors duration-200 ${cor.bg} ${cor.text}`}>
                  {percentual.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className="w-full bg-surface-200 rounded-full h-3.5 overflow-hidden">
              <div
                className={`
                  h-full ${cor.bar} rounded-full 
                  transition-all duration-700 ease-out
                  ${isHovered ? 'opacity-100 brightness-110' : 'opacity-90'}
                `}
                style={{ width: `${animatedWidths[index] ?? 0}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Total */}
      <div className="mt-6 pt-5 border-t-2 border-surface-200 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink-400 uppercase tracking-wider">Total Geral</span>
          <span className="text-xl font-bold text-ink-900 font-display">
            {total.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};
