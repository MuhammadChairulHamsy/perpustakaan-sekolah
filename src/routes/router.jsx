import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/login/Page";
import SignupPage from "../pages/auth/signup/Page";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { Dashboard } from "../pages/Dashboard";
import Books from "../pages/Books";
import Catalog from "../pages/Catalog";
import Students from "../pages/Students";
import Loans from "../pages/Loans";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthCallback from "../context/AuthCallback";

// Definisi Role Staf agar tidak tulis ulang
const staffRoles = ["Admin", "Pustakawan", "Asisten"];

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <SignupPage /> },
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
      { path: "pinjaman", element: <Loans /> },
      { path: "katalog", element: <Catalog /> },

      // KHUSUS STAF (Admin, Pustakawan, Asisten)
      { 
        path: "siswa", 
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Students />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "laporan", 
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Reports />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "pengaturan", 
        element: (
          <ProtectedRoute allowedRoles={staffRoles}>
            <Settings />
          </ProtectedRoute>
        ) 
      },

      { path: "*", element: <NotFound /> },
    ],
  },
  
  { path: "*", element: <NotFound /> },
]);

export default router;