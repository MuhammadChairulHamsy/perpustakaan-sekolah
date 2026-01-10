import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";
import Books from "../pages/Books";
import Students from "../pages/Students";
import Loans from "../pages/Loans";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <DashboardLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "buku", element: <Books /> },
      { path: "siswa", element: <Students /> },
      { path: "pinjaman", element: <Loans /> },
      { path: "laporan", element: <Reports /> },
      { path: "pengaturan", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
