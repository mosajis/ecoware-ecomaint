import { TypeTblFailureReport } from "@/core/api/generated/api";
import { PrintTable } from "./PrintTable";

interface Props {
  failureReport: TypeTblFailureReport;
}

const PrintContent = ({ failureReport }: Props) => {
  return <PrintTable failureReport={failureReport} />;
};

export default PrintContent;
