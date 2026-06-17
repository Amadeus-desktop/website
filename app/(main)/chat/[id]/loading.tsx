export default function ChatDetailLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] animate-pulse gap-4 lg:h-[calc(100vh-4rem)]">
      <div className="hidden w-72 rounded-card bg-surface lg:block" />
      <div className="flex flex-1 flex-col rounded-card bg-surface">
        <div className="h-24 border-b border-border bg-surface-elevated" />
        <div className="flex-1 bg-background/40" />
        <div className="h-20 border-t border-border bg-surface-elevated" />
      </div>
    </div>
  );
}
