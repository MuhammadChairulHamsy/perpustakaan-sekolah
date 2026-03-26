"use client";

import React from "react";
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

export const LatestActivityTable = React.memo(({ activities }) => {
  // 🔥 Memo slice
  const displayActivities = React.useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  // 🔥 Preprocess data sekali saja
  const processedActivities = React.useMemo(() => {
    return displayActivities.map((activity) => {
      const statusInfo = getActivityStatus(activity);
      const timeAgo = activity.created_at
        ? getTimeAgo(activity.created_at)
        : "-";

      return {
        ...activity,
        statusInfo,
        timeAgo,
      };
    });
  }, [displayActivities]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* HEADER */}
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
          className="text-primary hover:text-primary-foreground hover:bg-primary transition-all"
        >
          Lihat semua
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* BODY */}
      <div className="flex-1 p-3 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-none">
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Siswa
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Buku
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Aksi
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider">
                Waktu
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-right">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {processedActivities.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-muted-foreground italic"
                >
                  Belum ada aktivitas sirkulasi hari ini.
                </TableCell>
              </TableRow>
            ) : (
              processedActivities.map((activity) => (
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
                    <p className="text-sm text-muted-foreground truncate max-w-40">
                      {activity.buku?.title || "Buku Tidak Dikenal"}
                    </p>
                  </TableCell>

                  <TableCell className="py-4">
                    <span className="text-xs font-medium text-muted-foreground">
                      {activity.statusInfo.action}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 text-xs text-muted-foreground/80">
                    {activity.timeAgo}
                  </TableCell>

                  <TableCell className="py-4 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${activity.statusInfo.badge}`}
                    >
                      {activity.statusInfo.label}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});