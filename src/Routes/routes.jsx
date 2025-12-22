import { createBrowserRouter, Navigate } from "react-router";
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
import AssignedProjects from "../pages/decorator/AssignedProjects";
import DecoratorRoute from "./DecoratorRoute";
import DecoratorDashboardLayout from "../pages/decorator/DecoratorDashboardLayout";
import Earnings from "../pages/decorator/Earnings";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PaymentSuccess from "../pages/payment/PaymentSuccess";
import PaymentCancel from "../pages/payment/PaymentCancel";
import PrivateRoute from "./PrivateRoute";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";
import Error from "../components/Error";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home,
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
        path: "/services",
        Component: Services,
      },
      {
        path: "/services/:id",
       element: (
          <PrivateRoute>
            <ServiceDetails />
          </PrivateRoute>
        ),
       
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/payment/success',
        element: (
        <PrivateRoute>
          <PaymentSuccess />
        </PrivateRoute>
         ),
      },
      {
        path: '/payment/cancel',
        element: (
          <PrivateRoute>
            <PaymentCancel />
          </PrivateRoute>
        ),
      },
    ],
  },
 
    {
      path: "/dashboard",
      element: (
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
        ),
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
        {
          path: 'payment-history',
          element: (
            <PrivateRoute>
              <PaymentHistory />
            </PrivateRoute>
        ),
        }
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
  
 {
  path: "/decorator",
  element: (
    <DecoratorRoute>
      <DecoratorDashboardLayout />
    </DecoratorRoute>
  ),
 children: [
    { 
      index: true, 
      element: <Navigate to="/decorator/my-projects" replace /> 
    },
    { path: 'my-projects', element: <AssignedProjects /> },
    { path: 'earnings', element: <Earnings /> }
  ]
 },


]);
export default router;
