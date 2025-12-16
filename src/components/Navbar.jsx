import React from "react";
import Logo from "./logo";
import { Link, NavLink } from "react-router";
import useAuth from "../hooks/UseAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/">Services</NavLink>
      </li>
      <li>
        <NavLink to="/">About</NavLink>
      </li>
      <li>
        <NavLink to="/">Contact</NavLink>
      </li>
    </>
  );
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      console.log("logged out");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm  bg-black text-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow bg-black text-white"
            >
              {links}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">
            <Logo></Logo>
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end gap-2">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>

              <div className="dropdown dropdown-end ">
                <label tabIndex={0} className="btn btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={user?.photoURL || "/default-avatar.png"}
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 bg-black text-white border "
                >
                  <li>
                    <span className="font-medium hover:text-gray-500">
                      {user.displayName || "User"}
                    </span>
                  </li>
                  <li className="hover:text-gray-500">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="hover:text-gray-500">
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
