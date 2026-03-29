# Transpector Mock SDK - Integration Guide

The Mock SDK provides a complete simulated backend API for testing, demoing, and developing the Transpector Merchant Dashboard without requiring a real backend server.

## Quick Start

### 1. Import the SDK

```typescript
import { TranspectorMockSDK } from '@/lib/sdk';

// Create instance with default 300ms network delay simulation
const sdk = new TranspectorMockSDK();

// Or customize the simulated delay
const sdk = new TranspectorMockSDK(500); // 500ms delay
```

### 2. Common Demo Credentials

| Username | Password | TJ Account ID | Email |
|----------|----------|---------------|-------|
| `demo` | `demo123` | TJ-4821-9471 | sarah@transpector.co.za |
| `jonathan` | `password123` | TJ-5000-1234 | jonathan@transpector.co.za |
| `test` | `test123` | TJ-0001-0001 | test@transpector.co.za |

### 3. Test the Login Flow

```typescript
// Authenticate
const authResponse = await sdk.login('demo', 'demo123');

if (authResponse.success) {
  console.log('Logged in as:', authResponse.user.name);
  console.log('Token:', authResponse.token);
} else {
  console.log('Login failed:', authResponse.error);
}

// Check authentication status
if (sdk.isAuthenticated()) {
  const user = sdk.getCurrentUser();
  console.log('Current user:', user);
}

// Logout
await sdk.logout();
```

## API Methods Reference

### Authentication

#### `login(username: string, password: string): Promise<AuthResponse>`
Authenticates user with username/password.

```typescript
const response = await sdk.login('demo', 'demo123');
// Returns: { success: true, token: "...", user: {...} }
```

#### `logout(): Promise<void>`
Clears authentication state.

#### `isAuthenticated(): boolean`
Returns current auth status (synchronous).

#### `getCurrentUser(): UserData | null`
Returns currently logged-in user data or null.

---

### User Profile

#### `updateProfile(updates: Partial<UserData>): Promise<...>`
Updates current user profile.

```typescript
const result = await sdk.updateProfile({
  name: 'New Name',
  email: 'newemail@example.com',
  phone: '+27 (0)21 555 0000'
});

if (result.success) {
  console.log('Updated user:', result.user);
}
```

---

### Stores

#### `getStores(): Promise<Store[]>`
Retrieves all stores for the merchant.

```typescript
const stores = await sdk.getStores();
// Returns array of 3 mock stores with ids, names, locations
```

---

### Dashboard

#### `getDashboardMetrics(): Promise<Metrics>`
Gets KPI metrics (sales, transaction count, approval rate, declined).

```typescript
const metrics = await sdk.getDashboardMetrics();
console.log('Total Sales:', metrics.totalSales);
console.log('Approval Rate:', metrics.approvalRate + '%');
```

#### `getSalesByStore(): Promise<Array<{name, location, sales}>>`
Gets sales breakdown by store.

```typescript
const salesByStore = await sdk.getSalesByStore();
// Returns array with store names and sales amounts
```

---

### Transactions

#### `getTransactions(filters?: TransactionFilters): Promise<{transactions, hasMore}>`
Retrieves transactions with optional filtering and pagination.

```typescript
// Get all transactions
const result = await sdk.getTransactions();

// Filter by store
const storeResult = await sdk.getTransactions({
  storeId: 'STR-00441',
  limit: 20,
  offset: 0
});

// Filter by outcome
const approvedResult = await sdk.getTransactions({
  outcome: 'Approved',
  limit: 10
});

// Filter by type
const refundsResult = await sdk.getTransactions({
  type: 'Refund'
});

// Combination filters
const combinedResult = await sdk.getTransactions({
  storeId: 'STR-00442',
  outcome: 'Declined',
  type: 'Purchase',
  limit: 25,
  offset: 0
});
```

**TransactionFilters Interface:**
```typescript
{
  startDate?: Date;           // Filter from date (optional)
  endDate?: Date;             // Filter to date (optional)
  storeId?: string;           // Filter by store ID
  outcome?: 'Approved' | 'Declined' | 'Pending';
  type?: 'Purchase' | 'Refund';
  limit?: number;             // Default: 20
  offset?: number;            // For pagination
  lastId?: string;            // For cursor-based pagination (future)
}
```

