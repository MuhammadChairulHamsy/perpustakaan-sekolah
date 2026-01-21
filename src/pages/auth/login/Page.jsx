import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LoginForm } from "../../../components/auth/login-form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    await loginWithGoogle();
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          onSubmit={handleSubmit}
          email={email}
          password={password}
          onGoogleLogin={handleGoogleLogin}
          setEmail={setEmail}
          setPassword={setPassword}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
