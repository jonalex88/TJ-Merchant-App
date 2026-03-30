import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Activity, Bell, BellOff } from 'lucide-react';
import SiteFilterDropdown from '@/components/SiteFilterDropdown';
import { terminals, stores, getStoreName, formatZAR, transactions } from '@/data/mockData';
import { toast } from 'sonner';

const relativeTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const statusColor: Record<string, string> = {
  active: 'bg-accent',
  recent: 'bg-amber',
  dormant: 'bg-muted-foreground/40',
};

const barColor: Record<string, string> = {
  active: 'bg-accent',
  recent: 'bg-amber/60',
  dormant: 'bg-muted-foreground/20',
};

const TerminalsScreen = ({
  storeOverrides,
  selectedStoreIds,
}: {
  storeOverrides: Record<string, string>;
  selectedStoreIds: string[];
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mutedTerminals, setMutedTerminals] = useState<Set<string>>(new Set());
  const [filterStores, setFilterStores] = useState<string[]>([]);

  const toggleNotification = (terminalId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMutedTerminals(prev => {
      const next = new Set(prev);
      if (next.has(terminalId)) {
        next.delete(terminalId);
        toast.success(`Notifications for ${terminalId} activated`);
      } else {
        next.add(terminalId);
        toast('Notifications for ' + terminalId + ' deactivated', { icon: '🔕' });
      }
      return next;
    });
  };

  const filteredTerminals = (selectedStoreIds.length === 0
    ? terminals
    : terminals.filter(t => selectedStoreIds.includes(t.storeId))
  ).filter(t => filterStores.length === 0 || filterStores.includes(t.storeId));

  // GET /api/v1/status/terminal → Terminal list
  return (
    <div className="px-4 pt-4 pb-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-lg font-bold text-foreground">Payment Terminals</h1>
        <SiteFilterDropdown selectedStores={filterStores} onStoresChange={setFilterStores} storeOverrides={storeOverrides} managedStores={selectedStoreIds} />
      </div>
      <p className="text-xs text-muted-foreground mb-4">Sorted by last activity — most recent first</p>

      <div className="space-y-3">
        {filteredTerminals.map((t, i) => {
          const isLast = i === filteredTerminals.length - 1;
          const name = getStoreName(t.storeId, storeOverrides);
          const expanded = expandedId === t.terminalId;
          const lastTxn = transactions.find(tx => tx.terminalId === t.terminalId);
          const activityPercent = t.status === 'active' ? 85 : t.status === 'recent' ? 45 : 15;

          return (
            <motion.div key={t.terminalId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
            >
              <button onClick={() => setExpandedId(expanded ? null : t.terminalId)}
                className="w-full p-3 active:bg-secondary/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusColor[t.status]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">{t.terminalId}</span>
                      {isLast && (
                        <span className="text-[10px] bg-accent/15 text-accent font-medium px-2 py-0.5 rounded-full">Most Active</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={(e) => toggleNotification(t.terminalId, e)}
                      className="p-1 rounded-md active:scale-90 transition-transform">
                      {mutedTerminals.has(t.terminalId) ? (
                        <BellOff size={14} className="text-muted-foreground/40" />
                      ) : (
                        <Bell size={14} className="text-accent" />
                      )}
                    </button>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{relativeTime(t.lastUsed)}</p>
                      <ChevronDown size={14} className={`text-muted-foreground ml-auto mt-1 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${barColor[t.status]}`}
                    initial={{ width: 0 }} animate={{ width: `${activityPercent}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06 + 0.3 }} />
                </div>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-3 pb-3 pt-1 border-t border-border space-y-2">
                      {lastTxn && (
                        <>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Last Amount</span>
                            <span className="font-medium text-foreground">{formatZAR(lastTxn.amount)}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Last Type</span>
                            <span className="font-medium text-foreground">{lastTxn.type}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Store</span>
                        <span className="font-medium text-foreground">{name}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Activity size={10} /> 7-day activity</p>
                        <div className="flex gap-0.5 h-6 items-end">
                          {[20, 45, 30, 60, 35, 70, activityPercent].map((v, j) => (
                            <motion.div key={j} className={`flex-1 rounded-sm ${barColor[t.status]}`}
                              initial={{ height: 0 }} animate={{ height: `${v}%` }}
                              transition={{ delay: j * 0.05 + 0.2 }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TerminalsScreen;
