// src/components/dashboard/LatestActivityTable.jsx
import { ArrowRight } from "lucide-react";
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
  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Aktivitas Terbaru
          </h2>
          <p className="text-sm text-muted-foreground">
            Aktivitas peminjaman dan pengembalian baru-baru ini
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:bg-foreground transition-colors duration-500 ease-in-out cursor-pointer"
        >
          Lihat semua
          <ArrowRight className=" h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
              <TableHead className="py-3 text-left text-sm font-medium text-muted-foreground">
                Siswa
              </TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-muted-foreground">
                Buku
              </TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-muted-foreground">
                Action
              </TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-muted-foreground">
                Waktu
              </TableHead>
              <TableHead className="py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Tidak ada aktivitas terkini
                </TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => {
                const statusInfo = getActivityStatus(activity);
                return (
                  <TableRow
                    key={activity.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {activity.siswa?.name || "Unknown Student"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.buku?.title || "Unknown Book"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {statusInfo.action}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.created_at
                        ? getTimeAgo(activity.created_at)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.badge}`}
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
