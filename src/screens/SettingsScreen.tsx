import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, ChevronRight, LogOut, Moon, Bell, Lock, HelpCircle, FileText, Key, RefreshCw, User as UserIcon, Edit3 } from 'lucide-react';
import { stores } from '@/data/mockData';
import { toast } from 'sonner';
import NotificationsScreen from '@/screens/NotificationsScreen';
import ProfileScreen from '@/screens/ProfileScreen';

interface SettingsScreenProps {
  storeOverrides: Record<string, string>;
  setStoreOverrides: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedStoreIds: string[];
  setSelectedStoreIds: React.Dispatch<React.SetStateAction<string[]>>;
  userData: {
    username: string;
    name: string;
    email: string;
    phone: string;
    tjAccountId: string;
  };
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  onSignOut: () => void;
}

const SettingsScreen = ({
  storeOverrides,
  setStoreOverrides,
  selectedStoreIds,
  setSelectedStoreIds,
  userData,
  setUserData,
  onSignOut,
}: SettingsScreenProps) => {
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const [showDateRangeEditor, setShowDateRangeEditor] = useState(false);
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [defaultDateRange, setDefaultDateRange] = useState('This Week');
  const [showModifyNames, setShowModifyNames] = useState(false);

  const handleDarkMode = (enabled: boolean) => {
    setDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
  }

  if (showProfile) {
    return (
      <ProfileScreen
        userData={userData}
        onSave={(updated) => {
          setUserData(prev => ({ ...prev, ...updated }));
          setShowProfile(false);
          toast.success('Profile updated ✓');
        }}
        onBack={() => setShowProfile(false)}
      />
    );
  }

  if (showStoreManager) {
    return (
      <StoreManagerScreen
        stores={stores}
        selectedStoreIds={selectedStoreIds}
        storeNameOverrides={storeOverrides}
        onSelectStore={(storeId) => {
          setSelectedStoreIds(prev =>
            prev.includes(storeId) ? prev.filter(id => id !== storeId) : [...prev, storeId]
          );
        }}
        onRenameStore={(storeId, name) => {
          setStoreOverrides(prev => ({ ...prev, [storeId]: name }));
        }}
        onBack={() => setShowStoreManager(false)}
      />
    );
  }

  if (showModifyNames) {
    return (
      <ModifyStoreNamesScreen
        stores={stores}
        selectedStoreIds={selectedStoreIds}
        storeNameOverrides={storeOverrides}
        onRenameStore={(storeId, name) => {
          setStoreOverrides(prev => ({ ...prev, [storeId]: name }));
        }}
        onBack={() => setShowModifyNames(false)}
      />
    );
  }

  const openEdit = (storeId: string) => {
    const current = storeOverrides[storeId] || stores.find(s => s.storeId === storeId)?.displayName || '';
    setEditName(current);
    setEditingStore(storeId);
  };

  const saveEdit = () => {
    if (editingStore && editName.trim()) {
      setStoreOverrides(prev => ({ ...prev, [editingStore]: editName.trim() }));
      toast.success('Store renamed ✓');
    }
    setEditingStore(null);
  };

  return (
    <div className="px-4 pt-4 pb-6 overflow-y-auto h-full relative">
      {/* Profile */}
      <motion.button
        onClick={() => setShowProfile(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex items-center gap-3 bg-card rounded-xl p-4 shadow-sm border border-border mb-5 active:scale-[0.98] transition-transform text-left"
      >
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{userData.name}</p>
          <p className="text-xs text-muted-foreground">{userData.email}</p>
        </div>
        <Edit3 size={14} className="text-muted-foreground" />
      </motion.button>

      {/* Your Sites */}
      <Section title="YOUR SITES">
        <button
          onClick={() => setShowStoreManager(true)}
          className="w-full flex items-center justify-between py-3 active:bg-secondary/50 transition-colors border-b border-border"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Manage Sites</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedStoreIds.length} site{selectedStoreIds.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
        <button
          onClick={() => setShowModifyNames(true)}
          className="w-full flex items-center justify-between py-3 active:bg-secondary/50 transition-colors"
        >
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Modify Site Names</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Object.keys(storeOverrides).length} name{Object.keys(storeOverrides).length !== 1 ? 's' : ''} set
            </p>
          </div>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
      </Section>

      {/* App Preferences */}
      <Section title="APP PREFERENCES">
        <ToggleRow icon={<Moon size={16} />} label="Dark Mode" value={darkMode} onChange={handleDarkMode} />
        <button onClick={() => setShowNotifications(true)} className="flex items-center gap-3 py-3 border-b border-border last:border-0 w-full active:bg-secondary/50 transition-colors">
          <span className="text-muted-foreground"><Bell size={16} /></span>
          <span className="text-sm text-foreground flex-1 text-left">Notifications</span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
        <SyncFrequencyRow />
        <button onClick={() => setShowDateRangeEditor(true)} className="flex items-center gap-3 py-3 w-full active:bg-secondary/50 transition-colors">
          <span className="text-muted-foreground"><RefreshCw size={16} /></span>
          <span className="text-sm text-foreground flex-1 text-left">Default Date Range</span>
          <span className="text-xs text-accent font-medium">{defaultDateRange}</span>
          <ChevronRight size={14} className="text-muted-foreground" />
        </button>
      </Section>

      {/* Security */}
      <Section title="SECURITY">
        <ToggleRow icon={<Lock size={16} />} label="Biometric Login" value={biometric} onChange={setBiometric} />
        <NavRow icon={<Key size={16} />} label="Change PIN" />
      </Section>

      {/* Account */}
      <Section title="ACCOUNT">
        <NavRow icon={<HelpCircle size={16} />} label="Help & Support" />
        <NavRow icon={<FileText size={16} />} label="Privacy Policy" />
        <button onClick={onSignOut} className="flex items-center gap-3 py-3 w-full active:bg-secondary/50 transition-colors">
          <LogOut size={16} className="text-destructive" />
          <span className="text-sm text-destructive font-medium">Sign Out</span>
        </button>
      </Section>

      {/* Edit Bottom Sheet */}
      <AnimatePresence>
        {editingStore && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40" onClick={() => setEditingStore(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 p-5 shadow-2xl max-w-[430px] mx-auto">
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-3">Edit Site Name</h3>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 mb-4"
                placeholder="Enter site name (optional)"
                autoFocus />
              <button onClick={saveEdit}
                className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform">
                Save
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date Range Editor Bottom Sheet */}
      <AnimatePresence>
        {showDateRangeEditor && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40" onClick={() => setShowDateRangeEditor(false)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 p-5 shadow-2xl max-w-[430px] mx-auto">
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-4">Default Date Range</h3>
              <div className="space-y-2 mb-6">
                {['This Week', 'This Month', 'Last 3 Months', 'Last 6 Months', 'Last Year'].map(range => (
                  <button key={range}
                    onClick={() => {
                      setDefaultDateRange(range);
                      setShowDateRangeEditor(false);
                      toast.success(`Default range set to ${range} ✓`);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      defaultDateRange === range
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-foreground active:bg-muted'
                    }`}>
                    {range}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StoreManagerScreen = ({
  stores,
  selectedStoreIds,
  storeNameOverrides,
  onSelectStore,
  onRenameStore,
  onBack,
}: {
  stores: any[];
  selectedStoreIds: string[];
  storeNameOverrides: Record<string, string>;
  onSelectStore: (storeId: string) => void;
  onRenameStore: (storeId: string, name: string) => void;
  onBack: () => void;
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-4 border-b border-border flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-1.5 rounded-lg active:bg-secondary transition-colors">
          <ChevronRight size={20} className="text-foreground rotate-180" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Select Sites</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {stores.map(store => (
          <button
            key={store.storeId}
            onClick={() => onSelectStore(store.storeId)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              selectedStoreIds.includes(store.storeId)
                ? 'bg-accent/10 border-accent'
                : 'bg-card border-border'
            } active:scale-[0.98]`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                selectedStoreIds.includes(store.storeId)
                  ? 'bg-accent border-accent'
                  : 'border-muted-foreground/30'
              }`}
            >
              {selectedStoreIds.includes(store.storeId) && (
                <div className="w-1.5 h-1.5 bg-accent-foreground rounded-sm" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{storeNameOverrides[store.storeId] || store.displayName}</p>
              <p className="text-xs text-muted-foreground">{store.storeId}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
    <p className="text-[10px] font-semibold text-muted-foreground tracking-wider mb-2">{title}</p>
    <div className="bg-card rounded-xl border border-border shadow-sm px-4">{children}</div>
  </motion.div>
);

const ToggleRow = ({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-sm text-foreground flex-1">{label}</span>
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative ${value ? 'bg-accent' : 'bg-muted'}`}>
      <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm"
        animate={{ left: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
    </button>
  </div>
);

const NavRow = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-3 py-3 border-b border-border last:border-0 w-full active:bg-secondary/50 transition-colors">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-sm text-foreground flex-1 text-left">{label}</span>
    <ChevronRight size={14} className="text-muted-foreground" />
  </button>
);

const syncOptions = ['5 min', '1 hour', '1 day', 'Never'] as const;

const SyncFrequencyRow = () => {
  const [value, setValue] = useState(1);

  return (
    <div className="py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-muted-foreground"><RefreshCw size={16} /></span>
        <span className="text-sm text-foreground flex-1">Sync Frequency</span>
        <span className="text-xs font-medium text-accent">{syncOptions[value]}</span>
      </div>
      <div className="px-1">
        <input
          type="range"
          min={0}
          max={3}
          step={1}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card"
        />
        <div className="flex justify-between mt-0.5">
          {syncOptions.map(opt => (
            <span key={opt} className="text-[9px] text-muted-foreground">{opt}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ModifyStoreNamesScreen = ({
  stores,
  selectedStoreIds,
  storeNameOverrides,
  onRenameStore,
  onBack,
}: {
  stores: any[];
  selectedStoreIds: string[];
  storeNameOverrides: Record<string, string>;
  onRenameStore: (storeId: string, name: string) => void;
  onBack: () => void;
}) => {
  const [editingStore, setEditingStore] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const openEdit = (storeId: string) => {
    const current = storeNameOverrides[storeId] || '';
    setEditName(current);
    setEditingStore(storeId);
  };

  const saveEdit = () => {
    if (editingStore && editName.trim()) {
      onRenameStore(editingStore, editName.trim());
      toast.success('Site name updated ✓');
    }
    setEditingStore(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-4 border-b border-border flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-1.5 rounded-lg active:bg-secondary transition-colors">
          <ChevronRight size={20} className="text-foreground rotate-180" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Modify Site Names</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {selectedStoreIds.map(storeId => {
          const store = stores.find(s => s.storeId === storeId);
          if (!store) return null;
          const displayName = storeNameOverrides[storeId] || '';
          
          return (
            <div key={storeId} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{displayName || '(No name set)'}</p>
                <p className="text-xs text-muted-foreground font-mono">{storeId}</p>
              </div>
              <button onClick={() => openEdit(storeId)} className="p-2 rounded-lg active:bg-secondary transition-colors">
                <Edit3 size={16} className="text-accent" />
              </button>
            </div>
          );
        })}
        {selectedStoreIds.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">No sites selected. Add sites from Manage Sites.</p>
        )}
      </div>

      {/* Edit Bottom Sheet */}
      <AnimatePresence>
        {editingStore && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40" onClick={() => setEditingStore(null)} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 p-5 shadow-2xl max-w-[430px] mx-auto">
              <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-3">Edit Site Name</h3>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 mb-4"
                placeholder="Enter site name (optional)"
                autoFocus />
              <button onClick={saveEdit}
                className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform">
                Save
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsScreen;
