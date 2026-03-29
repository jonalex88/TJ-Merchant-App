import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Monitor, XCircle, Megaphone } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface NotificationsScreenProps {
  onBack: () => void;
}

const NotificationsScreen = ({ onBack }: NotificationsScreenProps) => {
  const [tjNotices, setTjNotices] = useState(true);
  const [terminalInactive, setTerminalInactive] = useState(true);
  const [terminalDays, setTerminalDays] = useState(3);
  const [declineAlerts, setDeclineAlerts] = useState(false);
  const [declineThreshold, setDeclineThreshold] = useState(10);

  return (
    <div className="px-4 pt-4 pb-6 overflow-y-auto h-full">
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="p-1.5 rounded-lg active:bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Notifications</h1>
      </div>

      <div className="space-y-4">
        {/* TJ Operational Notices */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-3">
            <span className="text-accent"><Megaphone size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Operational Notices</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Important updates from Transaction Junction support team</p>
            </div>
            <ToggleSwitch value={tjNotices} onChange={setTjNotices} />
          </div>
        </motion.div>

        {/* Terminal Inactivity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-accent"><Monitor size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Terminal Inactivity</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Alert when a terminal hasn't been used</p>
            </div>
            <ToggleSwitch value={terminalInactive} onChange={setTerminalInactive} />
          </div>
          {terminalInactive && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Inactive for</span>
                  <span className="text-sm font-semibold text-accent">{terminalDays} {terminalDays === 1 ? 'day' : 'days'}</span>
                </div>
                <Slider
                  value={[terminalDays]}
                  onValueChange={([v]) => setTerminalDays(v)}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">1 day</span>
                  <span className="text-[10px] text-muted-foreground">5 days</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Consecutive Declines */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-card rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-coral"><XCircle size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Consecutive Declines</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Alert after multiple declines in a row</p>
            </div>
            <ToggleSwitch value={declineAlerts} onChange={setDeclineAlerts} />
          </div>
          {declineAlerts && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground">Threshold</span>
                  <span className="text-sm font-semibold text-coral">{declineThreshold} declines</span>
                </div>
                <Slider
                  value={[declineThreshold]}
                  onValueChange={([v]) => setDeclineThreshold(v)}
                  min={5}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">5</span>
                  <span className="text-[10px] text-muted-foreground">20</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button onClick={() => onChange(!value)}
    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-accent' : 'bg-muted'}`}>
    <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow-sm"
      animate={{ left: value ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
  </button>
);

export default NotificationsScreen;
