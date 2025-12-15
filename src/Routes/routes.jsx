import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Register from "../pages/Auth/Register";
import Home from "../pages/Home/Home";

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
]);
export default router;
