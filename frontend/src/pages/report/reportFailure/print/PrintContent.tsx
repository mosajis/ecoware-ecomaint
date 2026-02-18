import { TypeTblFailureReports } from "@/core/api/generated/api";
import { PrintTable } from "./PrintTable";

interface Props {
  failureReport: TypeTblFailureReports;
}

const PrintContent = ({ failureReport }: Props) => {
  return <PrintTable failureReport={failureReport} />;
};

export default PrintContent;
