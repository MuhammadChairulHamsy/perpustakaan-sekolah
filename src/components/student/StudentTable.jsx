import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { StudentRow } from "./StudentRow";

export const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
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
                <StudentRow
                  key={student.id}
                  student={student}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
