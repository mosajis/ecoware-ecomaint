import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { TypeTblWorkOrderWithRels } from "../types";
import { OutputFormat, SortOrder } from "./PrintTypes";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { extractFullName } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { atomRig } from "@/shared/atoms/general.atom";

interface PrintProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const PrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => {
    const user = useAtomValue(atomUser);
    const rig = useAtomValue(atomRig);

    return (
      <PrintLayout
        ref={ref}
        header={
          <PrintHeader
            location={rig?.name || "N/A"}
            title="Work Order Reports"
            totalLength={workOrders.length}
          />
        }
        footer={<PrintFooter printedBy={extractFullName(user?.tblEmployee)} />}
        content={
          <PrintContent
            workOrders={workOrders}
            outputFormat={outputFormat}
            sortOrder={sortOrder}
          />
        }
      />
    );
  },
);

export default PrintTemplate;
