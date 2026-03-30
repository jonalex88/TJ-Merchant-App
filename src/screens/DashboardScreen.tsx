import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, RefreshCw } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import StatusPill from '@/components/StatusPill';
import SiteAvatar from '@/components/SiteAvatar';
import DateTimeRangeSelector from '@/components/DateTimeRangeSelector';
import { metrics, transactions, salesByStore, getStoreName, formatZAR } from '@/data/mockData';
import { useState, useEffect } from 'react';

const DashboardScreen = ({ storeOverrides, onNavigate }: { storeOverrides: Record<string, string>; onNavigate: (tab: number) => void }) => {
  const [loaded, setLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [fromDateTime, setFromDateTime] = useState<Date>(() => {
    const date = new Date();
    date.setHours(date.getHours() - 1); // Default: 1 hour ago
    return date;
  });
  const [window, setWindow] = useState('1h');

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(t);
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const recentTxns = transactions.slice(0, 5);
  const maxSale = Math.max(...salesByStore.map(s => s.sales));

  return (
    <div className="px-4 pt-4 pb-6 space-y-5 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-foreground">{greeting}, Sarah 👋</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Here's your overview</p>
      </motion.div>

      {/* Date/Time Range Selector */}
      <DateTimeRangeSelector
        fromDateTime={fromDateTime}
        window={window}
        onFromDateTimeChange={setFromDateTime}
        onWindowChange={setWindow}
      />

      {/* Last Updated Timestamp */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between px-4 py-2 rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <RefreshCw size={12} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Last updated <span className="font-medium">{formatTimeAgo(lastUpdated)}</span></span>
        </div>
        <button
          onClick={() => setLastUpdated(new Date())}
          className="text-xs text-accent font-medium active:scale-90 transition-transform p-1"
        >
          Refresh
        </button>
      </motion.div>

      {!loaded ? (
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-4 shadow-sm border border-border active:scale-[0.97] transition-transform cursor-pointer">
            <p className="text-xs text-muted-foreground mb-1">Total Sales</p>
            <AnimatedCounter target={metrics.totalSales} prefix="R " decimals={2} className="text-lg font-bold text-foreground" />
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-green" />
              <span className="text-[10px] text-green font-medium">+12.5%</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">Transactions</p>
            <AnimatedCounter target={metrics.transactionCount} className="text-lg font-bold text-foreground" />
            <p className="text-[10px] text-muted-foreground mt-2">transactions today</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">Approval Rate</p>
            <div className="flex items-center gap-3">
              <AnimatedCounter target={metrics.approvalRate} suffix="%" decimals={1} className="text-lg font-bold text-foreground" />
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
                  <motion.circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                    strokeDasharray="94.2" initial={{ strokeDashoffset: 94.2 }}
                    animate={{ strokeDashoffset: 94.2 * (1 - metrics.approvalRate / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <p className="text-xs text-muted-foreground mb-1">Declined</p>
            <AnimatedCounter target={metrics.declinedCount} className="text-lg font-bold text-coral" />
            <p className="text-[10px] text-muted-foreground mt-2">needs attention</p>
          </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl p-4 shadow-sm border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Sales by Store</h3>
        <div className="space-y-3">
          {salesByStore.map(s => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">{s.name}</span>
                <span className="text-muted-foreground">{formatZAR(s.sales)}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }}
                  animate={{ width: `${(s.sales / maxSale) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          <button onClick={() => onNavigate(1)} className="text-xs text-accent font-medium flex items-center gap-1">
            See all <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-2">
          {recentTxns.map(txn => (
            <div key={txn.id} className="flex items-center gap-3 bg-card rounded-xl p-3 shadow-sm border border-border">
              <SiteAvatar name={getStoreName(txn.storeId, storeOverrides)} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{getStoreName(txn.storeId, storeOverrides)}</p>
                <p className="text-[11px] text-muted-foreground">{new Date(txn.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">{formatZAR(txn.amount)}</p>
                <StatusPill status={txn.outcome} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardScreen;
