export interface Transaction {
  id: string;
  storeId: string;
  terminalId: string;
  amount: number;
  currency: string;
  type: 'Purchase' | 'Refund';
  outcome: 'Approved' | 'Declined' | 'Pending';
  timestamp: string;
  cardScheme: string;
  maskedPan: string;
  authCode: string;
}

export interface Terminal {
  terminalId: string;
  storeId: string;
  lastUsed: Date;
  status: 'active' | 'recent' | 'dormant';
}

export interface Store {
  storeId: string;
  displayName: string;
  location?: string;
  retailerId: string;
}

export interface Metrics {
  totalSales: number;
  transactionCount: number;
  approvalRate: number;
  declinedCount: number;
}
