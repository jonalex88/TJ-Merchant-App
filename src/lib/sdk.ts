/**
 * Transpector Mock SDK
 * Complete mock API client for demo/testing purposes
 * Simulates the Transpector Backend API
 */

import { Transaction, Terminal, Store, Metrics } from '@/types';

// Types
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  error?: string;
}

export interface UserData {
  username: string;
  name: string;
  email: string;
  phone: string;
  tjAccountId: string;
}

export interface DashboardMetrics {
  totalSales: number;
  transactionCount: number;
  approvalRate: number;
  declinedCount: number;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  storeId?: string;
  outcome?: 'Approved' | 'Declined' | 'Pending';
  type?: 'Purchase' | 'Refund';
  limit?: number;
  offset?: number;
  lastId?: string; // For cursor-based pagination
}

export interface TerminalFilters {
  storeId?: string;
  status?: 'active' | 'recent' | 'dormant';
  limit?: number;
  offset?: number;
}

// Mock Data Store (simulates backend database)
class MockDataStore {
  private stores: Store[];
  private terminals: Terminal[];
  private transactions: Transaction[];
  private metrics: Metrics;
  private sessions: Map<string, { username: string; expiresAt: Date }>;
  private users: Map<string, { password: string; data: UserData }>;

  constructor() {
    this.stores = [
      { storeId: 'STR-00441', displayName: 'The Corner Shop', location: 'Cape Town', retailerId: 'RET-001' },
      { storeId: 'STR-00442', displayName: 'Harbour Point', location: 'V&A Waterfront', retailerId: 'RET-001' },
      { storeId: 'STR-00443', displayName: 'Stellenbosch Flagship', location: 'Stellenbosch', retailerId: 'RET-001' },
    ];

    const today = new Date();
    this.terminals = [
      { terminalId: 'TID-00101', storeId: 'STR-00443', lastUsed: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), status: 'dormant' },
      { terminalId: 'TID-00102', storeId: 'STR-00441', lastUsed: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), status: 'dormant' },
      { terminalId: 'TID-00103', storeId: 'STR-00442', lastUsed: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), status: 'dormant' },
      { terminalId: 'TID-00104', storeId: 'STR-00441', lastUsed: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), status: 'recent' },
      { terminalId: 'TID-00105', storeId: 'STR-00443', lastUsed: new Date(today.getTime() - 3 * 60 * 60 * 1000), status: 'active' },
      { terminalId: 'TID-00106', storeId: 'STR-00442', lastUsed: new Date(today.getTime() - 12 * 60 * 1000), status: 'active' },
    ];

    this.transactions = [
      { id: 'TXN-10001', storeId: 'STR-00441', terminalId: 'TID-00104', amount: 1234.56, currency: 'ZAR', type: 'Purchase', outcome: 'Approved', timestamp: '2024-01-15T09:45:00', cardScheme: 'Visa', maskedPan: '•••• 4521', authCode: 'A12345' },
      { id: 'TXN-10002', storeId: 'STR-00442', terminalId: 'TID-00106', amount: 89.00, currency: 'ZAR', type: 'Purchase', outcome: 'Declined', timestamp: '2024-01-15T10:12:00', cardScheme: 'Mastercard', maskedPan: '•••• 7832', authCode: '' },
      { id: 'TXN-10003', storeId: 'STR-00443', terminalId: 'TID-00105', amount: 450.00, currency: 'ZAR', type: 'Refund', outcome: 'Approved', timestamp: '2024-01-15T11:00:00', cardScheme: 'Visa', maskedPan: '•••• 3310', authCode: 'R67890' },
      { id: 'TXN-10004', storeId: 'STR-00441', terminalId: 'TID-00102', amount: 2100.00, currency: 'ZAR', type: 'Purchase', outcome: 'Approved', timestamp: '2024-01-15T11:30:00', cardScheme: 'Visa', maskedPan: '•••• 9901', authCode: 'A22334' },
      { id: 'TXN-10005', storeId: 'STR-00442', terminalId: 'TID-00103', amount: 55.50, currency: 'ZAR', type: 'Purchase', outcome: 'Approved', timestamp: '2024-01-15T12:00:00', cardScheme: 'Mastercard', maskedPan: '•••• 1122', authCode: 'A55667' },
      { id: 'TXN-10006', storeId: 'STR-00441', terminalId: 'TID-00104', amount: 780.00, currency: 'ZAR', type: 'Purchase', outcome: 'Approved', timestamp: '2024-01-15T12:30:00', cardScheme: 'Visa', maskedPan: '•••• 4521', authCode: 'A77889' },
      { id: 'TXN-10007', storeId: 'STR-00443', terminalId: 'TID-00101', amount: 3200.00, currency: 'ZAR', type: 'Purchase', outcome: 'Declined', timestamp: '2024-01-15T13:00:00', cardScheme: 'Amex', maskedPan: '•••• 0099', authCode: '' },
      { id: 'TXN-10008', storeId: 'STR-00442', terminalId: 'TID-00106', amount: 165.00, currency: 'ZAR', type: 'Refund', outcome: 'Approved', timestamp: '2024-01-15T13:15:00', cardScheme: 'Visa', maskedPan: '•••• 7832', authCode: 'R11223' },
      { id: 'TXN-10009', storeId: 'STR-00441', terminalId: 'TID-00102', amount: 920.00, currency: 'ZAR', type: 'Purchase', outcome: 'Approved', timestamp: '2024-01-15T14:00:00', cardScheme: 'Mastercard', maskedPan: '•••• 5566', authCode: 'A99001' },
      { id: 'TXN-10010', storeId: 'STR-00443', terminalId: 'TID-00105', amount: 42.00, currency: 'ZAR', type: 'Purchase', outcome: 'Pending', timestamp: '2024-01-15T14:30:00', cardScheme: 'Visa', maskedPan: '•••• 3310', authCode: '' },
    ];

    this.metrics = {
      totalSales: 84320.00,
      transactionCount: 247,
      approvalRate: 96.2,
      declinedCount: 9,
    };

    this.sessions = new Map();
    this.users = new Map([
      ['demo', { password: 'demo123', data: { username: 'demo', name: 'Jonathan Luies', email: 'jonathanl@switch.tj', phone: '+27 (0)21 555 0123', tjAccountId: 'TJ-4821-9471' } }],
      ['jonathan', { password: 'password123', data: { username: 'jonathan', name: 'Jonathan Doe', email: 'jonathan@transpector.co.za', phone: '+27 (0)82 123 4567', tjAccountId: 'TJ-5000-1234' } }],
      ['test', { password: 'test123', data: { username: 'test', name: 'Test User', email: 'test@transpector.co.za', phone: '+27 (0)73 999 8888', tjAccountId: 'TJ-0001-0001' } }],
    ]);
  }

  async simulateDelay(ms: number = 300): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  authenticate(username: string, password: string): AuthResponse {
    const user = this.users.get(username);
    
    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid credentials' };
    }

    const token = `token_${username}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
    this.sessions.set(token, { username, expiresAt });

    return { success: true, token, user: user.data };
  }

  getStores(): Store[] {
    return [...this.stores];
  }

  getTerminals(filters?: TerminalFilters): Terminal[] {
    let result = [...this.terminals];
    
    if (filters?.storeId) {
      result = result.filter(t => t.storeId === filters.storeId);
    }
    
    if (filters?.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Sort by lastUsed descending (most recent first)
    result.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  getTransactions(filters?: TransactionFilters): Transaction[] {
    let result = [...this.transactions];

    if (filters?.storeId) {
      result = result.filter(t => t.storeId === filters.storeId);
    }

    if (filters?.outcome) {
      result = result.filter(t => t.outcome === filters.outcome);
    }

    if (filters?.type) {
      result = result.filter(t => t.type === filters.type);
    }

    // Sort by timestamp descending (most recent first)
    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filters?.limit) {
      result = result.slice(0, filters.limit);
    } else if (filters?.offset) {
      result = result.slice(filters.offset);
    }

    return result;
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  updateTerminalLastUsed(terminalId: string, lastUsed: Date): void {
    const terminal = this.terminals.find(t => t.terminalId === terminalId);
    if (terminal) {
      terminal.lastUsed = lastUsed;
    }
  }
}

// API Client
export class TranspectorMockSDK {
  private store: MockDataStore;
  private currentToken: string | null = null;
  private currentUser: UserData | null = null;
  private baseDelay: number = 300; // Simulated network delay

  constructor(baseDelay: number = 300) {
    this.store = new MockDataStore();
    this.baseDelay = baseDelay;
  }

  // Auth Methods
  async login(username: string, password: string): Promise<AuthResponse> {
    await this.store.simulateDelay(this.baseDelay);
    
    const response = this.store.authenticate(username, password);
    
    if (response.success && response.token && response.user) {
      this.currentToken = response.token;
      this.currentUser = response.user;
    }
    
    return response;
  }

  async logout(): Promise<void> {
    await this.store.simulateDelay(100);
    this.currentToken = null;
    this.currentUser = null;
  }

  getCurrentUser(): UserData | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentToken !== null;
  }

  // User Profile
  async updateProfile(updates: Partial<UserData>): Promise<{ success: boolean; user?: UserData; error?: string }> {
    await this.store.simulateDelay(this.baseDelay);
    
    if (!this.currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    this.currentUser = { ...this.currentUser, ...updates };
    return { success: true, user: this.currentUser };
  }

  // Store Management
  async getStores(): Promise<Store[]> {
    await this.store.simulateDelay(this.baseDelay);
    return this.store.getStores();
  }

  // Dashboard
  async getDashboardMetrics(): Promise<Metrics> {
    await this.store.simulateDelay(this.baseDelay);
    return this.store.getMetrics();
  }

  async getSalesByStore(): Promise<Array<{ name: string; location: string; sales: number }>> {
    await this.store.simulateDelay(this.baseDelay);
    
    return [
      { name: 'The Corner Shop', location: 'Cape Town', sales: 34500 },
      { name: 'Harbour Point', location: 'V&A', sales: 28200 },
      { name: 'Stellenbosch', location: 'Flagship', sales: 21620 },
    ];
  }

  // Transactions
  async getTransactions(filters?: TransactionFilters): Promise<{ transactions: Transaction[]; hasMore: boolean }> {
    await this.store.simulateDelay(this.baseDelay);
    
    const transactions = this.store.getTransactions(filters);
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    
    return {
      transactions: transactions.slice(offset, offset + limit),
      hasMore: offset + limit < transactions.length,
    };
  }

  async getTransaction(id: string): Promise<{ transaction?: Transaction; error?: string }> {
    await this.store.simulateDelay(this.baseDelay);
    
    const transactions = this.store.getTransactions();
    const transaction = transactions.find(t => t.id === id);
    
    return transaction ? { transaction } : { error: 'Transaction not found' };
  }

  // Terminals
  async getTerminals(filters?: TerminalFilters): Promise<{ terminals: Terminal[]; hasMore: boolean }> {
    await this.store.simulateDelay(this.baseDelay);
    
    const terminals = this.store.getTerminals(filters);
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    
    return {
      terminals: terminals.slice(offset, offset + limit),
      hasMore: offset + limit < terminals.length,
    };
  }

  async getTerminal(id: string): Promise<{ terminal?: Terminal; error?: string }> {
    await this.store.simulateDelay(this.baseDelay);
    
    const terminals = this.store.getTerminals();
    const terminal = terminals.find(t => t.terminalId === id);
    
    return terminal ? { terminal } : { error: 'Terminal not found' };
  }

  async updateTerminalLastUsed(terminalId: string): Promise<{ success: boolean }> {
    await this.store.simulateDelay(this.baseDelay);
    
    this.store.updateTerminalLastUsed(terminalId, new Date());
    return { success: true };
  }

  // Demo Helper: Generate fake transaction
  generateMockTransaction(storeId: string, terminalId: string): Transaction {
    const outcomes: Array<'Approved' | 'Declined' | 'Pending'> = ['Approved', 'Declined', 'Pending'];
    const types: Array<'Purchase' | 'Refund'> = ['Purchase', 'Refund'];
    const schemes = ['Visa', 'Mastercard', 'Amex', 'DinersClub'];
    
    const id = `TXN-${Date.now()}`;
    const amount = Math.floor(Math.random() * 5000) + 50;
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const scheme = schemes[Math.floor(Math.random() * schemes.length)];
    const lastDigits = Math.floor(Math.random() * 9000) + 1000;
    
    return {
      id,
      storeId,
      terminalId,
      amount,
      currency: 'ZAR',
      type,
      outcome,
      timestamp: new Date().toISOString(),
      cardScheme: scheme,
      maskedPan: `•••• ${lastDigits}`,
      authCode: outcome === 'Approved' ? `A${Math.random().toString().slice(2, 8)}` : '',
    };
  }
}

// Create singleton instance
export const sdk = new TranspectorMockSDK();

export default TranspectorMockSDK;
