import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../../schemas/registerSchema";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { SignupForm } from "../../../components/auth/signup-form";
import { toast } from "sonner";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassowrd, setShowPassword] = useState(false);
  const {
    register: authRegister,
    user,
    logout,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect jika sudah login
  if (!authLoading && user && !loading) {
    navigate("/dashboard");
  }
  // Jangan render form jika masih loading atau sudah login
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  if (user) {
    return null; // Akan redirect via useEffect
  }

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);

    try {
      const result = await authRegister(
        values.name,
        values.email,
        values.password,
      );

      if (result.success) {
        // 1. Bersihkan sesi otomatis dari Supabase
        await logout();

        // 2. Munculkan Toast
        toast.success("Registrasi berhasil!", {
          description: "Silakan login dengan akun baru Anda.",
        });

        // 3. Redirect ke login
        navigate("/login", { replace: true });
      } else {
        setError(result.message);
        toast.error("Gagal membuat akun", {
          description: result.message,
        });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
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
