import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import Register from "@/pages/register/Register";
import App from "@/App";
import AccountSettings from "@/pages/account-settings/AccountSettings";
import Premium from "@/pages/premium/Premium";

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
        path: "/settings",
        element: <AccountSettings />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/premium",
        element: <Premium />,
      },
    ],
  },
]);

export default router;
