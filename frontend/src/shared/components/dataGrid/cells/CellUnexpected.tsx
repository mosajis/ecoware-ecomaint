import { TypeTblEmployee } from "@/core/api/generated/api";
import { FC } from "react";

type Props = {
  value?: number | null;
};

const unexpected = {
  0: "Routine",
  1: "UnPlanned (KPI)",
  2: "UnPlanned (Ignore)",
} as any;

const CellUnexpected: FC<Props> = ({ value }) => {
  return unexpected[value as any] || "-";
};

export default CellUnexpected;
