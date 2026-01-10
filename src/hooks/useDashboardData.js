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
        const { data: books } = await supabase.from("buku").select("*");
        const { data: students } = await supabase.from("siswa").select("*");

        const today = new Date().toISOString().split("T")[0];
        const { data: todayLoans } = await supabase
          .from("peminjaman")
          .select("*")
          .eq("load_date", today);

        const { data: overdueLoans } = await supabase
          .from("peminjaman")
          .select("*")
          .lt("due_date", new Date().toISOString())
          .neq("status", "returned");

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