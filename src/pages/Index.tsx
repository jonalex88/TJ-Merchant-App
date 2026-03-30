import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, CreditCard, Monitor, BarChart3, Settings } from 'lucide-react';
import SignInScreen from '@/screens/SignInScreen';
import SetupWizardScreen from '@/screens/SetupWizardScreen';
import DashboardScreen from '@/screens/DashboardScreen';
import TransactionsScreen from '@/screens/TransactionsScreen';
import TerminalsScreen from '@/screens/TerminalsScreen';
import AnalyticsScreen from '@/screens/AnalyticsScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import InboxButton from '@/components/InboxButton';
import { stores, mockMessages } from '@/data/mockData';

const tabs = [
  { label: 'Dashboard', icon: Home },
  { label: 'Transactions', icon: CreditCard },
  { label: 'Terminals', icon: Monitor },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

interface UserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  tjAccountId: string;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const Index = () => {
  const [authState, setAuthState] = useState<'signin' | 'setup' | 'app'>('signin');
  const [activeTab, setActiveTab] = useState(0);
  const [storeOverrides, setStoreOverrides] = useState<Record<string, string>>({});
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [userData, setUserData] = useState<UserData>({
    username: '',
    name: 'Jonathan Luies',
    email: 'jonathanl@switch.tj',
    phone: '+27 (0)21 555 0123',
    tjAccountId: 'TJ-4821-9471',
  });
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg));
  };

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

    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <SignInScreen onSignIn={handleSignIn} />
      </div>
    );
  }

  if (authState === 'setup') {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <SetupWizardScreen onComplete={handleSetupComplete} stores={stores} />
      </div>
    );
  }

  const screens = [
    <DashboardScreen key="dash" storeOverrides={storeOverrides} onNavigate={setActiveTab} userData={userData} />,
    <TransactionsScreen key="txns" storeOverrides={storeOverrides} selectedStoreIds={selectedStoreIds} />,
    <TerminalsScreen key="terms" storeOverrides={storeOverrides} selectedStoreIds={selectedStoreIds} />,
    <AnalyticsScreen key="analytics" storeOverrides={storeOverrides} selectedStoreIds={selectedStoreIds} />,
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
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Inbox Button */}
      <InboxButton messages={messages} onMarkAsRead={handleMarkAsRead} />

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {screens[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 py-3 shadow-2xl">
        <div className="flex justify-around max-w-full">
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
  );
};
export default Index;
