export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 py-10">
      {children}
    </div>
  );
}
