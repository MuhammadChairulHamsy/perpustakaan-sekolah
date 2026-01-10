import { useStudents } from "../hooks/useStudent";
import { StudentTable } from "../components/student/StudentTable";

const Students = () => {
  const { students, loading, deleteStudent } = useStudents();

  const handleEdit = (student) => {
    console.log("Edit student", student);
    // Tambahkan logic edit di sini
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus siswa ini?")) {
      await deleteStudent(id);
    }
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

      <StudentTable
        students={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Students;
