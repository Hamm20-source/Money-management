import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout({ user }) {
  return (
    <div className="lg:flex min-h-screen">

      {/* Sidebar kiri */}
      <Sidebar user={user} />

  
        <main className="p-5 flex-1 ">
          <Outlet />
        </main>

    </div>
  );
}