export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-bg-main font-rajdhani">
      {children}
    </div>
  );
}
