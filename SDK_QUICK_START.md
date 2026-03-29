# Mock SDK Quick Setup

## Option 1: Start Using SDK Immediately (No Code Changes Required)

The SDK is ready to use! You can test it in your browser console:

```javascript
// In your browser console:
const sdk = new TranspectorMockSDK();

// Try logging in
sdk.login('demo', 'demo123').then(response => {
  console.log('Logged in:', response.user.name);
  
  // Get dashboard metrics
  sdk.getDashboardMetrics().then(metrics => {
    console.log('Total Sales:', metrics.totalSales);
  });
  
  // Get terminals
  sdk.getTerminals({ storeId: 'STR-00441' }).then(result => {
    console.log('Terminals:', result.terminals);
  });
  
  // Get transactions
  sdk.getTransactions({ limit: 5 }).then(result => {
    console.log('Recent transactions:', result.transactions);
  });
});
```

## Option 2: Integrate into React Components

Create a new file `src/hooks/useSdk.ts`:

```typescript
import { useEffect, useState } from 'react';
import TranspectorMockSDK from '@/lib/sdk';

// Create SDK instance (singleton pattern)
let sdkInstance: TranspectorMockSDK | null = null;

export function getSdk(): TranspectorMockSDK {
  if (!sdkInstance) {
    sdkInstance = new TranspectorMockSDK(300); // 300ms network delay
  }
  return sdkInstance;
}

// Hook to check if user is authenticated
export function useAuth() {
  const [user, setUser] = useState(getSdk().getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(getSdk().isAuthenticated());

  const login = async (username: string, password: string) => {
    const response = await getSdk().login(username, password);
    if (response.success) {
      setUser(response.user!);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const logout = async () => {
    await getSdk().logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return { user, isAuthenticated, login, logout };
}

// Hook to load stores
export function useStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSdk().getStores().then(data => {
      setStores(data);
      setLoading(false);
    });
  }, []);

  return { stores, loading };
}

// Hook to load dashboard metrics
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSdk().getDashboardMetrics().then(data => {
      setMetrics(data);
      setLoading(false);
    });
  }, []);

  return { metrics, loading };
}

// Hook to load transactions
export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSdk().getTransactions(filters).then(result => {
      setTransactions(result.transactions);
      setHasMore(result.hasMore);
      setLoading(false);
    });
  }, [JSON.stringify(filters)]);

  return { transactions, hasMore, loading };
}

// Hook to load terminals
export function useTerminals(filters = {}) {
  const [terminals, setTerminals] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSdk().getTerminals(filters).then(result => {
      setTerminals(result.terminals);
      setHasMore(result.hasMore);
      setLoading(false);
    });
  }, [JSON.stringify(filters)]);

  return { terminals, hasMore, loading };
}

export default getSdk;
```

Then use the hooks in your components:

```typescript
import { useAuth, useDashboardMetrics, useTransactions } from '@/hooks/useSdk';

export function SignInScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo123');

  const handleSignIn = async () => {
    const result = await login(username, password);
    if (result.success) {
      // Navigate to app
    }
  };

  return (
    <div>
      <input value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}

export function DashboardScreen() {
  const { metrics, loading } = useDashboardMetrics();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Sales: {metrics?.totalSales} ZAR</h2>
      <p>Transactions: {metrics?.transactionCount}</p>
      <p>Approval Rate: {metrics?.approvalRate}%</p>
    </div>
  );
}

export function TransactionsScreen({ selectedStoreIds }) {
  const [filters, setFilters] = useState({ limit: 50 });
  const { transactions, loading } = useTransactions(filters);

  return (
    <div>
      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          {transactions.map(tx => (
            <div key={tx.id}>
              {tx.id} - {tx.amount} ZAR - {tx.outcome}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Option 3: Global SDK Service

Create `src/services/api.ts`:

```typescript
import TranspectorMockSDK from '@/lib/sdk';

// Create and export singleton instance
export const api = new TranspectorMockSDK();

// Export all types
export * from '@/lib/sdk';
```

Then import and use everywhere:

```typescript
import { api } from '@/services/api';

// In any component or function
const user = api.getCurrentUser();
const stores = await api.getStores();
const metrics = await api.getDashboardMetrics();
```

## Demo Credentials

Quick reference for testing:

```
Username: demo
Password: demo123
Account: Sarah Mitchell (TJ-4821-9471)

OR

Username: jonathan
Password: password123
Account: Jonathan Doe (TJ-5000-1234)

OR

Username: test
Password: test123
Account: Test User (TJ-0001-0001)
```

## Demo Script for Stakeholders

```typescript
// Script to showcase app features
async function demoApp() {
  console.log('🎬 Starting Transpector Demo...\n');

  // 1. Login
  console.log('📱 Step 1: User logs in');
  const auth = await api.login('demo', 'demo123');
  console.log(`✅ Welcome, ${auth.user.name}!`);

  // 2. Dashboard
  console.log('\n📊 Step 2: Dashboard loads');
  const metrics = await api.getDashboardMetrics();
  console.log(`✅ Total Sales: ${metrics.totalSales} ZAR`);
  console.log(`✅ Transactions: ${metrics.transactionCount}`);
  console.log(`✅ Approval Rate: ${metrics.approvalRate}%`);

  // 3. Store Selection
  console.log('\n🏪 Step 3: User selects stores');
  const stores = await api.getStores();
  console.log(`✅ Available stores: ${stores.map(s => s.displayName).join(', ')}`);

  // 4. Transactions
  console.log('\n💳 Step 4: View transactions');
  const txResult = await api.getTransactions({ limit: 3 });
  txResult.transactions.forEach(tx => {
    console.log(`✅ ${tx.id}: ${tx.amount} ZAR - ${tx.outcome}`);
  });

  // 5. Terminals
  console.log('\n🖨️ Step 5: Monitor terminals');
  const termResult = await api.getTerminals();
  termResult.terminals.forEach(term => {
    console.log(`✅ ${term.terminalId}: ${term.status.toUpperCase()}`);
  });

  // 6. Profile Edit
  console.log('\n👤 Step 6: Edit profile');
  const profileResult = await api.updateProfile({
    name: 'Sarah Mitchell (Updated)',
  });
  console.log(`✅ Profile updated: ${profileResult.user.name}`);

  // 7. Logout
  console.log('\n🚪 Step 7: User logs out');
  await api.logout();
  console.log('✅ Session ended');

  console.log('\n✨ Demo complete!\n');
}

// Run demo
demoApp();
```

Copy the `demoApp()` script above and paste it into your browser console to run through all features!

## Performance Notes

- ✅ **Fast:** All responses are instant (simulated network delay is 300ms by default)
- ✅ **No Server:** Runs entirely in browser
- ✅ **Persistent Session:** User session persists until logout
- ✅ **Realistic Data:** 3 stores, 6 terminals, 10 transactions pre-populated
- ✅ **Expandable:** Use `generateMockTransaction()` to create test data

## Next Steps for Real API

When you're ready to connect to your real backend:

1. Create a new `TranspectorAPI` class with identical methods
2. Replace HTTP calls with actual backend endpoints
3. Update the SDK import - everything else stays the same!

```typescript
// Just swap this import
import { TranspectorAPI as SDK } from '@/lib/api'; // Real API
// import { TranspectorMockSDK as SDK } from '@/lib/sdk'; // Mock (for dev)

const api = new SDK();
```

No other code changes needed - both have the same interface! 🎉
