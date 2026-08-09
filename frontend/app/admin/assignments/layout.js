import AdminHeader from "@/app/components/AdminHeader";
import "./assignments.css";

export default function AssignmentsLayout({ children }) {
  return <div className="adminApp"><AdminHeader />{children}</div>;
}