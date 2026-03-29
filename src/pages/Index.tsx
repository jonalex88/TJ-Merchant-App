import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CreditCard, Monitor, Settings } from 'lucide-react';
import SignInScreen from '@/screens/SignInScreen';
import SetupWizardScreen from '@/screens/SetupWizardScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import TransactionsScreen from '@/screens/TransactionsScreen';
import TerminalsScreen from '@/screens/TerminalsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import { stores } from '@/data/mockData';

const tabs = [
  { label: 'Dashboard', icon: Home },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Terminals', icon: Monitor },
  { label: 'Settings', icon: Settings },
];

interface UserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  tjAccountId: string;
}

const Index = () => {
  const [authState, setAuthState] = useState<'signin' | 'setup' | 'app'>('signin');
  const [activeTab, setActiveTab] = useState(0);
  const [storeOverrides, setStoreOverrides] = useState<Record<string, string>>({});
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    name: 'Sarah Mitchell',
    email: 'sarah@transpector.co.za',
    phone: '+27 (0)21 555 0123',
    tjAccountId: 'TJ-4821-9471',
  });
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Load persisted data on mount
  useEffect(() => {
    const rememberMe = localStorage.getItem('rememberMe');
    const savedUsername = localStorage.getItem('username');
    const savedStoresData = localStorage.getItem('selectedStores');
    const savedStoreNames = localStorage.getItem('storeOverrides');
    const setupComplete = localStorage.getItem('setupComplete');

    if (rememberMe && savedUsername && setupComplete) {
      setUserData(prev => ({ ...prev, username: savedUsername }));
      if (savedStoresData) {
        const stores = JSON.parse(savedStoresData);
        setSelectedStoreIds(stores);
      }
      if (savedStoreNames) {
        setStoreOverrides(JSON.parse(savedStoreNames));
      }
      setAuthState('app');
    }
  }, []);

  // Inactivity timeout
  useEffect(() => {
    if (authState !== 'app') return;

    const handleActivity = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      
      const timer = setTimeout(() => {
        setAuthState('signin');
        localStorage.removeItem('rememberMe');
      }, 10 * 60 * 1000); // 600 minutes (10 hours)
      
      setInactivityTimer(timer);
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('tap', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    handleActivity(); // Start timer

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('tap', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, [authState, inactivityTimer]);

  const handleSignIn = (username: string, rememberMe: boolean) => {
    setUserData(prev => ({ ...prev, username }));
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', username);
    }
    setAuthState('setup');
  };

  const handleSetupComplete = (storeIds: string[], storeNames: Record<string, string>, pinSet: boolean) => {
    setSelectedStoreIds(storeIds);
    setStoreOverrides(storeNames);
    localStorage.setItem('selectedStores', JSON.stringify(storeIds));
    localStorage.setItem('storeOverrides', JSON.stringify(storeNames));
    localStorage.setItem('setupComplete', 'true');
    if (pinSet) {
      localStorage.setItem('pinSet', 'true');
    }
    setAuthState('app');
  };

  const handleSignOut = () => {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('username');
    localStorage.removeItem('setupComplete');
    setAuthState('signin');
    setSelectedStoreIds([]);
    setStoreOverrides({});
  };

  if (authState === 'signin') {
    return (
      <MobileFrame>
        <SignInScreen onSignIn={handleSignIn} />
      </MobileFrame>
    );
  }

  if (authState === 'setup') {
    return (
      <MobileFrame>
        <SetupWizardScreen onComplete={handleSetupComplete} stores={stores} />
      </MobileFrame>
    );
  }

  const screens = [
    <DashboardScreen key="dash" storeOverrides={storeOverrides} onNavigate={setActiveTab} />,
    <TransactionsScreen key="txns" storeOverrides={storeOverrides} selectedStoreIds={selectedStoreIds} />,
    <TerminalsScreen key="terms" storeOverrides={storeOverrides} selectedStoreIds={selectedStoreIds} />,
    <SettingsScreen
      key="settings"
      storeOverrides={storeOverrides}
      setStoreOverrides={setStoreOverrides}
      selectedStoreIds={selectedStoreIds}
      setSelectedStoreIds={setSelectedStoreIds}
      userData={userData}
      setUserData={setUserData}
      onSignOut={handleSignOut}
    />,
  ];

  return (
    <MobileFrame>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto"
            >
              {screens[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <nav className="shrink-0 bg-card border-t border-border px-2 pb-1 pt-1">
          <div className="flex justify-around">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = i === activeTab;
              return (
                <button key={tab.label} onClick={() => setActiveTab(i)}
                  className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-colors relative active:scale-95"
                >
                  <Icon size={20} className={isActive ? 'text-accent' : 'text-muted-foreground'} />
                  <span className={`text-[10px] font-medium ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div layoutId="nav-dot" className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </MobileFrame>
  );
};

const MobileFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-muted flex items-center justify-center p-4">
    <div className="w-[390px] h-[844px] bg-background rounded-[40px] shadow-2xl overflow-hidden border-[6px] border-foreground/10 flex flex-col relative">
      {/* Status bar */}
      <div className="h-12 flex items-center justify-between px-8 shrink-0">
        <span className="text-xs font-semibold text-foreground">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-2.5 border border-foreground/60 rounded-sm relative">
            <div className="absolute inset-[1px] right-[2px] bg-foreground/60 rounded-[1px]" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
      {/* Home indicator */}
      <div className="h-5 flex items-center justify-center shrink-0">
        <div className="w-32 h-1 bg-foreground/20 rounded-full" />
      </div>
    </div>
  </div>
);

export default Index;
