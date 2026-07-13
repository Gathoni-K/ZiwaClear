import { useEffect, useState, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

let addToastFn: ((message: string, type: ToastType) => void) | null = null;

export function toast(message: string, type: ToastType = "info") {
  addToastFn?.(message, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    addToastFn = (message, type) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle size={16} className="text-green-400" />,
    error: <AlertCircle size={16} className="text-red-400" />,
    info: <XCircle size={16} className="text-primary" />,
  };

  const bgColors: Record<ToastType, string> = {
    success: "border-green-500/30",
    error: "border-red-500/30",
    info: "border-primary/30",
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-tile border ${bgColors[t.type]} shadow-lg animate-[slideUp_0.3s_ease-out] text-sm font-medium`}
        >
          {icons[t.type]}
          <span className="text-foreground">{t.message}</span>
          <button
            type="button"
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-2 text-muted hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}