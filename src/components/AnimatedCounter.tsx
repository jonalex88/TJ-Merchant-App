import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const AnimatedCounter = ({ target, duration = 1.2, prefix = '', suffix = '', decimals = 0, className = '' }: AnimatedCounterProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  const formatted = decimals > 0
    ? current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    : Math.round(current).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
