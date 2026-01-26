import jsPDF from "jspdf";

export const exportToPDF = (loan) => {
  if (!loan) return;

  // Membuat dokumen landscape ukuran kartu (90mm x 55mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [90, 55],
  });

  // --- Styling ---
  const margin = 10;
  const cardWidth = 90;
  
  // Header: Garis Biru
  doc.setDrawColor(37, 99, 235); // Biru (#2563eb)
  doc.setLineWidth(1);
  doc.line(margin, 15, cardWidth - margin, 15);

  // Judul
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.text("KARTU PINJAM", margin, 12);

  // ID di pojok kanan
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  const idText = `ID: ${String(loan.id).slice(0, 8)}`;
  doc.text(idText, cardWidth - margin - 15, 12);

  // --- Isi Data ---
  doc.setFontSize(10);
  doc.setTextColor(15); // Hitam gelap

  doc.setFont("helvetica", "bold");
  doc.text("Peminjam:", margin, 25);
  doc.setFont("helvetica", "normal");
  doc.text(loan.siswa?.name || "-", 35, 25);

  doc.setFont("helvetica", "bold");
  doc.text("Buku:", margin, 32);
  doc.setFont("helvetica", "normal");
  doc.text(loan.buku?.title || "-", 35, 32);

  // Footer: Garis Putus-putus
  doc.setDrawColor(200);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(margin, 40, cardWidth - margin, 40);
  doc.setLineDashPattern([], 0);

  // Tanggal
  doc.setFontSize(8);
  doc.text("Tgl Pinjam:", margin, 45);
  doc.text(loan.loan_date || "-", margin, 49);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38); // Merah
  doc.text("Batas Kembali:", 60, 45);
  doc.text(loan.due_date || "-", 60, 49);

  // Simpan
  doc.save(`Kartu_${loan.siswa?.name || "Pinjam"}.pdf`);
};

export default exportToPDF;