export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold text-primary">LoveyDovey</span>
        <p className="mt-1 text-sm text-muted">Beyond Simple Chat, My Dream Talk</p>
      </div>
      {children}
    </div>
  );
}
