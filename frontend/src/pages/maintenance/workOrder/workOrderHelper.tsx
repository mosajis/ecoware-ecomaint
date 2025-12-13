import { TypeTblWorkOrder } from "@/core/api/generated/api";

export const calculateOverdue = (row: TypeTblWorkOrder) => {
  const status = row?.tblWorkOrderStatus?.name?.toLowerCase();

  const dueDate = row?.dueDate;

  if (
    dueDate == null ||
    (typeof dueDate !== "string" &&
      typeof dueDate !== "number" &&
      !(dueDate instanceof Date))
  ) {
    return "";
  }

  if (!status || ["complete", "control"].includes(status)) {
    const due = new Date(dueDate);
    const completed = new Date(row.completed as any);

    const diffDays = Math.round(
      (due.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays;
  }

  const due = new Date(dueDate);
  if (isNaN(due.getTime())) return "";

  const now = new Date();
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diffDays;
};
