
'use client';

import { ToastItem } from './ToastItem';
import { ToastMessage } from './types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer = ({ toasts, removeToast }: ToastContainerProps) => {
  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 top-4 right-4 z-[100] flex flex-col items-end gap-3 pointer-events-none"
      style={{
        padding: '1rem',
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};
