import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { LoginForm } from "../../../components/auth/login-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../../schemas/loginSchema";
import { toast } from "sonner";

export default function LoginPage() {
  const [showPassowrd, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    login: authLogin,
    loginWithGoogle,
    user,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);

    try {
      const result = await authLogin(values.email, values.password);

      if (result.success) {
        toast.success("Login berhasil!", {
          description: "Selamat datang kembali!",
        });

        // navigate("/dashboard", { replace: true });
      } else {
        setError(result.message);
        toast.error("Gagal login", { description: result.message });
        setLoading(false);
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
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
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          onGoogleLogin={handleGoogleLogin}
          showPassword={showPassowrd}
          setShowPassword={setShowPassword}
          errors={errors}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
