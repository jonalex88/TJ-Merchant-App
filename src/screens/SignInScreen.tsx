import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

interface SignInScreenProps {
  onSignIn: (username: string, rememberMe: boolean) => void;
}

const SignInScreen = ({ onSignIn }: SignInScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      onSignIn(username, rememberMe);
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-8 py-12 bg-gradient-to-b from-background to-secondary/50">
      <motion.div custom={0} variants={item} initial="hidden" animate="show" className="flex flex-col items-center mb-10">
        <img src="/tj-logo.png" alt="Transaction Junction" className="h-20 mb-6 object-contain" />
        <h1 className="text-2xl font-bold text-primary">Transpector</h1>
        <p className="text-muted-foreground text-sm mt-1">Merchant Portal</p>
      </motion.div>

      <motion.form custom={1} variants={item} initial="hidden" animate="show" onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground active:scale-90 transition-transform"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-coral">{error}</motion.p>
        )}

        <div className="flex items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
              rememberMe ? 'bg-accent border-accent' : 'border-border'
            }`}
          >
            {rememberMe && <div className="w-2 h-2 bg-accent-foreground rounded-sm" />}
          </button>
          <label className="text-xs text-muted-foreground cursor-pointer">Remember me</label>
        </div>

        <motion.button custom={2} variants={item} initial="hidden" animate="show"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-xl py-3.5 px-4 font-semibold active:scale-[0.97] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'Sign In'}
        </motion.button>
      </motion.form>

      <motion.p custom={3} variants={item} initial="hidden" animate="show" className="text-[11px] text-muted-foreground text-center mt-8 leading-relaxed">
        By signing in you agree to our <span className="underline">Terms</span> & <span className="underline">Privacy Policy</span>
      </motion.p>
    </div>
  );
};

export default SignInScreen;
