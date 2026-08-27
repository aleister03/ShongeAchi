import AdminHeader from "@/app/components/AdminHeader.js";
// The admin design system lives in the checkers stylesheet (.adminApp, .adminHeader,
// .checkerMain, .stats/.stat, .card, .tableWrap, .checkerTable, .badge, .meter …), so
// the dashboard imports it rather than duplicating those rules.
import "../checkers/checkers.css";
import "./dashboard.css";
import RequireAuth from "@/app/components/RequireAuth.js";

// Applies to /admin/analytics only. This page previously lived in an (admin)/(dashboard)
// route group that resolved to /admin, which collided with the teammate's
// admin/page.js and failed the build with a duplicate-route error. Moved here so both
// dashboards can coexist.
export default function AdminDashboardLayout({ children }) {
  return <RequireAuth roles={["admin"]}><div className="adminApp"><AdminHeader />{children}</div></RequireAuth>;
}
