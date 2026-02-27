import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [
        books,
        students,
        borrowedToday,
        overdue,
        returned,
        active,
        activities,
      ] = await Promise.all([
        supabase.from("buku").select("id", { count: "exact", head: true }),
        supabase.from("siswa").select("id", { count: "exact", head: true }),
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .gte("loan_date", today.toISOString()),
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .lt("due_date", now)
          .neq("status", "returned"),
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .eq("status", "returned"),
        supabase
          .from("peminjaman")
          .select("id", { count: "exact", head: true })
          .eq("status", "borrowed")
          .gte("due_date", now),
        supabase
          .from("peminjaman")
          .select(
            `
          id, status, due_date, created_at,
          siswa:student_id (name),
          buku:book_id (title)
        `,
          )
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if(books.error) throw books.error

      return {
        stats: {
          totalBooks: books.count || 0,
          totalStudents: students.count || 0,
          borrowedToday: borrowedToday.count || 0,
          overdueLoan: overdue.count || 0,
          totalReturned: returned.count || 0,
          totalActiveBorrowed: active.count || 0,
        },
        latestActivities: activities.data || [],
      };
    },

    staleTime: 1000 *  60 * 2,
    gcTime: 1000 * 60 * 5
  });
};
