import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // Tampilkan loading saat check auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Jika belum login, redirect ke login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika halaman ini khusus admin tapi yang login adalah siswa
  if (adminOnly && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika sudah login, render children
  return children;
}