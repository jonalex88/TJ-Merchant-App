import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Lock, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Store } from '@/types';

interface SetupWizardScreenProps {
  onComplete: (selectedStoreIds: string[], storeNameOverrides: Record<string, string>, pinSet: boolean) => void;
  stores: Store[];
}

const SetupWizardScreen = ({ onComplete, stores }: SetupWizardScreenProps) => {
  const [step, setStep] = useState(0);
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
  const [storeNameOverrides, setStoreNameOverrides] = useState<Record<string, string>>({});
  const [pinCode, setPinCode] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');

  const steps = [
    { title: 'Select Stores', description: 'Choose which stores you want to manage' },
    { title: 'Rename Stores', description: 'Customize store names (optional)' },
    { title: 'Set PIN', description: 'Create a PIN for security (optional)' },
  ];

  const canProceed = () => {
    if (step === 0) return selectedStoreIds.length > 0; // At least one store
    return true; // Steps 1 and 2 are optional
  };

  const handleSkip = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setError('');
    } else {
      completeWizard();
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      setError('Please select at least one store');
      return;
    }

    if (step === 2) {
      // PIN validation
      if (pinCode && pinCode !== pinConfirm) {
        setError('PINs do not match');
        return;
      }
      if (pinCode && pinCode.length < 4) {
        setError('PIN must be at least 4 digits');
        return;
      }
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
      setError('');
    } else {
      completeWizard();
    }
  };

  const completeWizard = () => {
    onComplete(selectedStoreIds, storeNameOverrides, pinCode.length > 0);
  };

  const toggleStore = (storeId: string) => {
    setSelectedStoreIds(prev =>
      prev.includes(storeId)
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  };

  const updateStoreName = (storeId: string, name: string) => {
    setStoreNameOverrides(prev => ({
      ...prev,
      [storeId]: name,
    }));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-secondary/50">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-foreground">Setup Wizard</h1>
          <span className="text-xs font-medium text-muted-foreground">
            {step + 1} of {steps.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-semibold text-foreground">{steps[step].title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{steps[step].description}</p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-3">
                {stores.map(store => (
                  <button
                    key={store.storeId}
                    onClick={() => toggleStore(store.storeId)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selectedStoreIds.includes(store.storeId)
                        ? 'bg-accent/10 border-accent'
                        : 'bg-card border-border'
                    } active:scale-[0.98]`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedStoreIds.includes(store.storeId)
                          ? 'bg-accent border-accent'
                          : 'border-muted-foreground/30'
                      }`}
                    >
                      {selectedStoreIds.includes(store.storeId) && (
                        <Check size={14} className="text-accent-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{store.displayName}</p>
                      <p className="text-xs text-muted-foreground">{store.storeId}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-3">
                {selectedStoreIds.map(storeId => {
                  const store = stores.find(s => s.storeId === storeId)!;
                  const currentName = storeNameOverrides[storeId] || store.displayName;

                  return (
                    <div key={storeId} className="bg-card rounded-xl border border-border p-4">
                      <label className="text-xs font-semibold text-muted-foreground block mb-2">
                        {store.displayName}
                      </label>
                      <div className="relative">
                        <Pencil size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={currentName}
                          onChange={e => updateStoreName(storeId, e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                          placeholder="Store name"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A PIN adds an extra layer of security. You can set one now or skip this step.
              </p>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">PIN (4+ digits)</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="Enter PIN"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Confirm PIN</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={pinConfirm}
                    onChange={e => setPinConfirm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                    placeholder="Confirm PIN"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-coral mt-4">
            {error}
          </motion.p>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4 border-t border-border flex gap-3">
        <button
          onClick={handleSkip}
          className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold text-sm active:scale-[0.97] transition-transform"
        >
          {step === steps.length - 1 ? 'Skip' : 'Skip'}
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
          {step < steps.length - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
};

export default SetupWizardScreen;
