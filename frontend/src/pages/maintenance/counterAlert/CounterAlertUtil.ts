import { CounterAlert } from "./tabs/TabCounterAlertType";

export const getRowId = (row: CounterAlert) => row.info.compJobCounterId;

export const calculateProgress = (
  start: number | null | undefined,
  current: number | null | undefined,
  end: number | null | undefined,
) => {
  if (start == null || current == null || end == null) return 0;

  const total = end - start;
  const progress = current - start;

  if (total <= 0) return 100;

  const percentage = (progress / total) * 100;

  return Math.min(Math.max(percentage, 0), 100);
};
