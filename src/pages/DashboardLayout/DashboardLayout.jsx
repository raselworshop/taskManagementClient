import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  console.log(location);

  return (
    <div className="flex md:h-[calc(100vh - 80px)] bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 overflow-auto left-0 w-64 bg-white min-h-full shadow-md transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0 z-40" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center md:hidden">
          <span className="text-xl font-bold">Task Management</span>
          <FaTimes
            className="cursor-pointer text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav className="mt-10 px-4 space-y-2">
          <h2 className="text-gray-600 text-sm font-semibold">WORKSPACE</h2>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200">
            Dashboard
          </a>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200">
            My Wallet
          </a>

          <h2 className="text-gray-600 text-sm font-semibold mt-4">APPS</h2>
          <a href="#" className="block py-2 px-4 rounded hover:bg-gray-200">
            Users
          </a>
          <Link to={'/dashboard/tasklist'} className="block py-2 px-4 rounded hover:bg-gray-200">
            Task List
          </Link>
          <Link
            to={"/dashboard/taskaddform"}
            className="block py-2 px-4 rounded hover:bg-gray-200"
          >
            Add Task
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <FaBars className="text-xl" />
          </button>
          <input
            type="text"
            placeholder="Search..."
            className="border px-4 py-2 w-full max-w-md rounded"
          />
          {/* Breadcrumb */}
          <div className="px-6 py-2 bg-gray-200 hidden md:block max-w-xs">
            <span className="text-gray-600">{location.pathname}</span>
          </div>
        </div>

        {/* Main Page Content */}
        <div className="m-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
