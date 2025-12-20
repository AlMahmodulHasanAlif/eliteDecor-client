import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Services from "../pages/services/services";
import ServiceDetails from "../pages/services/ServicesDetails";

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
]);
export default router;
