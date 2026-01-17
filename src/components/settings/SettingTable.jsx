import { SettingRow } from "./SettingRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";


export const SettingTable = ({setting, onEdit, onDelete}) => {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pengguna</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setting.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Tidak ada data pengguna.
              </TableCell>
            </TableRow>
          ) : (
            setting.map((user) => (
              <SettingRow 
                key={user.id} 
                user={user} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};