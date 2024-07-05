import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
import App from "@/App";

const router = createBrowserRouter(
  [
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
        }
      ]
    }
  ]
);

  export default router;