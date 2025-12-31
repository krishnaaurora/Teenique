import React, { useState, useEffect } from 'react';

interface CountingNumberProps {
  target: string;
  duration?: number;
  className?: string;
  start?: boolean;
  style?: React.CSSProperties;
}

const CountingNumber: React.FC<CountingNumberProps> = ({ target, duration = 2000, className, start = true, style }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startNum = 0;
    let end = 0;
    let suffix = '';

    // Parse the target
    if (target.includes('K+')) {
      end = parseInt(target.replace('K+', '')) * 1000;
      suffix = 'K+';
    } else if (target.includes('+')) {
      end = parseInt(target.replace('+', ''));
      suffix = '+';
    } else if (target.includes('.')) {
      end = parseFloat(target) * 10; // multiply by 10 for decimal precision
      suffix = '.' + target.split('.')[1];
    } else {
      end = parseInt(target);
    }

    const increment = end / (duration / 50); // update every 50ms
    const timer = setInterval(() => {
      startNum += increment;
      if (startNum >= end) {
        setCurrent(end);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(startNum));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [target, duration, start]);

  const displayValue = () => {
    if (target.includes('K+')) {
      return `${Math.floor(current / 1000)}K+`;
    } else if (target.includes('+')) {
      return `${current}+`;
    } else if (target.includes('.')) {
      return `${(current / 10).toFixed(1)}`;
    } else {
      return current.toString();
    }
  };

  return <span className={className} style={style}>{displayValue()}</span>;
};

export default CountingNumber;