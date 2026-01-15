import { useEffect, useState } from "react";
import supabase from "../lib/supabase/client";

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    borrowedToday: 0,
    overdueLoan: 0,
  });

  const [latestActivities, setLatestActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      /** =========================
       *  TOTAL BUKU
       ========================== */
      const { count: totalBooks, error: bookError } = await supabase
        .from("buku")
        .select("id", { count: "exact", head: true });

      if (bookError) throw bookError;

      /** =========================
       *  TOTAL SISWA
       ========================== */
      const { count: totalStudents, error: studentError } = await supabase
        .from("siswa")
        .select("id", { count: "exact", head: true });

      if (studentError) throw studentError;

      /** =========================
       *  PINJAM HARI INI
       ========================== */
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: borrowedTodayData, error: borrowedError } =
        await supabase
          .from("peminjaman")
          .select("id, loan_date")
          .gte("loan_date", today.toISOString());

      if (borrowedError) throw borrowedError;

      /** =========================
       *  PINJAMAN TERLAMBAT
       ========================== */
      const { data: overdueData, error: overdueError } = await supabase
        .from("peminjaman")
        .select("id, due_date, status")
        .lt("due_date", new Date().toISOString())
        .neq("status", "returned");

      if (overdueError) throw overdueError;

      /** =========================
       *  AKTIVITAS TERBARU
       ========================== */
      const { data: activities, error: activityError } = await supabase
        .from("peminjaman")
        .select(`
          id,
          status,
          due_date,
          created_at,
          siswa:student_id (name),
          buku:book_id (title)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (activityError) throw activityError;

      /** =========================
       *  SET STATE
       ========================== */
      setStats({
        totalBooks: totalBooks || 0,
        totalStudents: totalStudents || 0,
        borrowedToday: borrowedTodayData?.length || 0,
        overdueLoan: overdueData?.length || 0,
      });

      setLatestActivities(activities || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    latestActivities,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
