import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import Register from "@/pages/register/Register";
import App from "@/App";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
