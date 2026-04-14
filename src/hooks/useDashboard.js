import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["data-dashboard"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const results = await Promise.all([
        // 1. Total Buku
        supabase.from("buku").select("id", { count: "exact", head: true }),
        // 2. Total Siswa
        supabase.from("siswa").select("id", { count: "exact", head: true }),
        // 3. Dipinjam Hari Ini (Berdasarkan tanggal)
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .gte("loan_date", today.toISOString()),
        // 4. Terlambat (Mendukung status 'kembali' atau 'dikembalikan')
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .lt("due_date", now)
          .not("status", "in", '("kembali","dikembalikan","returned")'), 

        // 5. Total Kembali (Mendukung berbagai istilah)
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .or("status.eq.kembali,status.eq.dikembalikan,status.eq.returned"),

        // 6. Total Aktif Dipinjam (Yang belum jatuh tempo)
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .eq("status", "dipinjam")
          .gte("due_date", now),
        // 7. Aktivitas Terbaru
        supabase
          .from("peminjaman")
          .select(
            `id, status, due_date, created_at, siswa:student_id (name), buku:book_id (title)`,
          )
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const firstError = results.find((res) => res.error);
      if (firstError) throw firstError.error;

      const [
        books,
        students,
        borrowedToday,
        overdue,
        returned,
        active,
        activities,
      ] = results;

      return {
        stats: {
          totalBooks: books?.count || 0,
          totalStudents: students?.count || 0,
          borrowedToday: borrowedToday?.count || 0,
          overdueLoan: overdue?.count || 0,
          totalReturned: returned?.count || 0,
          totalActiveBorrowed: active?.count || 0,
        },
        latestActivities: activities?.data || [],
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};
