import { AlertCircle, RefreshCcw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  type?: 'connection' | 'generic';
}

export const ErrorState = ({
  title = 'Algo deu errado',
  message,
  onRetry,
  fullScreen = false,
  type = 'generic',
}: ErrorStateProps) => {
  const Icon = type === 'connection' ? WifiOff : AlertCircle;

  const content = (
    <div className="animate-fade-in-scale max-w-md w-full text-center px-4">
      {/* Icon with animated ring */}
      <div className="relative mx-auto w-20 h-20 mb-6">
        <div className="absolute inset-0 bg-brand-100 rounded-full animate-ping opacity-20" />
        <div className="relative w-20 h-20 bg-brand-50 border-2 border-brand-200 rounded-full flex items-center justify-center">
          <Icon className="text-brand-600" size={32} />
        </div>
      </div>

      <h3 className="text-xl font-bold text-ink-900 mb-2 font-display">{title}</h3>
      <p className="text-ink-400 mb-8 text-sm leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            inline-flex items-center justify-center gap-2 
            px-6 py-3 bg-brand-600 text-white rounded-xl 
            font-semibold text-sm
            hover:bg-brand-700 active:scale-[0.97]
            transition-all duration-200
            shadow-lg shadow-brand-600/25
            focus-brand
          "
        >
          <RefreshCcw size={16} />
          Tentar novamente
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-100 w-full">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {content}
    </div>
  );
};
