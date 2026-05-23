import { TypeTblWorkOrder } from "@/core/api/generated/api";
import PrintTable from "./PrintTable";
import { OutputFormat, SortOrder } from "./PrintTypes";

const toStr = (v: unknown) => (typeof v === "string" ? v : "");
const sortWorkOrders = (
  workOrders: TypeTblWorkOrder[],
  sortOrder: SortOrder,
): TypeTblWorkOrder[] => {
  const comparators: Record<
    SortOrder,
    (a: TypeTblWorkOrder, b: TypeTblWorkOrder) => number
  > = {
    component: (a, b) =>
      (a.tblComponentUnit?.compNo ?? "").localeCompare(
        b.tblComponentUnit?.compNo ?? "",
      ),
    workOrderNumber: (a, b) => toStr(a.woNo).localeCompare(toStr(b.woNo)),
    dueDate: (a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    },
  };

  return [...workOrders].sort(comparators[sortOrder]);
};

interface Props {
  workOrders: TypeTblWorkOrder[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const PrintContent = ({ workOrders, outputFormat, sortOrder }: Props) => {
  const sorted = sortWorkOrders(workOrders, sortOrder);

  return sorted.map((wo) => (
    <PrintTable
      workorder={wo}
      key={wo.workOrderId}
      outputFormat={outputFormat}
    />
  ));
};

export default PrintContent;
