import { TypeTblWorkOrder } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabPendingDetail = (props: Props) => {
  const { workOrder } = props;

  // @ts-ignore
  const initValue = workOrder?.tblPendingType?.description || "";

  return <Editor initValue={initValue} readOnly={true} />;
};

export default TabPendingDetail;
