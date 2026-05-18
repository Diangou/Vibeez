import { useEffect } from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  onDismiss: () => void;
}

export function Toast({ message, icon, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-6 py-4 flex items-center gap-3 text-white animate-in fade-in slide-in-from-bottom-2 duration-300">
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium">{message}</span>
    </div>
  );
}
