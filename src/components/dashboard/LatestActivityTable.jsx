import { ArrowRight, History } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { getActivityStatus, getTimeAgo } from "../../utils/statusUtils";

export const LatestActivityTable = ({ activities }) => {
  // Batasi hanya 5-6 data agar tinggi tabel konsisten dengan grafik di sampingnya
  const displayActivities = activities.slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* HEADER TABEL */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Aktivitas Terbaru
            </h2>
            <p className="text-xs text-muted-foreground">
              Log peminjaman & pengembalian buku
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary-foreground hover:bg-primary transition-all group"
        >
          Lihat semua
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* BODY TABEL */}
      <div className="flex-1 p-3 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-none">
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Siswa</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Buku</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Aksi</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">Waktu</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayActivities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground italic"
                >
                  Belum ada aktivitas sirkulasi hari ini.
                </TableCell>
              </TableRow>
            ) : (
              displayActivities.map((activity) => {
                const statusInfo = getActivityStatus(activity);
                return (
                  <TableRow
                    key={activity.id}
                    className="hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                  >
                    <TableCell className="py-4">
                      <p className="font-semibold text-sm text-foreground leading-none">
                        {activity.siswa?.name || "Siswa Tidak Dikenal"}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <p className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {activity.buku?.title || "Buku Tidak Dikenal"}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-medium text-muted-foreground">
                        {statusInfo.action}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-muted-foreground/80">
                      {activity.created_at ? getTimeAgo(activity.created_at) : "-"}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter ${statusInfo.badge}`}
                      >
                        {statusInfo.label}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};