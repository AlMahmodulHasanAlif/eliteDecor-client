import { NavLink, Outlet } from "react-router";
import { FaUser, FaCalendarAlt, FaHome } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import MyProfile from "../pages/Dashboard/MyProfile";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const menuItems = [
    { path: "/dashboard/profile", icon: FaUser, label: "My Profile" },
    {
      path: "/dashboard/my-bookings",
      icon: FaCalendarAlt,
      label: "My Bookings",
    },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      {/* ================= Main Content ================= */}
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 shadow-sm">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>

          <div className="flex-1 px-4">
            <h2 className="text-xl font-bold">User Dashboard</h2>
          </div>

          {/* Mobile Avatar */}
          <div className="flex-none lg:hidden">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.displayName || "User"}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Page content */}
        <div className="p-4 lg:p-10 min-h-screen bg-base-200">
          <Outlet />
        </div>
      </div>

      {/*  Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col bg-base-100 w-64 shadow-xl">
          {/* User Profile */}
          <div className="w-full p-6 text-center border-b border-base-300">
            <div className="avatar mb-3">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || DEFAULT_AVATAR}
                  alt={user?.displayName || "User"}
                />
              </div>
            </div>

            <h3 className="font-bold text-lg truncate">
              {user?.displayName || "User"}
            </h3>
            <p className="text-sm text-base-content/60 truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu */}
          <ul className="menu w-full grow p-4 space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                      isActive ? "bg-primary text-white" : "hover:bg-base-200"
                    }`
                  }
                >
                  <item.icon className="text-xl" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}

            <div className="divider"></div>

            {/* Back to Home */}
            <li>
              <NavLink
                to="/"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-base-200"
              >
                <FaHome className="text-xl" />
                <span>Back to Home</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
