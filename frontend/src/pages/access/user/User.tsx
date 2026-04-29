import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import UserUpsert from "./UserUpsert";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblEmployee, tblUser, TypeTblUser } from "@/core/api/generated/api";
import { columns, getRowId } from "./UserColumns";
import { useCallback, useState } from "react";
import { useDialogs } from "@/shared/hooks/useDialogs";
import { useAtom, useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

const Users = () => {
  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [mode, setMode] = useState<"create" | "update">("create");

  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

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
    [],
  );

  const { rows, loading, handleDelete, handleRefresh } =
    useDataGrid<TypeTblUser>(getAll, tblUser.deleteById, "userId");

  const handleCreate = useCallback(() => {
    setSelectedRowId(null);
    setMode("create");
    openDialog("upsert");
  }, []);

  const handleEdit = useCallback((rowId: number) => {
    setSelectedRowId(rowId);
    setMode("update");
    openDialog("upsert");
  }, []);

  return (
    <>
      <CustomizedDataGrid
        label="Users"
        elementId={1710}
        showToolbar
        rows={rows}
        columns={columns}
        loading={loading}
        onAddClick={handleCreate}
        onRefreshClick={handleRefresh}
        onDeleteClick={handleDelete}
        onEditClick={handleEdit}
        onDoubleClick={handleEdit}
        getRowId={getRowId}
      />

      <UserUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => closeDialog("upsert")}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default Users;