#### `getTransaction(id: string): Promise<{transaction?, error?}>`
Gets a single transaction by ID.

```typescript
const result = await sdk.getTransaction('TXN-10001');
if (result.transaction) {
  console.log('Transaction:', result.transaction);
} else {
  console.log('Error:', result.error);
}
```

---

### Terminals

#### `getTerminals(filters?: TerminalFilters): Promise<{terminals, hasMore}>`
Retrieves terminals with optional filtering.

```typescript
// Get all terminals
const result = await sdk.getTerminals();

// Filter by store
const storeTerminals = await sdk.getTerminals({
  storeId: 'STR-00441'
});

// Filter by status
const activeTerminals = await sdk.getTerminals({
  status: 'active'
});

// With pagination
const paginatedResult = await sdk.getTerminals({
  limit: 10,
  offset: 0
});

// Combined filters
const filteredResult = await sdk.getTerminals({
  storeId: 'STR-00443',
  status: 'recent',
  limit: 5
});
```

**TerminalFilters Interface:**
```typescript
{
  storeId?: string;           // Filter by store ID
  status?: 'active' | 'recent' | 'dormant';
  limit?: number;             // Default: 50
  offset?: number;            // For pagination
}
```

#### `getTerminal(id: string): Promise<{terminal?, error?}>`
Gets a single terminal by ID.

```typescript
const result = await sdk.getTerminal('TID-00105');
if (result.terminal) {
  console.log('Terminal:', result.terminal);
  console.log('Status:', result.terminal.status);
  console.log('Last Used:', result.terminal.lastUsed);
}
```

#### `updateTerminalLastUsed(terminalId: string): Promise<{success}>`
Updates a terminal's last used timestamp to current time.

```typescript
await sdk.updateTerminalLastUsed('TID-00105');
// Terminal's lastUsed is now updated to current date/time
```

---

### Demo Utilities

#### `generateMockTransaction(storeId: string, terminalId: string): Transaction`
Generates a random transaction (useful for testing/demoing).

```typescript
// Generate random transaction for demo
const tx = sdk.generateMockTransaction('STR-00441', 'TID-00104');
console.log(`Generated: ${tx.id} - ${tx.amount} ZAR - ${tx.outcome}`);

// Creates transactions with realistic random data:
// - Random amount between 50-5050 ZAR
// - Random card scheme (Visa, Mastercard, Amex, DinersClub)
// - Random outcome (Approved, Declined, Pending)
// - Current timestamp
```

---

## Integration Example: Update SignInScreen

```typescript
import { TranspectorMockSDK } from '@/lib/sdk';

const sdk = new TranspectorMockSDK();

export function SignInScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await sdk.login(username, password);
      
      if (response.success) {
        // Navigate to app
        console.log('Welcome,', response.user?.name);
        // Update app state with user data
      } else {
        setError(response.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... form JSX
  );
}
```

## Integration Example: Update DashboardScreen

```typescript
import { TranspectorMockSDK } from '@/lib/sdk';
import { useEffect, useState } from 'react';

const sdk = new TranspectorMockSDK();

export function DashboardScreen() {
  const [metrics, setMetrics] = useState(null);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsData, salesData] = await Promise.all([
          sdk.getDashboardMetrics(),
          sdk.getSalesByStore()
        ]);
        
        setMetrics(metricsData);
        setSales(salesData);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Sales: {metrics?.totalSales} ZAR</h2>
      <p>Approval Rate: {metrics?.approvalRate}%</p>
      {/* Render sales chart with data */}
    </div>
  );
}
```

## Integration Example: Update TransactionsScreen

