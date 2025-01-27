import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Ensure Toastify CSS is imported
import "flowbite"; // Ensure Flowbite components are functional
import "./index.css";
import { router } from "./routes";
import AuthProvider from "./Providers/AuthProvider";

// Create a QueryClient instance for React Query
const queryClient = new QueryClient();

// Render the root React component
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* AuthProvider ensures authentication context is available globally */}
    <AuthProvider>
      {/* QueryClientProvider integrates React Query for state management */}
      <QueryClientProvider client={queryClient}>
        {/* RouterProvider for handling app routing */}
        <RouterProvider router={router} />

        {/* ToastContainer for notifications */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
