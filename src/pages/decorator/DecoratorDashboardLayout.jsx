import { NavLink, Outlet } from 'react-router';
import { FaBriefcase, FaDollarSign, FaHome } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useRole from '../../hooks/useRole';

const DecoratorDashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();

  const menuItems = [
    { path: '/decorator/my-projects', icon: FaBriefcase, label: 'My Projects' },
    { path: '/decorator/earnings', icon: FaDollarSign, label: 'Earnings' },
  ];

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="decorator-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300 shadow-sm">
          <label
            htmlFor="decorator-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost lg:hidden"
          >
            ☰
          </label>

          <div className="flex-1 px-4">
            <h2 className="text-xl font-bold">Decorator Dashboard</h2>
          </div>

          <div className="flex-none gap-2">
            <div className="badge badge-secondary uppercase hidden sm:flex">{role}</div>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user?.photoURL || user?.image || 'https://via.placeholder.com/150'}
                  alt={user?.displayName}
                />
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 lg:p-10 min-h-screen bg-base-200">
          <Outlet />
        </div>
      </div>

      <div className="drawer-side">
        <label
          htmlFor="decorator-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col bg-base-100 w-64 shadow-xl">
          <div className="w-full p-6 text-center border-b border-base-300">
            <div className="avatar mb-3">
              <div className="w-16 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL || user?.image || 'https://via.placeholder.com/150'}
                  alt={user?.displayName}
                />
              </div>
            </div>

            <div className="badge badge-secondary mb-2 uppercase">DECORATOR</div>
            <h3 className="font-bold text-lg truncate">
              {user?.displayName}
            </h3>
            <p className="text-sm text-base-content/60 truncate">
              {user?.email}
            </p>
          </div>

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

            <li>
              <NavLink
                to="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-base-200"
              >
                <FaHome className="text-xl" />
                <span>Back to Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DecoratorDashboardLayout;