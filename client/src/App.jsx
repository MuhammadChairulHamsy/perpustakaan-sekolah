import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import Books from "./pages/Books";
import Studenst from "./pages/Students";
import Loans from "./pages/Loans";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <DashboardLayout />,
    errorElement: <NotFound/>,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/buku",
        element: <Books />,
      },
      {
        path: "/siswa",
        element: <Studenst />,
      },
      {
        path: "/pinjaman",
        element: <Loans />,
      },
      {
        path: "/laporan",
        element: <Reports />,
      },
      {
        path: "/pengaturan",
        element: <Settings />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
