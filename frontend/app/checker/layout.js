import "@/app/styles/dashboard.css";
import "./checker.css";
import CheckerHeader from "@/app/components/CheckerHeader";

// Every /checker/* page gets its own dedicated header (a real port of the
// feature branch's CheckerHeader, not the shared family/admin Navbar) and
// the ported checker.css/dashboard.css visual system, applied once here
// instead of every page importing it separately.
export default function CheckerLayout({ children }) {
  return (
    <div className="checkerApp">
      <CheckerHeader />
      {children}
    </div>
  );
}
