import { TypeTblPeriod } from "@/core/api/generated/api";
import { FC } from "react";

type Props = {
  frequency?: number | null;
  frequencyPeriod?: TypeTblPeriod | null;
};

const CellFrequency: FC<Props> = ({ frequency, frequencyPeriod }) => {
  if (frequency == null) return "-";

  const fn = frequencyPeriod?.name || "-";
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "20px" }}>{frequency}</div>
      <div>{fn}</div>
    </div>
  );
};

export default CellFrequency;
