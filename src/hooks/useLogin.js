import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../schemas/loginSchema";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: authLogin, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setError("");
    setLoading(true);

    try {
      const result = await authLogin(values.email, values.password);

      if (result.success) {
        toast.success("Login berhasil!");
        navigate("/dashboard", { replace: true });
      } else {
        const msg = result.message.toLowerCase();

        if (msg.includes("password") || msg.includes("credentials")) {
          setFormError("password", {
            type: "manual",
            message: "Password yang anda masukkan salah.",
          });
        } else if (msg.includes("email") || msg.includes("user not found")) {
          setFormError("email", {
            type: "manual",
            message: "Email tidak terdaftar.",
          });
        } else {
          setFormError("password", {
            type: "manual",
            message: result.message,
          });
        }

        setError(result.message);
        toast.error("Gagal login", { description: result.message });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false); 
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError("Google login gagal.");
      toast.error("Google login gagal.");
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    onGoogleLogin: handleGoogleLogin,
    showPassword,
    setShowPassword,
    errors,
    loading,
    error,
  };
}