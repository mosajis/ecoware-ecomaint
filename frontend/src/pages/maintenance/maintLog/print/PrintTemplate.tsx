import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintTable from "./PrintTable";
import { forwardRef } from "react";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { extractFullName } from "@/core/helper";

interface Props {
  rows: TypeTblMaintLog[];
}

const MaintLogPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ rows }, ref) => {
    const user = useAtomValue(atomUser);

    return (
      <PrintLayout
        ref={ref}
        header={
          <PrintHeader
            location="o3"
            title="Maintenance Log Report"
            totalLength={rows.length}
          />
        }
        footer={<PrintFooter printedBy={extractFullName(user!)} />}
        content={rows.map((row) => (
          <PrintTable key={row.maintLogId} row={row} />
        ))}
      />
    );
  },
);

export default MaintLogPrintTemplate;
