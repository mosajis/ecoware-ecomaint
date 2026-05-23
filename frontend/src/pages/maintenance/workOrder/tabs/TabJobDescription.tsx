import { TypeTblWorkOrder } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

interface Props {
  workOrder?: TypeTblWorkOrder | null;
  label?: string;
}

const TabJobDescription = ({ workOrder, label }: Props) => {
  const initValue = workOrder?.tblCompJob?.tblJobDescription?.jobDesc || "";

  return (
    <Editor label={label || "Job Description"} initValue={initValue} readOnly />
  );
};

export default TabJobDescription;
