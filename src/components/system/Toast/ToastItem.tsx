
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ToastMessage, ToastType } from './types';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastItemProps {
  toast: ToastMessage;
  removeToast: (id: string) => void;
}

const toastStyles: Record<ToastType, { icon: React.ReactNode; border: string }> = {
  success: {
    icon: <CheckCircle className="text-green-500" />,
    border: 'border-green-500',
  },
  error: {
    icon: <XCircle className="text-destructive" />,
    border: 'border-destructive',
  },
  warning: {
    icon: <AlertTriangle className="text-yellow-500" />,
    border: 'border-yellow-500',
  },
  info: {
    icon: <Info className="text-blue-500" />,
    border: 'border-blue-500',
  },
};

export const ToastItem = ({ toast, removeToast }: ToastItemProps) => {
  const [isExiting, setIsExiting] = useState(false);
  
  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300); // Wait for animation
  };

  return (
    <div
      role="alert"
      className={cn(
        'w-full max-w-sm p-4 bg-card text-card-foreground rounded-xl shadow-lg border-l-4 pointer-events-auto transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-top-5 fade-in-0',
        isExiting && 'animate-out slide-out-to-right-full fade-out-0',
        toastStyles[toast.type].border
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-0.5">
          {toastStyles[toast.type].icon}
        </div>
        <div className="flex-1">
          {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleRemove}
            className="p-1 rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};
