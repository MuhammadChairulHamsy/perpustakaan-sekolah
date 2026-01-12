// src/utils/loanUtils.js
export const getLoanStatus = (loan) => {
  const today = new Date();
  const dueDate = new Date(loan.due_date);

  if (loan.status === "returned") {
    return {
      label: "Dikembalikan",
      badge:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
  }

  if (dueDate < today) {
    const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
    return {
      label: `Terlambat ${daysOverdue} hari`,
      badge: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
  }

  return {
    label: "Dipinjam",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  };
};

export const calculateFine = (loan, finePerDay = 1000) => {
  if (loan.status === "returned") return 0;
  
  const today = new Date();
  const dueDate = new Date(loan.due_date);
  
  if (dueDate >= today) return 0;
  
  const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
  return daysOverdue * finePerDay;
};