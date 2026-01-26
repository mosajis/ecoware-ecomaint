import Editor from "@/shared/components/Editor";
import { TypeTblWorkOrderWithRels } from "../types";

interface Props {
  workOrder?: TypeTblWorkOrderWithRels | null;
  label?: string | null;
}

const TabPendingDetail = ({ workOrder, label }: Props) => {
  // @ts-ignore
  const initValue = workOrder?.tblPendingType?.description || "";

  return <Editor label="Pending Detail" initValue={initValue} readOnly />;
};

export default TabPendingDetail;
