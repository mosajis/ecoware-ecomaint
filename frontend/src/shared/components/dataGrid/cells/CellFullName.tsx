import { FC } from "react";
import { TypeTblUsers } from "@/core/api/generated/api";

type CellFullNameProps = {
  value?: TypeTblUsers | null;
};

const CellFullName: FC<CellFullNameProps> = ({ value }) => {
  const employee = value?.tblEmployeeTblUsersEmployeeIdTotblEmployee;
  const fullName = employee
    ? [employee.firstName, employee.lastName].filter(Boolean).join(" ")
    : "";

  return fullName;
};

export default CellFullName;
