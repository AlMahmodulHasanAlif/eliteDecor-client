import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";
import Register from "../pages/Auth/Register";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
  },
  {
    path: "/register",
    Component: Register,
  },
]);
export default router;
