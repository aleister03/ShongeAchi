import AdminHeader from "@/app/components/AdminHeader.js";
import "./checkers.css";
import RequireAuth from "@/app/components/RequireAuth.js";

export default function CheckerLayout({ children }) {
  return <RequireAuth roles={["admin"]}><div className="adminApp"><AdminHeader />{children}</div></RequireAuth>;
}
