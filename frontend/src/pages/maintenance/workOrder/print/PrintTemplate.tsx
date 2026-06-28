import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import PrintHeader from "@/shared/components/print/_components/PrintHeader";
import { forwardRef } from "react";
import { OutputFormat, SortOrder } from "./PrintTypes";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblWorkOrder } from "@/core/api/generated/api";

interface PrintProps {
  workOrders: TypeTblWorkOrder[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const PrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => {
    return (
      <PrintLayout
        ref={ref}
        header={<PrintHeader reportTitle="WorkOrder Report" />}
        footer={<PrintFooter />}
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
