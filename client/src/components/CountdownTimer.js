import React, { useState, useEffect, useCallback } from 'react';
import { calculateTimeRemaining } from '../utils/helpers';

const CountdownTimer = ({ endTime, onExpire = () => {} }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(endTime));

  // Memoize onExpire to prevent useEffect re-runs
  const memoizedOnExpire = useCallback(onExpire, [onExpire]);

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeRemaining(endTime);

      setTimeLeft(prevTimeLeft => {
        // Only update if the time actually changed to prevent unnecessary renders
        if (JSON.stringify(prevTimeLeft) !== JSON.stringify(newTimeLeft)) {
          // Call onExpire only when transitioning from not expired to expired
          if (!prevTimeLeft.expired && newTimeLeft.expired) {
            memoizedOnExpire();
          }
          return newTimeLeft;
        }
        return prevTimeLeft; // Prevent unnecessary re-renders
      });
    };

    // Initial update
    updateTimer();

    // Set up interval only if not already expired
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [endTime, memoizedOnExpire]); // Remove timeLeft.expired from dependencies!

  if (timeLeft.expired) {
    return (
      <span style={{
        color: 'red',
        fontWeight: 'bold',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        🔴 AUCTION ENDED
      </span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const isEnding = days === 0 && hours === 0 && minutes < 5;

  return (
    <span style={{
      fontWeight: 'bold',
      color: isEnding ? 'red' : '#1976d2',
      fontFamily: 'monospace',
      fontSize: '1rem'
    }}>
      {days > 0 && `${days}d `}
      {String(hours).padStart(2, '0')}:
      {String(minutes).padStart(2, '0')}:
      {String(seconds).padStart(2, '0')}
    </span>
  );
};

export default CountdownTimer;
