import AdminHeader from "@/app/components/AdminHeader";
import "./checkers.css";

export default function CheckerLayout({ children }) {
  return <div className="adminApp"><AdminHeader />{children}</div>;
}
