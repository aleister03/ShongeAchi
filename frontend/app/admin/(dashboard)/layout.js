import AdminHeader from "@/app/components/AdminHeader.js";
// The admin design system lives in the checkers stylesheet (.adminApp, .adminHeader,
// .checkerMain, .stats/.stat, .card, .tableWrap, .checkerTable, .badge, .meter …), so
// the dashboard imports it rather than duplicating those rules.
import "../checkers/checkers.css";
import "./dashboard.css";
import RequireAuth from "@/app/components/RequireAuth.js";

// A route group, so this layout applies to /admin only. The sibling /admin/checkers
// and /admin/assignments segments already provide their own layout with AdminHeader;
// putting this at app/admin/layout.js instead would render two headers on those pages.
export default function AdminDashboardLayout({ children }) {
  return <RequireAuth roles={["admin"]}><div className="adminApp"><AdminHeader />{children}</div></RequireAuth>;
}
