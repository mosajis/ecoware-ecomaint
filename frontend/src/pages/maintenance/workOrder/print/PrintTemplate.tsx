import PrintLayout from "@/shared/components/print/PrintLayout";
import ReportContent from "./PrintContent";
import { ReportHeader } from "./PrintHeader";
import { ReportFooter } from "./PrintFooter";
import { forwardRef } from "react";
import { TypeTblWorkOrderWithRels } from "../types";
import { OutputFormat, SortOrder } from "./PrintTypes";

interface PrintProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const WorkOrderPrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => (
    <PrintLayout
      ref={ref}
      header={
        <ReportHeader
          location="not set"
          title="Work Order Reports"
          totalLength={workOrders.length}
        />
      }
      footer={<ReportFooter printedBy="Not Set" />}
      content={
        <ReportContent
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      }
    />
  ),
);

export default WorkOrderPrintTemplate;
