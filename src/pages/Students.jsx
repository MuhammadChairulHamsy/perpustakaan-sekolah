import { useState, useEffect } from "react";
import supabase from "../lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { User, Pencil, Trash2 } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data, error } = await supabase.from("siswa").select("*");

        if (error) {
          console.error("Supabase Error:", error);
        } else {
          console.log("Data fetched:", data);
          setStudents(data || []);
        }
      } catch (err) {
        console.error("Catch Error:", err);
      } finally {
        setLoading(false); // Diperbaiki dari setStudents(falzse)
      }
    };

    fetchStudents();
  }, []);

  const handleEdit = (student) => {
    console.log("Edit student", student);
    // Tambahkan logic edit di sini
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
      const { error } = await supabase.from("siswa").delete().eq("id", id);
      if (error) {
        console.error("Error deleting:", error);
      } else {
        setStudents(students.filter((student) => student.id !== id));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Siswa</h1>
        <p className="text-muted-foreground">
          Kelola anggota perpustakaan terdaftar
        </p>
      </div>

      <div className="data-table rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Nama
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Kelas
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Email
                </TableHead>
                <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Tanggal Daftar
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <span className="font-medium text-foreground block">
                            {student.name}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {student.class || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {student.email || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {student.created_at
                        ? formatDate(student.created_at)
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Students;
