import { createContext, useContext, useEffect, useState, useCallback } from "react";
import supabase from "../lib/supabase/client";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil role terbaru dari database
  const fetchUserRole = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Profile not found or error:", error.message);
        return null;
      }
      return data?.role;
    } catch (err) {
      console.error("Critical error fetching role:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    // 1. Inisialisasi Sesi Saat Pertama Kali Load
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          const latestRole = await fetchUserRole(session.user.id);
          // Prioritas: Database -> Metadata -> Default 'Siswa'
          setRole(latestRole || session.user.user_metadata?.role || "Siswa");
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        // Apapun yang terjadi, matikan loading setelah pengecekan selesai
        setLoading(false);
      }
    };

    initializeAuth();

    // 2. Pantau Perubahan Status Auth (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);
      
      if (session) {
        setUser(session.user);
        const latestRole = await fetchUserRole(session.user.id);
        setRole(latestRole || session.user.user_metadata?.role || "Siswa");
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [fetchUserRole]);

  // --- FUNGSI REGISTER ---
  const register = async (name, email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: "Admin", // Default saat daftar via web adalah Admin
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
    try {
      await supabase.auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};