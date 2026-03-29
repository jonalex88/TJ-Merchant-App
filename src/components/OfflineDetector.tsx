import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineDetector = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed top-0 left-0 right-0 z-[999] bg-destructive/90 backdrop-blur-sm"
    >
      <div className="px-4 py-3 flex items-center gap-3 max-w-md mx-auto">
        <WifiOff size={18} className="text-destructive-foreground shrink-0 animate-pulse" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-destructive-foreground">No Internet Connection</p>
          <p className="text-xs text-destructive-foreground/80">Please check your network and try again</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OfflineDetector;
