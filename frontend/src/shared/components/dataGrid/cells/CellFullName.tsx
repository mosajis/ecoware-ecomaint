import { TypeTblEmployee } from "@/core/api/generated/api";
import { extractFullName } from "@/core/helper";
import { FC } from "react";

type Props = {
  value: TypeTblEmployee;
};

const CellFullName: FC<Props> = ({ value }) => {
  if (!value) return "";

  return extractFullName(value);
};

export default CellFullName;
