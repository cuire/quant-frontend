import { useToast } from '@/hooks/useToast';

export const ToastDemo = () => {
  const toast = useToast();

  const handleBlockToast = () => {
    toast.block({
      message: 'You have block',
      action: {
        label: 'OK',
        onClick: () => console.log('Block action clicked'),
      },
      duration: 7000,
    });
  };

  const handleSuccessToast = () => {
    toast.success({
      message: 'You haven\'t added any channels.',
    });
  };

  const handleWarningToast = () => {
    toast.warning({
      message: 'You haven\'t added any channels.',
      duration: 8000,
    });
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3>Toast Notification Demo</h3>
      
      <button
        onClick={handleBlockToast}
        style={{
          padding: '12px 24px',
          background: '#8B4513',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Show Block Toast
      </button>
      
      <button
        onClick={handleSuccessToast}
        style={{
          padding: '12px 24px',
          background: '#228B22',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Show Success Toast
      </button>
      
      <button
        onClick={handleWarningToast}
        style={{
          padding: '12px 24px',
          background: '#DC143C',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Show Warning Toast
      </button>
    </div>
  );
};
