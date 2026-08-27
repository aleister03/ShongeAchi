// frontend/app/family/layout.js
import "@/app/styles/dashboard.css";
import RequireAuth from "@/app/components/RequireAuth.js";
export default function FamilyLayout({ children }) { return <RequireAuth roles={["family"]}>{children}</RequireAuth>; }