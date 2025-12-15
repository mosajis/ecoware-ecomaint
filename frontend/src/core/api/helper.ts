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
  isJalali?: boolean,
  pattern?: string
): string {
  const useJalali =
    typeof isJalali === "boolean"
      ? isJalali
      : localStorage.getItem("language") === "fa";

  const date = new Date(sqlDateTime.replace(" ", "T"));

  return useJalali
    ? formatJalali(date, pattern ?? "yyyy/MM/dd HH:mm")
    : formatGregorian(date, pattern ?? "yyyy/MM/dd HH:mm");
}
