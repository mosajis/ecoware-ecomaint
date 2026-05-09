import Splitter from "@/shared/components/Splitter/Splitter";
import Editor from "@/shared/components/Editor";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CustomizedDataGrid from "@/shared/components/dataGrid/DataGrid";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useCallback } from "react";
import { useDataGrid } from "@/shared/hooks/useDataGrid";
import { tblCompJob, TypeTblCompJob } from "@/core/api/generated/api";
import { GridColDef } from "@mui/x-data-grid";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { generateWorkOrder } from "@/core/api/api";
import { toast } from "sonner";
import { columns, getRowId } from "./ComponentJobColumns";

export default function PageComponentJob() {
  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  const [selected, setSelected] = useState<TypeTblCompJob | null>(null);

  const getAll = useCallback(() => {
    return tblCompJob.getAll({
      include: {
        tblComponentUnit: {
          include: {
            tblCompType: true,
          },
        },
        tblJobDescription: true,
        tblPeriod: true,
        tblDiscipline: true,
      },
    });
  }, []);

  const { rows, loading, handleRefresh } = useDataGrid(
    getAll,
    tblCompJob.deleteById,
    "compJobId",
  );

  const handleRowClick = useCallback((params: any) => {
    setSelected(params.row);
  }, []);

  const onGenerateWorkOrder = async () => {
    generateWorkOrder(userId)
      .then((res) => {
        toast.success(`Generated SuccessFuly (${res.createdWorkOrders})`);
      })
      .catch(() => {
        toast.error("Faild Generation");
      });
  };

  return (
    <Splitter initialPrimarySize="70%" horizontal>
      <CustomizedDataGrid
        disableAdd
        disableEdit
        disableDelete
        disableRowNumber
        showToolbar
        label="Component Job"
        elementId={1330}
        rows={rows}
        loading={loading}
        columns={columns}
        onRefreshClick={handleRefresh}
        getRowId={getRowId}
        onRowClick={handleRowClick}
        toolbarChildren={
          <Button
            onClick={onGenerateWorkOrder}
            variant="contained"
            size="small"
          >
            Generate Work Order
          </Button>
        }
      />

      <Editor
        readOnly
        label={selected?.tblJobDescription?.jobDescTitle || "Job Description"}
        key={selected?.compJobId}
        initValue={selected?.tblJobDescription?.jobDesc}
      />
    </Splitter>
  );
}
