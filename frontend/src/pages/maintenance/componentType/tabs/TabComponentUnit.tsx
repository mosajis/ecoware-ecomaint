import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import { useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { GridColDef } from "@mui/x-data-grid";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
  TypeTblCompType,
} from "@/core/api/generated/api";
import { columns, getRowId } from "./TabComponentUnitColumn";

type Props = {
  compType?: TypeTblCompType;
  label?: string;
};

const TabComponentUnit = ({ compType, label }: Props) => {
  const compTypeId = compType?.compTypeId;

  // === getAll callback ===
  const getAll = useCallback(() => {
    return tblComponentUnit.getAll({
      filter: {
        compTypeId: compTypeId,
      },
      include: {
        tblLocation: true,
        tblCompType: true,
      },
    });
  }, [compTypeId]);

  // === useDataGrid ===
  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblComponentUnit.deleteById,
    "compId",
    !!compTypeId,
  );

  return (
    <CustomizedDataGrid
      disableEdit
      disableDelete
      disableAdd
      disableRowNumber
      label={label}
      showToolbar={!!label}
      rows={rows}
      columns={columns}
      loading={loading}
      onRefreshClick={handleRefresh}
      getRowId={getRowId}
    />
  );
};

export default TabComponentUnit;
