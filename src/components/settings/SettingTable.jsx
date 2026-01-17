import { SettingRow } from "./SettingRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const SettingTable = ({ setting, onEdit, onDelete }) => {
  return (
    <div className="data-table rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Pengguna
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Role
              </TableHead>
              <TableHead className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {setting.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
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
    </div>
  );
};
