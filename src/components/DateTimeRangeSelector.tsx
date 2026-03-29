import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Settings2 } from 'lucide-react';
import { useState } from 'react';

interface DateTimeRangeSelectorProps {
  fromDateTime: Date;
  window: string;
  onFromDateTimeChange: (date: Date) => void;
  onWindowChange: (window: string) => void;
}

const windows = ['10s', '1m', '5m', '1h', '1d'] as const;

const DateTimeRangeSelector = ({
  fromDateTime,
  window,
  onFromDateTimeChange,
  onWindowChange,
}: DateTimeRangeSelectorProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDateTime = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;
    
    return date.toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }) + `, ${timeStr}`;
  };

  const windowDurations: Record<string, number> = {
    '10s': 10 * 1000,
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  };

  const toDateTime = new Date(fromDateTime.getTime() + windowDurations[window]);

  return (
    <div className="space-y-3 bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings2 size={14} className="text-accent" />
          <p className="text-xs font-semibold text-muted-foreground">Date & Time Range</p>
        </div>
      </div>

      {/* Date/Time Picker Button */}
      <motion.button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary border border-border active:scale-[0.98] transition-transform text-left"
      >
        <Calendar size={14} className="text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-sm font-medium text-foreground truncate">{formatDateTime(fromDateTime)}</p>
        </div>
      </motion.button>

      {/* Time Range Display */}
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground bg-muted/30 rounded-lg">
        <Clock size={12} className="shrink-0" />
        <span>to {formatDateTime(toDateTime)}</span>
      </div>

      {/* Window Selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">Window</p>
        <div className="flex gap-2 flex-wrap">
          {windows.map(w => (
            <button
              key={w}
              onClick={() => onWindowChange(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                w === window
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground active:bg-muted/80'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Date/Time Picker Overlay */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border pt-3 -mx-4 -mb-4 px-4 pb-4"
          >
            <DateTimePicker
              value={fromDateTime}
              onChange={(newDate) => {
                onFromDateTimeChange(newDate);
                setShowPicker(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const DateTimePicker = ({ value, onChange }: DateTimePickerProps) => {
  const today = new Date();
  const maxDate = new Date(today);
  const minDate = new Date(today);
  minDate.setMonth(minDate.getMonth() - 2); // 2 months back

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-muted-foreground block mb-2">Date</label>
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={e => {
            const newDate = new Date(e.target.value);
            newDate.setHours(value.getHours(), value.getMinutes());
            onChange(newDate);
          }}
          min={minDate.toISOString().split('T')[0]}
          max={maxDate.toISOString().split('T')[0]}
          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-2">Hour</label>
          <select
            value={value.getHours()}
            onChange={e => {
              const newDate = new Date(value);
              newDate.setHours(Number(e.target.value));
              onChange(newDate);
            }}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {hours.map(h => (
              <option key={h} value={h}>
                {String(h).padStart(2, '0')}:00
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-2">Minute</label>
          <select
            value={value.getMinutes()}
            onChange={e => {
              const newDate = new Date(value);
              newDate.setMinutes(Number(e.target.value));
              onChange(newDate);
            }}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            {minutes.map(m => (
              <option key={m} value={m}>
                {String(m).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => {
          const now = new Date();
          now.setHours(now.getHours() - 1); // 1 hour ago default
          onChange(now);
        }}
        className="w-full text-xs text-accent font-medium py-2 rounded-lg bg-accent/10 active:bg-accent/20 transition-colors"
      >
        Set to 1 hour ago
      </button>
    </div>
  );
};

export default DateTimeRangeSelector;
