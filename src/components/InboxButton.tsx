import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface InboxButtonProps {
  messages: Message[];
  onMarkAsRead: (messageId: string) => void;
}

const InboxButton = ({ messages, onMarkAsRead }: InboxButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <>
      {/* Floating Button */}
      <button onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-40 w-12 h-12 flex items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl active:scale-90 transition-all">
        <Mail size={20} />
        {unreadCount > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Inbox Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/30 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-screen w-full max-w-sm bg-card z-50 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-foreground">Messages</h2>
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                </div>
                <button onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors active:scale-90">
                  <X size={18} className="text-foreground" />
                </button>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Mail size={48} className="text-muted-foreground/30 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {messages.map((message) => (
                      <motion.button key={message.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => {
                          if (!message.isRead) {
                            onMarkAsRead(message.id);
                          }
                        }}
                        className={`w-full px-4 py-4 text-left transition-colors hover:bg-secondary/50 active:bg-secondary ${
                          !message.isRead ? 'bg-accent/5' : ''
                        }`}>
                        <div className="flex items-start gap-3">
                          {/* Unread Indicator */}
                          {!message.isRead ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-accent shrink-0 mt-1.5" />
                          ) : (
                            <CheckCheck size={14} className="text-muted-foreground mt-1.5 shrink-0" />
                          )}

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold text-foreground truncate ${!message.isRead ? 'font-bold' : ''}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.content}</p>
                            <p className="text-xs text-muted-foreground/60 mt-2">
                              {formatMessageDate(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const formatMessageDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default InboxButton;
