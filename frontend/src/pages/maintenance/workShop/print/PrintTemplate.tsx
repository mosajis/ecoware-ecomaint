import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblWorkShop } from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { extractFullName } from "@/core/helper";

interface Props {
  workShop: TypeTblWorkShop;
}

const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ workShop }, ref) => {
  const user = useAtomValue(atomUser);

  return (
    <PrintLayout
      ref={ref}
      header={
        <PrintHeader location="not set" title="WorkShop" totalLength={1} />
      }
      footer={<PrintFooter printedBy={extractFullName(user!)} />}
      content={<PrintContent workShop={workShop} />}
    />
  );
});

export default PrintTemplate;
