import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/login/Page";
import SignupPage from "../pages/auth/signup/Page";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";
import Books from "../pages/Books";
import Students from "../pages/Students";
import Loans from "../pages/Loans";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
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
