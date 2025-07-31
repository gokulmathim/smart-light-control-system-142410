import DashboardLayout from "../../components/DashboardLayout";

/** 
 * Dashboard route group layout 
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
