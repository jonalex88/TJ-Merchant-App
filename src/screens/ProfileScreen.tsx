import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface ProfileScreenProps {
  userData: {
    name: string;
    email: string;
    phone: string;
    tjAccountId: string;
  };
  onSave: (userData: { name: string; email: string; phone: string }) => void;
  onBack: () => void;
}

const ProfileScreen = ({ userData, onSave, onBack }: ProfileScreenProps) => {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [phone, setPhone] = useState(userData.phone);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    onSave({ name: name.trim(), email: email.trim(), phone: phone.trim() });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background px-4 pt-4 pb-4 border-b border-border flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-1.5 rounded-lg active:bg-secondary transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Edit Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        {/* TJ Account ID (Read-only) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <BookOpen size={14} />
            TJ Account ID
          </label>
          <p className="text-sm font-mono font-semibold text-foreground">{userData.tjAccountId}</p>
          <p className="text-xs text-muted-foreground mt-1">This ID cannot be changed</p>
        </motion.div>

        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-card rounded-xl border border-border p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <User size={14} />
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="Your full name"
          />
        </motion.div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <Mail size={14} />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="your.email@example.com"
          />
        </motion.div>

        {/* Phone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2">
            <Phone size={14} />
            Contact Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            placeholder="+27 (0)XX XXX XXXX"
          />
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-coral">
            {error}
          </motion.p>
        )}
      </div>

      {/* Action Button */}
      <div className="px-4 pb-6 pt-4 border-t border-border">
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSave}
          className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm active:scale-[0.97] transition-transform"
        >
          Save Changes
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileScreen;
