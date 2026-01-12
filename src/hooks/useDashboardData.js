// src/hooks/useDashboardData.js
import { useState, useEffect } from "react";
import supabase from "../lib/db";

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    borrowedToday: 0,
    totalStudents: 0,
    overdueLoan: 0,
  });
  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        
        const [{ data: books }, { data: students }] = await Promise.all([
          supabase.from("buku").select("id"),
          supabase.from("siswa").select("id"),
        ]);
        
        const { data: todayLoans } = await supabase
          .from("peminjaman")
          .select("id")
          .eq("loan_date", today)
          .eq("status", "borrowed");

        const { data: overdueLoans } = await supabase
          .from("peminjaman")
          .select("id")
          .lt("due_date", new Date().toISOString())
          .neq("status", "borrowed");

        const { data: activities } = await supabase
          .from("peminjaman")
          .select(
            `
            *,
            siswa:student_id (name),
            buku:book_id (title)
          `
          )
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalBooks: books?.length || 0,
          borrowedToday: todayLoans?.length || 0,
          totalStudents: students?.length || 0,
          overdueLoan: overdueLoans?.length || 0,
        });

        setLatestActivities(activities || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, latestActivities, loading, error };
};
