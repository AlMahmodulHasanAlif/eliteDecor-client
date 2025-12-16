import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import router from "./Routes/routes.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./context/AuthProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
