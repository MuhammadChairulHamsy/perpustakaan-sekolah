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
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AuthCallback from "../context/AuthCallback";

const router = createBrowserRouter([
  // --- Rute Publik (Bisa diakses tanpa login) ---
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <SignupPage />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // --- Rute Terlindungi (Harus Login) ---
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      // Bisa diakses Siswa & Admin
      { 
        path: "dashboard", 
        element: <Dashboard /> 
      },
      { 
        path: "buku", 
        element: <Books /> 
      },
      { 
        path: "pinjaman", 
        element: <Loans /> 
      },

      // KHUSUS ADMIN SAJA (Gunakan adminOnly={true})
      { 
        path: "siswa", 
        element: (
          <ProtectedRoute adminOnly={true}>
            <Students />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "laporan", 
        element: (
          <ProtectedRoute adminOnly={true}>
            <Reports />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "pengaturan", 
        element: (
          <ProtectedRoute adminOnly={true}>
            <Settings />
          </ProtectedRoute>
        ) 
      },

      // 404 Inside Layout
      { path: "*", element: <NotFound /> },
    ],
  },
  
  // 404 Outside Layout
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;