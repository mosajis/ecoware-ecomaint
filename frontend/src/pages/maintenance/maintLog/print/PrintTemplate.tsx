import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintTable from "./PrintTable";
import { forwardRef } from "react";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";

interface Props {
  rows: TypeTblMaintLog[];
}

const MaintLogPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ rows }, ref) => (
    <PrintLayout
      ref={ref}
      header={
        <PrintHeader
          location="not set"
          title="Maintenance Log Report"
          totalLength={rows.length}
        />
      }
      footer={<PrintFooter printedBy="Not Set" />}
      content={rows.map((row) => (
        <PrintTable key={row.maintLogId} row={row} />
      ))}
    />
  ),
);

export default MaintLogPrintTemplate;
