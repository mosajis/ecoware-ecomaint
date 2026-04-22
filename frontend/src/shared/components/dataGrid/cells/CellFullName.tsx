import { TypeTblEmployee } from "@/core/api/generated/api";
import { FC } from "react";

type Props = {
  value?: TypeTblEmployee | null;
};

const CellFullName: FC<Props> = ({ value }) => {
  const fullName = value
    ? [value.firstName, value.lastName].filter(Boolean).join(" ")
    : "";

  return fullName;
};

export default CellFullName;
