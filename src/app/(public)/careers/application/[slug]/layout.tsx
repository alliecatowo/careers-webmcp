export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-12 max-w-3xl space-y-8">
      {children}
    </div>
  );
}
