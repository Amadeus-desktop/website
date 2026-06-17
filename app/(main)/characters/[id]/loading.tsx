export default function CharacterDetailLoading() {
  return (
    <div className="mx-auto flex max-w-lg animate-pulse flex-col gap-6">
      <div className="aspect-[3/4] rounded-2xl bg-surface-elevated" />
      <div className="space-y-4 rounded-2xl bg-surface p-5">
        <div className="h-4 w-3/4 rounded bg-surface-elevated" />
        <div className="h-20 rounded bg-surface-elevated" />
        <div className="h-20 rounded bg-surface-elevated" />
        <div className="h-12 rounded-full bg-surface-elevated" />
      </div>
    </div>
  );
}
