import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import Splitter from "@/shared/components/Splitter/Splitter";
import AttachmentMap from "@/shared/tabs/attachmentMap/AttachmentMap";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns, getRowId } from "./TabWorkShopColumns";
import {
  tblWorkShop,
  tblWorkShopAttachment,
  tblWorkShopComponent,
  TypeTblComponentUnit,
  TypeTblWorkShop,
} from "@/core/api/generated/api";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

export default function PageWorkShop({ componentUnit }: Props) {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const getAll = useCallback(
    () =>
      tblWorkShopComponent.getAll({
        filter: {
          compId: componentUnit?.compId ?? undefined,
        },
        include: {
          tblWorkShop: {
            include: {
              tblDiscipline: true,
              tblUsersTblWorkShopPersonInChargeIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
              tblUsersTblWorkShopClosedByIdTotblUsers: {
                include: {
                  tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
                },
              },
            },
          },
        },
      }),
    [],
  );

  const { rows, loading, handleRefresh, handleDelete } = useDataGrid(
    getAll,
    tblWorkShop.deleteById,
    "workShopId",
  );

  const handleRowClick = useCallback(
    ({ row }: { row: TypeTblWorkShop }) => {
      if (row.workShopId === selectedRowId) {
        setSelectedRowId(null);
        setSelectedLabel(null);
        return;
      }
      setSelectedRowId(row.workShopId);
      setSelectedLabel(row.workShopNo ?? null);
    },
    [selectedRowId],
  );

  return (
    <>
      <Splitter horizontal initialPrimarySize="65%">
        <CustomizedDataGrid
          disableAdd
          disableEdit
          disableDelete
          showToolbar
          disableRowNumber
          label="WorkShop"
          loading={loading}
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          onRefreshClick={handleRefresh}
          onDeleteClick={handleDelete}
          onRowClick={handleRowClick}
        />
        <AttachmentMap
          label={selectedLabel || "WorkShop Attachments"}
          mapService={tblWorkShopAttachment}
          filterId={selectedRowId}
          filterKey="workShopId"
          relName="tblWorkShop"
          tableId="workShopAttachmentId"
        />
      </Splitter>
    </>
  );
}
