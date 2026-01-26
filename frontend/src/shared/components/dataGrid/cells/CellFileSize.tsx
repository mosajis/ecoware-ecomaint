import { formatFileSize } from "@/core/helper";
import { FC } from "react";

type CellFileSizeProps = {
  value?: number | null;
};

const CellFileSize: FC<CellFileSizeProps> = ({ value }) => {
  if (value == null) return "-";

  const formatted = formatFileSize(value);

  return formatted;
};

export default CellFileSize;
