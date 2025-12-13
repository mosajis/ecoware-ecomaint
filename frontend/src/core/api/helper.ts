import { format as formatGregorian } from "date-fns";
import { format as formatJalali } from "date-fns-jalali";

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
  sqlDateTime: string,
  isJalali = false,
  pattern?: string
): string {
  const date = new Date(sqlDateTime.replace(" ", "T"));

  return isJalali
    ? formatJalali(date, pattern ?? "yyyy/MM/dd HH:mm")
    : formatGregorian(date, pattern ?? "yyyy/MM/dd HH:mm");
}
