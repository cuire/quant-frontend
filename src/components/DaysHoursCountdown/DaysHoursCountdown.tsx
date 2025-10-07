import { useState, useEffect } from 'react';
import './DaysHoursCountdown.css';

interface DaysHoursCountdownProps {
  endTime: string | Date;
  onExpire?: () => void;
  className?: string;
}

export const DaysHoursCountdown = ({ endTime, onExpire, className = '' }: DaysHoursCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>('0d 0h');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime);
      const now = new Date();
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('0d 0h');
        onExpire?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      setTimeLeft(`${days}d ${hours}h`);
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every minute (since we're only showing days and hours)
    const timer = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  return (
    <span className={`days-hours-countdown ${className}`}>
      {timeLeft}
    </span>
  );
};
