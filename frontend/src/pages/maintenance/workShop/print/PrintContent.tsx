import { TypeTblWorkShop } from "@/core/api/generated/api";
import { PrintTable } from "./PrintTable";

interface Props {
  workShop: TypeTblWorkShop;
}

const PrintContent = ({ workShop }: Props) => {
  return <PrintTable workShop={workShop} />;
};

export default PrintContent;
