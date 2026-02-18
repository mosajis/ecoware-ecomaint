import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblFailureReports } from "@/core/api/generated/api";

interface Props {
  failureReport: TypeTblFailureReports;
}

const PrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ failureReport }, ref) => (
    <PrintLayout
      ref={ref}
      header={
        <PrintHeader
          location="not set"
          title="Failure Report"
          totalLength={1}
        />
      }
      footer={<PrintFooter printedBy="Not Set" />}
      content={<PrintContent failureReport={failureReport} />}
    />
  ),
);

export default PrintTemplate;
