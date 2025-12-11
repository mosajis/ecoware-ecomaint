import { TypeTblWorkOrder } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string | null;
}

const TabJobDescription = (props: Props) => {
  const { workOrder } = props;

  // @ts-ignore
  const initValue = workOrder?.tblCompJob?.tblJobDescription?.jobDesc || "";

  return <Editor initValue={initValue} readOnly={true} />;
};

export default TabJobDescription;
