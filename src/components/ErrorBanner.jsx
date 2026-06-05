import { AlertCircle, X } from "lucide-react";

// Inline, dismissable error surface for failed API calls.
export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="shrink-0 hover:text-rose-900">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
