import { useEffect, useState } from "react";
import supabase from "../lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen, Pencil, Trash2, CheckCircle } from "lucide-react";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Sesuaikan dengan nama kolom database kamu
        const { data, error } = await supabase
          .from("peminjaman")
          .select(`
            *,
            siswa:student_id (nama, kelas),
            buku:book_id (title, author)
          `)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase Error:", error);
        } else {
          console.log("Data fetched:", data);
          setLoans(data || []);
        }
      } catch (err) {
        console.error("Catch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleEdit = (loan) => {
    console.log("Edit loan:", loan);
    // Tambahkan logic edit di sini
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data peminjaman ini?")) {
      const { error } = await supabase.from("peminjaman").delete().eq("id", id);

      if (error) {
        console.error("Error deleting:", error);
      } else {
        setLoans(loans.filter((loan) => loan.id !== id));
      }
    }
  };

  const handleReturn = async (loan) => {
    if (confirm("Tandai buku ini sebagai sudah dikembalikan?")) {
      const { error } = await supabase
        .from("peminjaman")
        .update({ 
          status: "returned", 
          return_date: new Date().toISOString() 
        })
        .eq("id", loan.id);

      if (error) {
        console.error("Error updating:", error);
      } else {
        // Update state local
        setLoans(
          loans.map((l) =>
            l.id === loan.id
              ? { ...l, status: "returned", return_date: new Date().toISOString() }
              : l
          )
        );
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLoanStatus = (loan) => {
    const today = new Date();
    const dueDate = new Date(loan.due_date);

    if (loan.status === "returned") {
      return {
        label: "Dikembalikan",
        badge: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      };
    }

    if (dueDate < today) {
      const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      return {
        label: `Terlambat ${daysOverdue} hari`,
        badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      };
    }

    return {
      label: "Dipinjam",
      badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    };
  };

  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Peminjaman</h1>
        <p className="text-muted-foreground">
          Lacak peminjaman dan pengembalian buku.
        </p>
      </div>

      <div className="data-table rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Nama Siswa
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Judul Buku
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tanggal Pinjam
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Jatuh Tempo
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Denda
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data peminjaman
                  </TableCell>
                </TableRow>
              ) : (
                loans.map((loan) => {
                  const statusInfo = getLoanStatus(loan);
                  return (
                    <TableRow
                      key={loan.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {loan.siswa?.nama || "Unknown Student"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {loan.siswa?.kelas || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {loan.buku?.title || "Unknown Book"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {loan.buku?.author || "-"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(loan.load_date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        {formatDate(loan.due_date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        {loan.fine ? `Rp ${loan.fine.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
                        >
                          {statusInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {loan.status !== "returned" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReturn(loan)}
                              className="h-8 px-3 text-muted-foreground hover:text-green-600 hover:bg-green-600/10"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Kembalikan
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(loan)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(loan.id)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Loans;