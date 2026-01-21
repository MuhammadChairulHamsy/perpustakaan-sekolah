import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSupabaseSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // User login via Google
        setUser({
          id: session.user.id,
          email: session.user.email,
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email.split("@")[0],
          role: session.user.user_metadata?.role || "admin",
        });
        setLoading(false);
        return true;
      }
      return false;
    };

    // Listener Supabase untuk real-time update (khususnya setelah Google login)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email.split("@")[0],
            role: session.user.user_metadata?.role || "user",
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Google Login — LANGSUNG pakai Supabase client-side
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        message: error.message || "Gagal memulai login Google",
      };
    }
    // Tidak perlu return apa-apa, browser akan redirect otomatis ke Google
  };

  useEffect(() => {
    // 1. Ambil sesi aktif saat pertama kali aplikasi dimuat
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || "siswa");
      }
      setLoading(false);
    };

    getInitialSession();

    // 2. Pantau perubahan status auth (Login, Logout,  Change, dsb)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        setRole(session.user.user_metadata?.role || "siswa");
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- FUNGSI REGISTER ---
  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "Admin",
          },
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // --- FUNGSI LOGIN ---
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // --- FUNGSI LOGOUT ---
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, loginWithGoogle, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook kustom agar kita bisa pakai useAuth() di komponen lain
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
