import AdminHeader from "@/app/components/AdminHeader.js";
import "../checkers/checkers.css";
import RequireAuth from "@/app/components/RequireAuth.js";

export default function AdminSubscriptionsLayout({ children }) {
  return <RequireAuth roles={["admin"]}><div className="adminApp"><AdminHeader />{children}</div></RequireAuth>;
}
