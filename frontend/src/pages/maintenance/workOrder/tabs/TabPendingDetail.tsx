import { TypeTblWorkOrder } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabPendingDetail = ({ workOrder, label }: Props) => {
  const initValue = workOrder?.userComment || "";

  return (
    <Editor label={label || "Pending Detail"} initValue={initValue} readOnly />
  );
};

export default TabPendingDetail;
