import { format as formatGregorian } from "date-fns";
import { format as formatJalali } from "date-fns-jalali";
import { TypeTblWorkOrder } from "./generated/api";

export function buildRelation(
  relationName: string,
  idField: string,
  id: number | null | undefined
) {
  if (id == null) {
    return {};
  }

  return {
    [relationName]: {
      connect: { [idField]: id },
    },
  };
}

export function formatDateTime(
  dateTime: string | Date | number,
  isJalali?: boolean,
  pattern?: string
): string {
  const useJalali =
    typeof isJalali === "boolean"
      ? isJalali
      : localStorage.getItem("language") === "fa";

  if (typeof dateTime === "string") {
    dateTime = dateTime.replace(" ", "T");
  }

  const date = new Date(dateTime);

  return useJalali
    ? formatJalali(date, pattern ?? "yyyy/MM/dd HH:mm")
    : formatGregorian(date, pattern ?? "yyyy/MM/dd HH:mm");
}

export const calculateOverdue = (row: TypeTblWorkOrder) => {
  const status = row?.tblWorkOrderStatus?.name?.toLowerCase();

  const dueDate = row?.dueDate;

  if (
    dueDate == null ||
    (typeof dueDate !== "string" &&
      typeof dueDate !== "number" &&
      !(dueDate instanceof Date))
  ) {
    return "-";
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

export const val = (v?: string | number | null) => v ?? "-";
