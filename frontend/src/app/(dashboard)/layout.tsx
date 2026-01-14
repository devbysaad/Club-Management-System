import DashboardLayoutClient from "@/components/DashboardLayoutClient";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
