import toast, { Toast as HotToast } from 'react-hot-toast';
import './Toast.css';

export type ToastType = 'block' | 'success' | 'warning';

export interface ToastOptions {
  title?: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

const toastIcons = {
  block: '🚫',
  success: '✓',
  warning: '⚠',
};

const CustomToastComponent = ({ 
  type, 
  title: _title, 
  message, 
  action, 
  t 
}: { 
  type: ToastType; 
  title?: string; 
  message: string; 
  action?: { label: string; onClick: () => void }; 
  t: HotToast;
}) => {
  return (
    <div
      className={`toast-container toast-${type}`}
      style={{
        '--toast-opacity': t.visible ? '1' : '0',
        '--toast-transform': t.visible ? 'translateX(0)' : 'translateX(100%)',
      } as React.CSSProperties}
    >
      {/* Icon */}
      <div className="toast-icon">
        {toastIcons[type]}
      </div>

      {/* Content */}
      <div className="toast-content">
        <div className="toast-message">
          {message}
        </div>
      </div>

      {/* Action Button */}
      {action && (
        <button
          className="toast-action-button"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}

      {/* Dismiss Button */}
      <button
        className="toast-dismiss-button"
        onClick={() => toast.dismiss(t.id)}
      >
        ×
      </button>
    </div>
  );
};

export const showToast = (type: ToastType, options: ToastOptions) => {
  const { title, message, action, duration = 5000 } = options;

  return toast.custom((t) => (
    <CustomToastComponent
      type={type}
      title={title}
      message={message}
      action={action}
      t={t}
    />
  ), {
    duration,
    position: 'top-right',
  });
};

// Convenience functions for each toast type
export const showBlockToast = (options: ToastOptions) => showToast('block', options);
export const showSuccessToast = (options: ToastOptions) => showToast('success', options);
export const showWarningToast = (options: ToastOptions) => showToast('warning', options);
