import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblFailureReports } from "@/core/api/generated/api";
import { atomUser } from "@/pages/auth/auth.atom";
import { useAtomValue } from "jotai";
import { extractFullName } from "@/core/helper";
import { atomRig } from "@/shared/atoms/general.atom";

interface Props {
  failureReport: TypeTblFailureReports;
}

const PrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ failureReport }, ref) => {
    const user = useAtomValue(atomUser);

    const rig = useAtomValue(atomRig);

    return (
      <PrintLayout
        ref={ref}
        header={
          <PrintHeader
            location={rig?.name || "N/A"}
            title="Failure Report"
            totalLength={1}
          />
        }
        footer={<PrintFooter printedBy={extractFullName(user?.tblEmployee)} />}
        content={<PrintContent failureReport={failureReport} />}
      />
    );
  },
);

export default PrintTemplate;
