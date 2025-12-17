import ReportContent from "./ReportContent";
import Printable from "@/shared/components/printable/Printable";
import { forwardRef } from "react";
import { TypeTblWorkOrderWithRels } from "../types";
import { ReportHeader } from "./ReportHeader";
import { ReportFooter } from "./ReportFooter";
import "./report.css";

type OutputFormat = "list" | "details";
type SortOrder = "component" | "workOrderNumber" | "dueDate";

interface WorkOrderReportProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const ReportWorkOrder = forwardRef<HTMLDivElement, WorkOrderReportProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => (
    <Printable
      pagePadding={11}
      ref={ref}
      Footer={<ReportFooter />}
      Header={
        <ReportHeader title="Work Order Report" total={workOrders.length} />
      }
      Content={
        <ReportContent
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      }
    />
  )
);

export default ReportWorkOrder;
