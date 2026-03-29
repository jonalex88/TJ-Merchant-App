import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Copy, Check, ChevronDown } from 'lucide-react';
import StatusPill from '@/components/StatusPill';
import SiteAvatar from '@/components/SiteAvatar';
import SiteFilterDropdown from '@/components/SiteFilterDropdown';
import { transactions, stores, getStoreName, formatZAR } from '@/data/mockData';
import { Transaction } from '@/types';

const filterChips = ['All', 'Approved', 'Declined', 'Purchase', 'Refund'];

const TransactionsScreen = ({
  storeOverrides,
  selectedStoreIds,
}: {
  storeOverrides: Record<string, string>;
  selectedStoreIds: string[];
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterStores, setFilterStores] = useState<string[]>([]);

  const filtered = transactions.filter(txn => {
    const name = getStoreName(txn.storeId, storeOverrides);
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || txn.maskedPan.includes(search);
    const matchesFilter = activeFilter === 'All' ||
      txn.outcome === activeFilter ||
      txn.type === activeFilter;
    const matchesStore = selectedStoreIds.length === 0 || selectedStoreIds.includes(txn.storeId);
    const matchesScreenFilter = filterStores.length === 0 || filterStores.includes(txn.storeId);
    return matchesSearch && matchesFilter && matchesStore && matchesScreenFilter;
  });

  const handleCopy = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky search */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-2 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Filter size={14} className="text-muted-foreground" />
              {activeFilter !== 'All' && (
                <span className="w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">1</span>
              )}
            </div>
          </div>
          <SiteFilterDropdown selectedStores={filterStores} onStoresChange={setFilterStores} storeOverrides={storeOverrides} />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 items-center">
          {filterChips.map(chip => (
            <button key={chip} onClick={() => setActiveFilter(chip)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${chip === activeFilter ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}
            >{chip}</button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      {/* GET /api/v1/transactions → Transaction list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={48} className="text-muted-foreground/30 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">No transactions match your filters</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          filtered.map((txn, i) => (
            <TransactionRow key={txn.id} txn={txn} storeOverrides={storeOverrides} index={i}
              expanded={expandedId === txn.id}
              onToggle={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
              onCopy={handleCopy}
              copied={copiedId === txn.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TransactionRow = ({ txn, storeOverrides, index, expanded, onToggle, onCopy, copied }: {
  txn: Transaction; storeOverrides: Record<string, string>; index: number;
  expanded: boolean; onToggle: () => void; onCopy: (id: string) => void; copied: boolean;
}) => {
  const name = getStoreName(txn.storeId, storeOverrides);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-all ${copied ? 'ring-2 ring-accent/40' : ''}`}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3 active:bg-secondary/50 transition-colors text-left">
        <SiteAvatar name={name} size={36} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          <p className="text-[11px] text-muted-foreground">{txn.type} · {txn.maskedPan}</p>
        </div>
        <div className="text-right shrink-0 flex flex-col items-end gap-1">
          <p className="text-sm font-semibold text-foreground">{txn.type === 'Refund' ? '-' : ''}{formatZAR(txn.amount)}</p>
          <StatusPill status={txn.outcome} />
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-3 pb-3 pt-1 border-t border-border space-y-2">
              {[
                ['Transaction ID', txn.id],
                ['Terminal ID', txn.terminalId],
                ['Store ID', txn.storeId],
                ['Card Scheme', txn.cardScheme],
                ['Auth Code', txn.authCode || '—'],
                ['Time', new Date(txn.timestamp).toLocaleString('en-ZA')],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground font-mono text-[11px]">{val}</span>
                </div>
              ))}
              <button onClick={() => onCopy(txn.id)}
                className="w-full flex items-center justify-center gap-2 py-2 mt-1 rounded-lg bg-accent/10 text-accent text-xs font-medium active:scale-[0.97] transition-transform">
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Transaction ID'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionsScreen;
