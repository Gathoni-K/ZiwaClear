import { Sidebar } from "../components/Sidebar";
import { DashboardMap } from "../components/DashboardMap";

function Dashboard() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 relative">
        <DashboardMap />
      </div>
    </div>
  );
}

export default Dashboard;