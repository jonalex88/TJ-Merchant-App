import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { stores } from '@/data/mockData';

interface SiteFilterDropdownProps {
  selectedStores: string[];
  onStoresChange: (storeIds: string[]) => void;
  storeOverrides: Record<string, string>;
}

const SiteFilterDropdown = ({ selectedStores, onStoresChange, storeOverrides }: SiteFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStore = (storeId: string) => {
    const newSelection = selectedStores.includes(storeId)
      ? selectedStores.filter(id => id !== storeId)
      : [...selectedStores, storeId];
    onStoresChange(newSelection);
  };

  const getStoreName = (storeId: string) => {
    if (storeOverrides[storeId]) return storeOverrides[storeId];
    return storeId;
  };

  return (
    <div ref={ref} className="relative w-full sm:w-60">
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-xl bg-secondary border border-border text-left text-sm font-medium flex items-center justify-between hover:bg-secondary/80 transition-colors active:scale-[0.97]">
        <span className="text-foreground">
          {selectedStores.length === 0 ? 'All Sites' : selectedStores.length === 1 ? getStoreName(selectedStores[0]) : `${selectedStores.length} Sites`}
        </span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-lg z-50">
            <div className="p-2 space-y-1">
              {/* All Sites option */}
              <button onClick={() => {
                onStoresChange([]);
                setIsOpen(false);
              }}
                className={`w-full px-3 py-2 rounded-lg text-sm text-left font-medium transition-colors flex items-center justify-between ${
                  selectedStores.length === 0 ? 'bg-accent/15 text-accent' : 'text-muted-foreground hover:bg-secondary'
                }`}>
                <span>All Sites</span>
                {selectedStores.length === 0 && <Check size={14} />}
              </button>

              {/* Site options */}
              {stores.map(store => (
                <button key={store.storeId} onClick={() => toggleStore(store.storeId)}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left font-medium transition-colors flex items-center justify-between ${
                    selectedStores.includes(store.storeId)
                      ? 'bg-accent/15 text-accent'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}>
                  <span>{getStoreName(store.storeId)}</span>
                  {selectedStores.includes(store.storeId) && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SiteFilterDropdown;
