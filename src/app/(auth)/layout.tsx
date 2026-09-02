
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is for authentication pages like login, signup, etc.
  // It should not contain any protected route logic to avoid redirect loops.
  return <>{children}</>;
}
