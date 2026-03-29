import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: 'Approved' | 'Declined' | 'Pending';
}

const StatusPill = ({ status }: StatusPillProps) => {
  const styles = {
    Approved: 'bg-teal/15 text-teal',
    Declined: 'bg-coral/15 text-coral',
    Pending: 'bg-amber/15 text-amber',
  };

  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full', styles[status])}>
      {status}
    </span>
  );
};

export default StatusPill;
