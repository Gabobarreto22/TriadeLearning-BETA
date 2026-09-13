import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'loading';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  dismiss: (id: number) => void;
  withLoading: <T>(loadingMsg: string, successMsg: string, fn: () => Promise<{ error: string | null; data?: T }>) => Promise<{ error: string | null; data?: T }>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (type !== 'loading') {
      setTimeout(() => dismiss(id), 4000);
    }
    return id;
  }, [dismiss]);

  const withLoading = useCallback(async <T,>(
    loadingMsg: string,
    successMsg: string,
    fn: () => Promise<{ error: string | null; data?: T }>,
  ): Promise<{ error: string | null; data?: T }> => {
    const loadingId = toast(loadingMsg, 'loading');
    const result = await fn();
    dismiss(loadingId);
    if (result.error) {
      toast(result.error, 'error');
    } else {
      toast(successMsg, 'success');
    }
    return result;
  }, [toast, dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss, withLoading }}>
      {children}
      {createPortal(
        <div className="toast-container">
          {toasts.map((t) => (
            <div key={t.id} className={`toast toast-${t.type}`}>
              {t.type === 'success' && <CheckCircle2 size={18} />}
              {t.type === 'error' && <AlertCircle size={18} />}
              {t.type === 'info' && <Info size={18} />}
              {t.type === 'loading' && <Loader2 size={18} className="toast-spinner" />}
              <span>{t.message}</span>
              {t.type !== 'loading' && (
                <button className="toast-close" onClick={() => dismiss(t.id)}>
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
