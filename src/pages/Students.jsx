import { useStudents } from "../hooks/useStudent";
import {
  StudentTable,
  StudentDialog,
  StudentSkeleton,
} from "../components/student";
import { SearchBar } from "../components/search-bar";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

const Students = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {
    students,
    totalCount,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    addStudent,
    editStudent,
    deleteStudent,
  } = useStudents(currentPage, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
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
    <div className="container min-h-screen space-y-8">
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

        {!isLoading && totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              {/* Tombol Previous */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Logic Angka Halaman */}
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i} className="hidden sm:block">
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Tombol Next */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage((prev) => prev + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default Students;
