import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
}

export const EmptyState = ({
  title = 'Nenhum dado disponível',
  message = 'Os dados aparecerão aqui quando estiverem disponíveis.',
  icon,
}: EmptyStateProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-surface-200 rounded-2xl flex items-center justify-center mb-4 animate-gentle-bounce">
        {icon || <Inbox className="text-ink-300" size={28} />}
      </div>
      <h4 className="text-base font-semibold text-ink-700 mb-1 font-display">{title}</h4>
      <p className="text-sm text-ink-400 max-w-xs">{message}</p>
    </div>
  );
};
