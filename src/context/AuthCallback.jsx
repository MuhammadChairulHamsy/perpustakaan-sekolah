import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase/client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Listener sekali saja untuk handle callback
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard", { replace: true });
      } else if (event === 'SIGNED_OUT' || !session) {
        navigate("/login", { replace: true });
      }
    });

    // Cek session langsung (untuk case refresh page di callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <p className="mt-4 text-sm text-muted-foreground font-body">
          Menyelesaikan login dengan Google...
        </p>
      </div>
    </div>
  );
}