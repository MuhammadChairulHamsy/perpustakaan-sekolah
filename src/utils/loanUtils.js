export const getLoanStatus = (loan) => {
  if (loan.status === "returned") {
    return {
      label: "Dikembalikan",
      badge: "bg-green-100 text-green-800",
    };
  }

  if (loan.status === "overdue") {
    return {
      label: "Terlambat",
      badge: "bg-red-100 text-red-800",
    };
  }

  return {
    label: "Dipinjam",
    badge: "bg-blue-100 text-blue-800",
  };
};
