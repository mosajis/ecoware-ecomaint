import PrintLayout from "@/shared/components/print/PrintLayout";
import PrintContent from "./PrintContent";
import { forwardRef } from "react";
import { PrintHeader } from "@/shared/components/print/_components/PrintHeader";
import { PrintFooter } from "@/shared/components/print/_components/PrintFooter";
import { TypeTblWorkShop } from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";
import { extractFullName } from "@/core/helper";
import { atomRig } from "@/shared/atoms/general.atom";

interface Props {
  workShop: TypeTblWorkShop;
}

const PrintTemplate = forwardRef<HTMLDivElement, Props>(({ workShop }, ref) => {
  const user = useAtomValue(atomUser);
  const rig = useAtomValue(atomRig);
  const employee = user?.tblEmployee;

  return (
    <PrintLayout
      ref={ref}
      header={
        <PrintHeader location={rig?.name!} title="WorkShop" totalLength={1} />
      }
      footer={<PrintFooter printedBy={extractFullName(employee!)} />}
      content={<PrintContent workShop={workShop} />}
    />
  );
});

export default PrintTemplate;
