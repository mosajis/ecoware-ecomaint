import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import UserGroupUpsert from "./UserGroupUpsert";

import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { useUpsertDialog } from "@/shared/hooks/useUpsertDialog";
import { useCallback, useState } from "react";

import {
  tblUser,
  tblUserGroup,
  TypeTblUser,
  TypeTblUserGroup,
} from "@/core/api/generated/api";

import { columns, getRowId } from "./UserGroupColumns";
import {
  columns as userColumns,
  getRowId as userGetRowId,
} from "@/pages/access/user/UserColumns";

const UserGroups = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const getAllGroups = useCallback(
    () =>
      tblUserGroup.getAll({
        include: {
          tblUserGroupElements: {
            include: { tblElement: true },
          },
        },
      }),
    [],
  );

  const { rows, loading, handleDelete, handleRefresh } =
    useDataGrid<TypeTblUserGroup>(
      getAllGroups,
      tblUserGroup.deleteById,
      "userGroupId",
    );

  const { openCreate, openEdit, openView, dialogProps } = useUpsertDialog({
    onSuccess: handleRefresh,
  });

  const handleRowClick = useCallback(({ row }: { row: TypeTblUserGroup }) => {
    setSelectedGroupId(row.userGroupId);
    setLabel(row.name);
  }, []);

  const getAllUsers = useCallback(
    () =>
      tblUser.getAll({
        filter: {
          userGroupId: selectedGroupId,
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
    [selectedGroupId],
  );

  const {
    rows: userRows,
    loading: userLoading,
    handleRefresh: handleRefreshUsers,
  } = useDataGrid<TypeTblUser>(
    getAllUsers,
    tblUser.deleteById,
    "userId",
    !!selectedGroupId,
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
          onAddClick={openCreate}
          onEditClick={openEdit}
          onDoubleClick={openView}
          onDeleteClick={handleDelete}
          onRefreshClick={handleRefresh}
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
          onRefreshClick={handleRefreshUsers}
        />
      </Splitter>

      <UserGroupUpsert entityName="User Group" {...dialogProps} />
    </>
  );
};

export default UserGroups;
