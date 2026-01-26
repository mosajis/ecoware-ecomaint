import ReportContent, { OutputFormat, SortOrder } from "./ReportContent";
import Printable from "@/shared/components/printable/Printable";
import { forwardRef } from "react";
import { TypeTblWorkOrderWithRels } from "../types";
import { ReportHeader } from "./ReportHeader";
import { ReportFooter } from "./ReportFooter";
import "./report.css";

interface WorkOrderReportProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const Report = forwardRef<HTMLDivElement, WorkOrderReportProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => (
    <Printable
      footerHeight={45}
      headerHeight={100}
      pagePadding={11}
      ref={ref}
      Footer={<ReportFooter printedBy="Not Set" />}
      Header={
        <ReportHeader
          location="not set"
          title="Work Order Reports"
          totalLength={5}
        />
      }
      Content={
        <ReportContent
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      }
    />
  ),
);

export default Report;
