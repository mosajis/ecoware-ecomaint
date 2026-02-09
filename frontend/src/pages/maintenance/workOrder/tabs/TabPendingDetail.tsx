import Editor from "@/shared/components/Editor";
import { TypeTblWorkOrderWithRels } from "../types";

interface Props {
  workOrder?: TypeTblWorkOrderWithRels | null;
  label?: string | null;
}

const TabPendingDetail = ({ workOrder, label }: Props) => {
  const initValue = workOrder?.userComment || "";

  return (
    <Editor label={label || "Pending Detail"} initValue={initValue} readOnly />
  );
};

export default TabPendingDetail;
