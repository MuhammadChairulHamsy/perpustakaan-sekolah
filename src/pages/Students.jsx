import { useStudents } from "../hooks/useStudent";
import { StudentTable } from "../components/student/StudentTable";
import { SearchBar } from "../components/search-bar";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { StudentDialog } from "../components/student/StudentDialog";

const Students = () => {
  const {
    students,
    searchQuery,
    setSearchQuery,
    loading,
    addStudent,
    editStudent,
    deleteStudent,
  } = useStudents();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const handleOpenDialog = (student = null) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (editingStudent) {
      return await editStudent(editingStudent.id, formData);
    } else {
      return await addStudent(formData);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
      await deleteStudent(id);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6 w-full flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-foreground mb-2">Siswa</h1>
            <p className="text-muted-foreground">
              Kelola anggota perpustakaan terdaftar
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="font-bold gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </Button>
        </div>

        <div className="relative max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari siswa berdasarkan nama, kelas, atau email..."
            className="max-w-md"
          />
        </div>

        <StudentDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          student={editingStudent}
          onSubmit={handleSubmit}
        />

        <StudentTable
          students={students}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Students;
