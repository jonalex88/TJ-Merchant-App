const colors = ['#0D1B2A', '#00C9A7', '#1B4965', '#5FA8D3', '#CAE9FF'];

const StoreAvatar = ({ name, size = 40 }: { name: string; size?: number }) => {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colorIdx = name.charCodeAt(0) % colors.length;

  return (
    <div
      className="rounded-full flex items-center justify-center text-primary-foreground font-semibold shrink-0"
      style={{ width: size, height: size, backgroundColor: colors[colorIdx], fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
};

export default StoreAvatar;
