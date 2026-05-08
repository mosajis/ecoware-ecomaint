import Splitter from "@/shared/components/Splitter/Splitter";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import TabsComponent from "./RoundTabs";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblRound } from "@/core/api/generated/api";
import { columns, getRowId } from "./RoundColumns";

export default function RoundPage() {
  const { rows, loading, handleRefresh } = useDataGrid(
    tblRound.getAll,
    tblRound.deleteById,
    "roundId",
  );

  return (
    <Splitter horizontal initialPrimarySize="50%" minPrimarySize="200px">
      <CustomizedDataGrid
        showToolbar
        loading={loading}
        label="Rounds"
        elementId={1350}
        rows={rows}
        onRefreshClick={handleRefresh}
        columns={columns}
        getRowId={getRowId}
      />
      <TabsComponent />
    </Splitter>
  );
}
