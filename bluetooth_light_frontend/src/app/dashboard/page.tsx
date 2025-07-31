import { redirect } from "next/navigation";
/**
 * Redirect /dashboard to /dashboard/devices by default.
 */
export default function DashboardRoot() {
  redirect("/dashboard/devices");
  return null;
}
