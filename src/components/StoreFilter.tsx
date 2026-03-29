import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Check } from 'lucide-react';
import { stores } from '@/data/mockData';

interface StoreFilterProps {
  selectedStores: string[];
  setSelectedStores: React.Dispatch<React.SetStateAction<string[]>>;
  storeOverrides: Record<string, string>;
}

const StoreFilter = ({ selectedStores, setSelectedStores, storeOverrides }: StoreFilterProps) => {
  const [open, setOpen] = useState(false);

  const toggle = (storeId: string) => {
    setSelectedStores(prev =>
      prev.includes(storeId) ? prev.filter(s => s !== storeId) : [...prev, storeId]
    );
  };

  return (
    <div className="relative shrink-0">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
          selectedStores.length > 0 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
        }`}>
        <Filter size={12} />
        Store{selectedStores.length > 0 && ` (${selectedStores.length})`}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }} transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-56 bg-card rounded-xl border border-border shadow-lg z-20 overflow-hidden">
              {stores.map(store => {
                const name = storeOverrides[store.storeId] || store.displayName;
                const selected = selectedStores.includes(store.storeId);
                return (
                  <button key={store.storeId} onClick={() => toggle(store.storeId)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:bg-secondary/50 transition-colors border-b border-border last:border-0">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      selected ? 'bg-accent border-accent' : 'border-muted-foreground/30'
                    }`}>
                      {selected && <Check size={12} className="text-accent-foreground" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{store.storeId}</p>
                    </div>
                  </button>
                );
              })}
              {selectedStores.length > 0 && (
                <button onClick={() => setSelectedStores([])}
                  className="w-full text-center text-[11px] text-accent font-medium py-2 active:bg-secondary/50">
                  Clear filter
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreFilter;
