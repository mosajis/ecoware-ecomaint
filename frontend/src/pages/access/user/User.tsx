import DataGrid from "@/shared/components/dataGrid/DataGrid";
import UserUpsert from "./UserUpsert";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblUser, TypeTblUser } from "@/core/api/generated/api";
import { columns, getRowId } from "./UserColumns";
import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";

const Users = () => {
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const getAll = useCallback(
    () =>
      tblUser.getAll({
        include: {
          tblEmployee: {
            include: {
              tblDiscipline: true,
            },
          },
          tblUserGroup: true,
        },
        filter: {
          userId: {
            not: userId,
          },
        },
      }),
    [userId],
  );

  const { rows, loading, handleDelete, handleRefresh } =
    useDataGrid<TypeTblUser>(getAll, tblUser.deleteById, "userId");

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  return (
    <DataGrid
      label="Users"
      elementId={1710}
      showToolbar
      rows={rows}
      columns={columns}
      loading={loading}
      getRowId={getRowId}
      onAddClick={openCreate}
      onEditClick={openEdit}
      onDoubleClick={openView}
      onDeleteClick={handleDelete}
      onRefreshClick={handleRefresh}
    >
      <UserUpsert entityName="User" {...dialogProps} />
    </DataGrid>
  );
};

export default Users;
