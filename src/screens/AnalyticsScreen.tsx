import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { transactions } from '@/data/mockData';

interface DeclineReason {
  code: string;
  description: string;
  percentage: number;
  count: number;
}

const ISO_8583_CODES: Record<string, string> = {
  '05': 'Do Not Honor',
  '12': 'Invalid Transaction',
  '13': 'Invalid Amount',
  '14': 'Invalid Card Number',
  '51': 'Insufficient Funds',
  '54': 'Expired Card',
  '55': 'Incorrect PIN',
  '61': 'Amount Exceeds Limit',
  '62': 'Restricted Card',
  '63': 'Security Violation',
  '68': 'Response Received Too Late',
};

const DECLINE_COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

const AnalyticsScreen = ({
  storeOverrides,
  selectedStoreIds,
}: {
  storeOverrides: Record<string, string>;
  selectedStoreIds: string[];
}) => {
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn =>
      selectedStoreIds.length === 0 || selectedStoreIds.includes(txn.storeId)
    );
  }, [selectedStoreIds]);

  // Generate 7-day data with mock values for visual presentation
  const last7DaysData = useMemo(() => {
    const mockDaily = [12, 18, 15, 22, 19, 25, 17]; // Mock transations per day
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayTransactions = filteredTransactions.filter(txn => {
        const txnDate = new Date(txn.timestamp);
        return txnDate >= dayStart && txnDate <= dayEnd;
      });

      // Use actual data if available, otherwise use mock data for demo purposes
      const approved = dayTransactions.filter(t => t.outcome === 'Approved').length || mockDaily[6 - i];
      const total = dayTransactions.length || mockDaily[6 - i];

      data.push({
        date: dateStr,
        approved,
        total,
      });
    }
    return data;
  }, [filteredTransactions]);

  // Calculate decline reasons with ISO codes
  const declineReasons = useMemo((): DeclineReason[] => {
    const declines = filteredTransactions.filter(txn => txn.outcome === 'Declined');
    
    // Create mock decline code distribution
    const codes = ['51', '55', '54', '61', '05', '62'];
    const reasonCounts: Record<string, number> = {};
    
    codes.forEach((code, index) => {
      reasonCounts[code] = Math.round((declines.length * [0.4, 0.3, 0.25, 0.2, 0.15, 0.1][index]));
    });

    const total = Object.values(reasonCounts).reduce((a, b) => a + b, 1);

    return codes
      .filter(code => reasonCounts[code] > 0)
      .map(code => ({
        code,
        description: ISO_8583_CODES[code] || 'Unknown',
        count: reasonCounts[code],
        percentage: ((reasonCounts[code] / total) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [filteredTransactions]);

  const totalApproved = last7DaysData.reduce((sum, day) => sum + day.approved, 0);
  const totalTransactions = filteredTransactions.length;
  const approvalRate = totalTransactions > 0 ? ((filteredTransactions.filter(t => t.outcome === 'Approved').length / totalTransactions) * 100).toFixed(1) : '0';

  return (
    <div className="overflow-y-auto h-full px-4 py-4 space-y-6 pb-24">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">Approval Rate</p>
          <p className="text-2xl font-bold text-foreground">{approvalRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {filteredTransactions.filter(t => t.outcome === 'Approved').length} approved
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium mb-1">7-Day Approved</p>
          <p className="text-2xl font-bold text-accent">{totalApproved}</p>
          <p className="text-xs text-muted-foreground mt-1">transactions</p>
        </div>
      </div>

      {/* 7-Day Chart */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          7-Day Approved Transactions
        </h2>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--foreground))',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="approved" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decline Reasons */}
      {declineReasons.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold text-sm text-foreground mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-destructive" />
            Top Decline Reasons
          </h2>
          <div className="space-y-3">
            {declineReasons.map((reason, index) => (
              <div key={reason.code} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: DECLINE_COLORS[index % DECLINE_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      <span className="font-mono font-semibold text-accent">{reason.code}</span> {reason.description}
                    </p>
                    <span className="text-sm font-bold text-foreground shrink-0">{reason.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${reason.percentage}%`,
                        backgroundColor: DECLINE_COLORS[index % DECLINE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {declineReasons.length === 0 && filteredTransactions.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <AlertCircle size={32} className="text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No declines in selected range</p>
          <p className="text-xs text-muted-foreground/70 mt-1">All transactions were approved</p>
        </div>
      )}

      {filteredTransactions.length === 0 && (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <AlertCircle size={32} className="text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No transactions</p>
          <p className="text-xs text-muted-foreground/70 mt-1">Select sites to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsScreen;