```typescript
import { TranspectorMockSDK } from '@/lib/sdk';
import { useEffect, useState } from 'react';

const sdk = new TranspectorMockSDK();

export function TransactionsScreen({ selectedStoreIds }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      
      const filters = {};
      
      // Apply outcome filter
      if (filter !== 'All') {
        filters.outcome = filter;
      }
      
      // Apply store filter (load all, filter client-side, or loop through stores)
      const results = await Promise.all(
        selectedStoreIds.map(storeId =>
          sdk.getTransactions({ ...filters, storeId, limit: 100 })
        )
      );
      
      const allTransactions = results.flatMap(r => r.transactions);
      setTransactions(allTransactions);
      setLoading(false);
    }

    loadTransactions();
  }, [selectedStoreIds, filter]);

  return (
    // ... render transactions list
  );
}
```

## Integration Example: Update TerminalsScreen

```typescript
import { TranspectorMockSDK } from '@/lib/sdk';
import { useEffect, useState } from 'react';

const sdk = new TranspectorMockSDK();

export function TerminalsScreen({ selectedStoreIds }) {
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTerminals() {
      setLoading(true);
      
      // Load terminals for all selected stores
      const results = await Promise.all(
        selectedStoreIds.map(storeId =>
          sdk.getTerminals({ storeId, limit: 100 })
        )
      );
      
      const allTerminals = results.flatMap(r => r.terminals);
      setTerminals(allTerminals);
      setLoading(false);
    }

    loadTerminals();
  }, [selectedStoreIds]);

  return (
    // ... render terminals list
  );
}
```

## Mock Data Included

The SDK comes pre-loaded with:

**Stores (3):**
- STR-00441: The Corner Shop (Cape Town)
- STR-00442: Harbour Point (V&A Waterfront)
- STR-00443: Stellenbosch Flagship (Stellenbosch)

**Terminals (6):**
- TID-00101 through TID-00106
- Mix of active, recent, and dormant statuses
- Varied last-used timestamps

**Transactions (10):**
- Mix of Approved, Declined, and Pending outcomes
- Mix of Purchase and Refund types
- Various card schemes (Visa, Mastercard, Amex)
- Realistic amounts (50-5000 ZAR)

**Users (3):**
- demo / demo123
- jonathan / password123
- test / test123

## Network Delay Simulation

The SDK simulates network latency to make the demo feel realistic:

```typescript
// Default 300ms delay
const sdk = new TranspectorMockSDK();

// Custom 500ms delay for slower network testing
const slowSdk = new TranspectorMockSDK(500);

// No delay (instant responses)
const instantSdk = new TranspectorMockSDK(0);
```

## Switching to Real API

When ready to connect to the real backend:

1. Create a new class `TranspectorAPI` with the same interface
2. Replace SDK method implementations with actual HTTP calls
3. Swap imports:
   ```typescript
   // Before
   import { TranspectorMockSDK } from '@/lib/sdk';
   const sdk = new TranspectorMockSDK();
   
   // After
   import { TranspectorAPI } from '@/lib/api';
   const sdk = new TranspectorAPI();
   ```

Because both classes have identical method signatures, no other code needs to change!

---

## Testing Checklist

Use this when demoing to stakeholders:

- [ ] Login with demo credentials
- [ ] Verify user profile displays correctly
- [ ] Navigate to Dashboard - verify metrics load
- [ ] Check "Sales by Store" chart
- [ ] Go to Transactions - verify list loads
- [ ] Filter transactions by outcome (Approved/Declined)
- [ ] Search for transaction by ID or card scheme
- [ ] Go to Terminals - verify list loads
- [ ] Check terminal status indicators (active/recent/dormant)
- [ ] Go to Settings - verify profile edit works
- [ ] Update profile and verify changes persist
- [ ] Handle offline - test offline banner
- [ ] Logout and verify return to login screen

---

## Troubleshooting

**Issue:** "Module not found: @/lib/sdk"
- **Solution:** Ensure the SDK file is at `src/lib/sdk.ts` and your tsconfig has path aliases configured

**Issue:** TypeScript errors about types
- **Solution:** Ensure types are exported from `src/types/index.ts`

**Issue:** Responses seem too fast
- **Solution:** Increase SDK delay: `new TranspectorMockSDK(1000)` for more realistic feel

**Issue:** Want to test with different data
- **Solution:** Use `sdk.generateMockTransaction()` to add new test transactions
