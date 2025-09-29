import { useCallback } from 'react';
import { showBlockToast, showSuccessToast, showWarningToast, ToastOptions } from '@/components/Toast/CustomToast';

export const useToast = () => {
  const block = useCallback((options: ToastOptions) => {
    return showBlockToast(options);
  }, []);

  const success = useCallback((options: ToastOptions) => {
    return showSuccessToast(options);
  }, []);

  const warning = useCallback((options: ToastOptions) => {
    return showWarningToast(options);
  }, []);

  return {
    block,
    success,
    warning,
  };
};
