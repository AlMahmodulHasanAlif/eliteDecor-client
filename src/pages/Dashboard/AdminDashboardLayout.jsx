import { NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaBoxes,
  FaUsers,
  FaCalendarAlt,
  FaArrowLeft,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AdminDashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();

  const menuItems = [
    { path: "/dashboard", icon: FaHome, label: "Dashboard Home" },
    { path: "/dashboard/manage-services", icon: FaBoxes, label: "Manage Services" },
    { path: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
    { path: "/dashboard/manage-bookings", icon: FaCalendarAlt, label: "Manage Bookings" },
  ];

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content  */}
      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300 shadow-sm">
          <label
            htmlFor="admin-drawer"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>

          <div className="flex-1 px-4">
            <h2 className="text-xl font-bold">Admin Dashboard</h2>
          </div>

          <div className="flex-none">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.displayName || "Admin"}
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 lg:p-10 min-h-screen bg-base-200">
          <Outlet />
        </div>
      </div>

      {/* Sidebar  */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <aside className="w-64 bg-base-100 min-h-full ">
          {/* Admin Profile */}
          <div className="p-6 text-center">
            <div className="avatar mb-3">
              <div className="w-16 rounded-full ring ring-error ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.displayName || "Admin"}
                />
              </div>
            </div>

            <div className="badge badge-error mb-2">ADMIN</div>

            <h3 className="font-bold truncate">
              {user?.displayName || "Admin"}
            </h3>
            <p className="text-sm text-base-content/60 truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu (MATCHES DashboardLayout) */}
          <ul className="menu px-4 py-6 text-base space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-2 py-2 transition
                     ${
                       isActive
                         ? "font-semibold text-primary"
                         : "text-base-content hover:bg-base-200"
                     }`
                  }
                >
                  <item.icon className="text-lg" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}

            <div className="divider my-3"></div>

            <li>
              <NavLink
                to="/"
                className="flex items-center gap-3 px-2 py-2 hover:bg-base-200"
              >
                <FaArrowLeft className="text-lg" />
                <span>Back to Home</span>
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
