// src/pages/Reports.jsx
import { TrendingUp, BookOpen, AlertTriangle, Users } from "lucide-react";

import { StatsCard } from "../components/dashboard/StatsCard";
import { useReport } from "../hooks/useReport";
import MonthlyLoanChart from "../components/reports/MonthlyLoanChart";
import LoanStatusChart from "../components/reports/LoanStatusChart";
import TopBooksChart from "../components/reports/TopBooksChart";

const Reports = () => {
  const { loading, summary, monthlyLoans, loanStatus, topBooks } = useReport();

  const summaryCards = [
    {
      title: "Total Pinjaman",
      value: summary.totalLoans,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-100",
      description: "Total sirkulasi buku yang tercatat.",
    },
    {
      title: "Pinjaman Hari Ini",
      value: summary.dailyLoans,
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-100",
      description: "Aktivitas peminjaman hari ini.",
    },
    {
      title: "Tingkat Keterlambatan (%)",
      value: `${summary.overdueRate}%`,
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-100",
      description: "Persentase buku yang belum kembali.",
    },
    {
      title: "Peminjam Aktif",
      value: summary.activeBorrowers,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-100",
      description: "Siswa yang aktif meminjam buku.",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="container min-h-screen space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Laporan</h1>
        <p className="text-muted-foreground">
          Analisis dan statistik peminjaman perpustakaan
        </p>
      </div>

      {/* SUMMARY CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* GRAFIK */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md animate-custom-fade delay-1">
          <MonthlyLoanChart data={monthlyLoans} />
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md animate-custom-fade delay-2">
          <LoanStatusChart data={loanStatus} />
        </div>
      </div>

      <div className="mt-6 bg-card rounded-xl border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md animate-custom-fade delay-3">
        <TopBooksChart data={topBooks} />
      </div>
    </div>
  );
};

export default Reports;
