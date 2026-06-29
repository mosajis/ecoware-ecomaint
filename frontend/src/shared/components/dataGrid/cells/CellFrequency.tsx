import { TypeTblPeriod } from "@/core/api/generated/api";

type Props = {
  frequency?: number | null;
  frequencyPeriod?: TypeTblPeriod | null;
};

const CellFrequency = ({ frequency, frequencyPeriod }: Props): string => {
  if (frequency == null) return "-";

  return `${frequency || ""} ${frequencyPeriod?.name || ""}`;
};

export default CellFrequency;
