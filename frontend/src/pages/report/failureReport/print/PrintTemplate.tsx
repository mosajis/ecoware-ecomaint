import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import PrintHeader from "@/shared/components/print/_components/PrintHeader";
import { forwardRef } from "react";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblFailureReport } from "@/core/api/generated/api";
import { atomUser } from "@/pages/auth/auth.atom";
import { useAtomValue } from "jotai";
import { extractFullName } from "@/core/helper";
import { atomRig } from "@/shared/atoms/general.atom";

interface Props {
  failureReport: TypeTblFailureReport;
}

const PrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ failureReport }, ref) => {
    const user = useAtomValue(atomUser);

    const rig = useAtomValue(atomRig);

    return (
      <PrintLayout
        ref={ref}
        header={<PrintHeader reportTitle="Failure Report" />}
        footer={<PrintFooter />}
        content={<PrintContent failureReport={failureReport} />}
      />
    );
  },
);

export default PrintTemplate;
