import { useAuth } from "../../../context/AuthContext";
import { RegisterForm } from "../../../components/auth/register-form";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../../hooks/useRegister";
import { useEffect } from "react";

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {loading, ...formProps} = useRegister();

  useEffect(() => {
    if (!authLoading && user && !loading) {
      navigate("/dashboard", {replace: true});
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <RegisterForm {...formProps} />
      </div>
    </div>
  );
}
