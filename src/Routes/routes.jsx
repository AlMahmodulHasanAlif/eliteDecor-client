import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component:Home,
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
