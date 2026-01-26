const LoanCardTemplate = ({ loan }) => {
  if (!loan) return null;

  return (
    <div className="fixed -left-[9999px] top-0">
      <div
        id={`card-${loan.id}`}
        style={{ backgroundColor: "#ffffff", color: "#0f172a" }}
        className="w-[90mm] h-[55mm] p-6 border shadow-none"
      >
        <div
          style={{ borderBottom: "2px solid #2563eb" }}
          className="pb-2 mb-4 flex justify-between items-center"
        >
          <h2 style={{ color: "#2563eb" }} className="font-bold text-lg">
            KARTU PINJAM
          </h2>
          <span className="text-[10px] text-slate-500">
            ID: {loan.id ? String(loan.id).slice(0, 8) : "N/A"}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p>
            <strong>Peminjam:</strong>{" "}
            {loan.siswa?.name || "Nama tidak ditemukan"}
          </p>
          <p>
            <strong>Buku:</strong> {loan.buku?.title || "Judul tidak ditemukan"}
          </p>

          <div className="flex justify-between pt-4 border-t border-dashed mt-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-400 uppercase">
                Tgl Pinjam
              </span>
              <span className="text-[10px]">{loan.loan_date || "-"}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] text-slate-400 uppercase">
                Batas Kembali
              </span>
              <span className="text-[10px] font-bold text-red-600">
                {loan.due_date || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCardTemplate;
