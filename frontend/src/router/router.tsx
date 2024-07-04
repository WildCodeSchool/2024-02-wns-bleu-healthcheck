import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "@/pages/home/Home";
import Header from "@/common/components/header/Header";
import Dashboard from "@/pages/dashboard/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Header />}>
      <Route index element={<Home />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Route>
  )
);

export default router;