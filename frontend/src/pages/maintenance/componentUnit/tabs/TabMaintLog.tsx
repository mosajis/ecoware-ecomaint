import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "../../maintLog/MaintLogTabs";
import { useCallback, useState } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { columns } from "../../maintLog/MaintLogColumns";
import {
  tblMaintLog,
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import Splitter from "@/shared/components/Splitter/Splitter";

interface Props {
  componentUnit?: TypeTblComponentUnit;
  label?: string;
}

const getRowId = (row: TypeTblMaintLog) => row.maintLogId;

const TabMaintLog = ({ componentUnit, label }: Props) => {
  const [selectedRow, setSelectedRow] = useState<TypeTblMaintLog | null>(null);

  const compId = componentUnit?.compId;

  const getAll = useCallback(() => {
    return tblMaintLog.getAll({
      filter: {
        compId,
      },
      include: {
        tblWorkOrder: {
          include: {
            tblDiscipline: true,
          },
        },
        tblFollowStatus: true,
        tblComponentUnit: true,
        tblMaintClass: true,
        tblJobDescription: true,
      },
    });
  }, [compId]);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblMaintLog.getById,
    "maintLogId",
    !!compId,
  );

  const handleRowClick = useCallback((params: any) => {
    setSelectedRow(params.row);
  }, []);

  return (
    <Splitter horizontal>
      <CustomizedDataGrid
        disableEdit
        disableDelete
        disableAdd
        showToolbar
        label="Maintenance Log"
        rows={rows}
        columns={columns}
        loading={loading}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
        onRowClick={handleRowClick}
      />
      <TabsComponent selectedMaintLog={selectedRow} persistInUrl={false} />
    </Splitter>
  );
};

export default TabMaintLog;
