import { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const config = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    iconColor: 'text-emerald-500',
    defaultDuration: 5000,
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    iconColor: 'text-red-500',
    defaultDuration: 10000,
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    iconColor: 'text-amber-500',
    defaultDuration: 8000,
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
    defaultDuration: 5000,
  },
};

export const Toast = ({ type, message, duration, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { icon: Icon, bg, text, iconColor, defaultDuration } = config[type];
  const finalDuration = duration ?? defaultDuration;

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => handleClose(), finalDuration);
    return () => clearTimeout(timer);
  }, [finalDuration]);

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 max-w-md w-full
      transform transition-all duration-300 ease-out
      ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
    `}>
      <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bg}`}>
        <Icon className={`${iconColor} flex-shrink-0 mt-0.5`} size={20} />
        <p className={`text-sm font-medium flex-1 ${text}`}>{message}</p>
        <button
          onClick={handleClose}
          className={`${text} opacity-60 hover:opacity-100 transition-opacity flex-shrink-0`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};