import { createBrowserRouter } from "react-router";
import RootLayout from "../layout/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
  },
]);
export default router;
