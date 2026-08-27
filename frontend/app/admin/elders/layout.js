import AdminHeader from "@/app/components/AdminHeader.js";
import "../checkers/checkers.css";
// The nested /admin/elders/[id]/wellbeing page renders the shared wellbeing report,
// which relies on styles/dashboard.css (.badge.warn/.danger, .disclosure). Both
// sheets are loaded so the roster and the report each get what they need.
import "@/app/styles/dashboard.css";
import RequireAuth from "@/app/components/RequireAuth.js";

export default function AdminEldersLayout({ children }) {
  return <RequireAuth roles={["admin"]}><div className="adminApp"><AdminHeader />{children}</div></RequireAuth>;
}
