import { FC } from "react";
import Box from "@mui/material/Box";
import { TypeTblUsers } from "@/core/api/generated/api";

type CellFullNameProps = {
  value?: TypeTblUsers | null;
};

const CellFullName: FC<CellFullNameProps> = ({ value }) => {
  const employee = value?.tblEmployeeTblUsersEmployeeIdTotblEmployee;
  const fullName = employee
    ? [employee.firstName, employee.lastName].filter(Boolean).join(" ")
    : "";

  return <Box>{fullName}</Box>;
};

export default CellFullName;
