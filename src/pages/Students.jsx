import { useStudents } from "../hooks/useStudent";
import {
  StudentTable,
  StudentDialog,
  StudentSkeleton,
} from "../components/student";
import { SearchBar } from "../components/search-bar";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";


const Students = () => {
  const {
    students,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
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
    try {
      if (editingStudent && editingStudent.id) {
        await editStudent.mutateAsync({
          id: editingStudent.id,
          updatedData: formData,
        });
      } else {
        await addStudent.mutateAsync(formData);
      }
      setDialogOpen(false);
      return true;
    } catch (err) {
      console.error("Submit Error:", err);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent.mutateAsync(id);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  if (isLoading) {
    return <StudentSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="mb-6 w-full flex flex-col gap-4">
        <div className="flex flex-col justify-between items-start lg:flex lg:flex-row">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Semua Siswa
            </h1>
            <p className="text-muted-foreground">
              Kelola anggota perpustakaan terdaftar
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="font-bold mt-2 gap-2 cursor-pointer"
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
          searchQuery={searchQuery}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Students;
