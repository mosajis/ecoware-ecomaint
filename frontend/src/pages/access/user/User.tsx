import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblEmployee, tblUser, TypeTblUser } from "@/core/api/generated/api";
import { columns, getRowId } from "./UserColumns";
import { useCallback } from "react";

const Users = () => {
  const getAll = useCallback(() => tblUser.getAll(), []);

  const { rows, loading, handleRefresh } = useDataGrid<TypeTblUser>(
    getAll,
    tblUser.deleteById,
    "userId",
  );

  return (
    <CustomizedDataGrid
      label="Users"
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default Users;
