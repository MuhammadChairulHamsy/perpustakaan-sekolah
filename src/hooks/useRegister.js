import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/registerSchema";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register: authRegister, logout } = useAuth();
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
        await logout();
        toast.success("Registrasi berhasil!", {
          description: "Silakan login dengan akun baru Anda.",
        });
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

  return {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    setShowPassword,
    errors,
    loading,
    error,
  };
};
