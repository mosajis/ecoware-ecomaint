import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintTable from "./PrintTable";
import PrintHeader from "@/shared/components/print/_components/PrintHeader";
import { forwardRef } from "react";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";

interface Props {
  rows: TypeTblMaintLog[];
}

const MaintLogPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ rows }, ref) => {
    return (
      <PrintLayout
        ref={ref}
        header={<PrintHeader reportTitle="MaintLog Report" />}
        footer={<PrintFooter />}
        content={rows.map((row) => (
          <PrintTable key={row.maintLogId} row={row} />
        ))}
      />
    );
  },
);

export default MaintLogPrintTemplate;
