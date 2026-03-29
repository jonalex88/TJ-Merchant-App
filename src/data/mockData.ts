import { Transaction, Terminal, Store, Metrics } from '@/types';

// Helper to get terminal status based on last used date
const getTerminalStatus = (lastUsedDate: Date): 'active' | 'recent' | 'dormant' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastUsed = new Date(lastUsedDate);
  lastUsed.setHours(0, 0, 0, 0);
  
  if (lastUsed.getTime() === today.getTime()) {
    return 'active';
  } else if (lastUsed.getTime() === yesterday.getTime()) {
    return 'recent';
  } else {
    return 'dormant';
  }
};

export const stores: Store[] = [
  { storeId: 'STR-00441', displayName: '', location: 'Cape Town', retailerId: 'RET-001' },
  { storeId: 'STR-00442', displayName: '', location: 'V&A Waterfront', retailerId: 'RET-001' },
  { storeId: 'STR-00443', displayName: '', location: '', retailerId: 'RET-001' },
];

export const terminals: Terminal[] = [
  { terminalId: 'TID-00101', storeId: 'STR-00443', lastUsed: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), status: 'dormant' },
  { terminalId: 'TID-00102', storeId: 'STR-00441', lastUsed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), status: 'dormant' },
  { terminalId: 'TID-00103', storeId: 'STR-00442', lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), status: 'dormant' },
  { terminalId: 'TID-00104', storeId: 'STR-00441', lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), status: 'recent' },
  { terminalId: 'TID-00105', storeId: 'STR-00443', lastUsed: new Date(Date.now() - 3 * 60 * 60 * 1000), status: 'active' },
  { terminalId: 'TID-00106', storeId: 'STR-00442', lastUsed: new Date(Date.now() - 12 * 60 * 1000), status: 'active' },
].map(t => ({ ...t, status: getTerminalStatus(t.lastUsed) }));

export const transactions: Transaction[] = [
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

export const metrics: Metrics = {
  totalSales: 84320.00,
  transactionCount: 247,
  approvalRate: 96.2,
  declinedCount: 9,
};

export const salesByStore = [
  { name: 'The Corner Shop', location: 'Cape Town', sales: 34500 },
  { name: 'Harbour Point', location: 'V&A', sales: 28200 },
  { name: 'Stellenbosch', location: 'Flagship', sales: 21620 },
];

export const getStoreName = (storeId: string, storeOverrides: Record<string, string>): string => {
  if (storeOverrides[storeId]) return storeOverrides[storeId];
  const store = stores.find(s => s.storeId === storeId);
  return store?.displayName || storeId;
};

export const formatZAR = (amount: number): string => {
  return 'R ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const mockMessages = [
  {
    id: 'msg-1',
    subject: 'Welcome to Transpector!',
    content: 'Your merchant account is now active. You can start accepting payments immediately. Visit our help center for setup guides.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
  },
  {
    id: 'msg-2',
    subject: 'Store STR-00441 Alert',
    content: 'No transactions recorded in the last 24 hours. Check if the terminal is online and functional.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
  },
  {
    id: 'msg-3',
    subject: 'Payment Approved Rate Update',
    content: 'Your approval rate improved to 96.5% this week! Continue providing excellent payment experiences to your customers.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
  },
  {
    id: 'msg-4',
    subject: 'Security Notification',
    content: 'We detected a new sign-in from a different location. If this wasn\'t you, please update your password immediately.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true,
  },
  {
    id: 'msg-5',
    subject: 'Settlement Report Ready',
    content: 'Your daily settlement report is ready for download. Total settled: R 145,230.00',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: false,
  },
];
