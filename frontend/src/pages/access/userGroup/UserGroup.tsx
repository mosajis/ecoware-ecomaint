import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import UserGroupUpsert from "./UserGroupUpsert";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./UserGroupColumns";
import { useCallback, useState } from "react";
import { useDialogs } from "@/shared/hooks/useDialogs";
import {
  getRowId as userGetRowId,
  columns as userColumns,
} from "@/pages/access/user/UserColumns";
import {
  tblUser,
  tblUserGroup,
  TypeTblUser,
  TypeTblUserGroup,
} from "@/core/api/generated/api";
import { useRouter } from "@tanstack/react-router";
import { routeUserGroupDetail } from "./UserGroupRoutes";

const UserGroups = () => {
  const router = useRouter();

  const [selectedRowId, setSelectedRowId] = useState<null | number>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [mode, setMode] = useState<"create" | "update">("create");

  const { dialogs, openDialog, closeDialog } = useDialogs({
    upsert: false,
  });

  const getAll = useCallback(
    () =>
      tblUserGroup.getAll({
        include: {
          tblUserGroupElements: {
            include: {
              tblElement: true,
            },
          },
          _count: {
            select: { tblUsers: true },
          },
        },
      }),
    [],
  );

  const { rows, loading, handleDelete, handleRefresh } =
    useDataGrid<TypeTblUserGroup>(
      getAll,
      tblUserGroup.deleteById,
      "userGroupId",
    );

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

  const handleRowClick = useCallback(({ row }: { row: TypeTblUserGroup }) => {
    setSelectedRowId(row.userGroupId);
    setLabel(row.name);
  }, []);

  const getAllUsers = useCallback(
    () =>
      tblUser.getAll({
        filter: {
          userGroupId: selectedRowId,
        },
        include: {
          tblEmployee: {
            include: {
              tblDiscipline: true,
            },
          },
          tblUserGroup: true,
        },
      }),
    [selectedRowId],
  );

  const handleRowDoubleClick = useCallback(
    (rowId: number) => {
      const row = rows.find((i) => i.userGroupId === rowId);

      if (!row) return;
      router.navigate({
        to: routeUserGroupDetail.to,
        params: { id: rowId },
        search: { breadcrumb: row?.name },
      });
    },
    [router, rows],
  );

  const {
    rows: userRows,
    loading: userLoading,
    handleRefresh: handleRefreshUser,
  } = useDataGrid<TypeTblUser>(
    getAllUsers,
    tblUserGroup.deleteById,
    "userId",
    !!selectedRowId,
  );

  return (
    <>
      <Splitter horizontal>
        <CustomizedDataGrid
          showToolbar
          label="User Groups"
          elementId={1720}
          rows={rows}
          columns={columns}
          loading={loading}
          onAddClick={handleCreate}
          onRefreshClick={handleRefresh}
          onDeleteClick={handleDelete}
          onEditClick={handleEdit}
          onDoubleClick={handleRowDoubleClick}
          getRowId={getRowId}
          onRowClick={handleRowClick}
        />
        <CustomizedDataGrid
          disableAdd
          disableEdit
          showToolbar
          label={label || "Users"}
          rows={userRows}
          columns={userColumns}
          loading={userLoading}
          getRowId={userGetRowId}
          onRefreshClick={handleRefreshUser}
        />
      </Splitter>

      <UserGroupUpsert
        open={dialogs.upsert}
        mode={mode}
        recordId={selectedRowId}
        onClose={() => {
          closeDialog("upsert");
          handleRefresh();
        }}
        onSuccess={handleRefresh}
      />
    </>
  );
};

export default UserGroups;
