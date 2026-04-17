import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/login/LoginPage";
import RegisterPage from "../pages/auth/register/RegisterPage";
import DashboardLayout from "../components/dashboard-layout";
import { Dashboard } from "../pages/Dashboard";
import Books from "../pages/Books";
import Catalog from "../pages/Catalog";
import Students from "../pages/Students";
import LoansAdmin from "../pages/admin/LoansAdmin";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import { Notification } from "../pages/Notification";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthCallback from "../context/AuthCallback";
import Finance from "../pages/Finance";
import LoansUser from "../pages/Loans";
import ProfileAccount from "../pages/ProfileAccount";

const staffRoles = ["admin", "pustakawan", "assistant"];

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/", element: <Navigate to="/dashboard" replace /> },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      // Bisa diakses semua orang yang sudah login (Siswa, Admin, dsb)
      { path: "dashboard", element: <Dashboard /> },
      { path: "buku", element: <Books /> },
      { path: "peminjaman-user", element: <LoansUser /> },
      { path: "katalog", element: <Catalog /> },
      { path: "notifikasi", element: <Notification /> },
      { path: "account", element: <ProfileAccount /> },

      // KHUSUS STAF (Admin, Pustakawan, Asisten)
      {
        path: "siswa",
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: "kelola-peminjaman",
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <LoansAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "keuangan",
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Finance />
          </ProtectedRoute>
        ),
      },
      {
        path: "laporan",
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "pengaturan",
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Settings />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
