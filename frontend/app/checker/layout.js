// frontend/app/checker/layout.js
import "@/app/styles/dashboard.css";
import "./checker.css";
import CheckerHeader from "@/app/components/CheckerHeader.js";
import RequireAuth from "@/app/components/RequireAuth.js";

export default function CheckerLayout({ children }) {
  return <RequireAuth roles={["checker"]}><div className="checkerApp"><CheckerHeader />{children}</div></RequireAuth>;
}