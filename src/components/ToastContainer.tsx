import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-[#12181E] border-emerald-500/40 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-[#1A1115] border-rose-500/40 text-rose-200'
              : 'bg-[#141720] border-zinc-700 text-zinc-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs font-medium leading-relaxed">
            {toast.message}
          </div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-zinc-500 hover:text-zinc-300 p-0.5 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
