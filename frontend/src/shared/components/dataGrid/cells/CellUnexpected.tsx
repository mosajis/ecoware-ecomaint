import { FC } from "react";

type Props = {
  value?: number | null;
};

export const unexpectedMap = {
  0: "Routine",
  1: "UnPlanned (KPI)",
  2: "UnPlanned (Ignore)",
} as any;

const CellUnexpected: FC<Props> = ({ value }) => {
  return unexpectedMap[value as any] || "-";
};

export default CellUnexpected;
