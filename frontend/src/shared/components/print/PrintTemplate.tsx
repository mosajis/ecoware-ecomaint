import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintHeader from "@/shared/components/print/_components/PrintHeader";
import { forwardRef, ReactNode } from "react";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";

interface PrintProps {
  reportTitle: any;
  content: ReactNode;
}

const PrintTemplate = forwardRef<HTMLDivElement, PrintProps>(
  ({ content, reportTitle }, ref) => {
    return (
      <PrintLayout
        ref={ref}
        header={<PrintHeader reportTitle={reportTitle} />}
        footer={<PrintFooter />}
        content={content}
      />
    );
  },
);

export default PrintTemplate;
