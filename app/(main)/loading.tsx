export default function MainLoading() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-surface-elevated"
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] rounded-xl bg-surface-elevated" />
            <div className="h-4 w-3/4 rounded bg-surface-elevated" />
            <div className="h-3 w-full rounded bg-surface" />
          </div>
        ))}
      </div>
    </div>
  );
}
