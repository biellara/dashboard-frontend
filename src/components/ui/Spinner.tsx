interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

export const Spinner = ({ size = 'md', label }: SpinnerProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizes[size]} border-brand-200 border-t-brand-600 rounded-full animate-spin-slow`}
      />
      {label && (
        <span className="text-sm text-ink-400 animate-pulse font-medium">{label}</span>
      )}
    </div>
  );
};
