import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { TypeTblWorkOrderWithRels } from "../types";
import { OutputFormat, SortOrder } from "./PrintTypes";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";

interface PrintProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const PrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => (
    <PrintLayout
      ref={ref}
      header={
        <PrintHeader
          location="not set"
          title="Work Order Reports"
          totalLength={workOrders.length}
        />
      }
      footer={<PrintFooter printedBy="Not Set" />}
      content={
        <PrintContent
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      }
    />
  ),
);

export default PrintTemplate;
