import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Services from "../pages/services/services";
import ServiceDetails from "../pages/services/ServicesDetails";
import DashboardLayout from "../layout/DashboardLayout";
import MyProfile from "../pages/Dashboard/MyProfile";
import MyBookings from "../pages/Dashboard/MyBookings";
import AdminRoute from "./AdminRoute";
import AdminDashboardLayout from "../pages/Dashboard/AdminDashboardLayout";
import ManageServices from "../pages/admin/ManageServices";
import ManageBookings from "../pages/admin/ManageBookings";
import ManageUsers from "../pages/admin/ManageUsers";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/services",
        Component: Services,
      },
      {
        path: "/services/:id",
        Component: ServiceDetails,
      },
    ],
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: MyProfile,
      },
      {
        path: "/dashboard/profile",
        Component: MyProfile,
      },
      {
        path: "/dashboard/my-bookings",
        Component: MyBookings,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboardLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/dashboard/manage-services", 
        element:<ManageServices />  },
      { path: "/dashboard/manage-users", 
      element: <ManageUsers /> },
      { path: "/dashboard/manage-bookings/",
         element: <ManageBookings /> },  
    ],
  },
]);
export default router;
