import PrintTable from "./PrintTable";
import { TypeTblWorkOrderWithRels } from "../types";
import { OutputFormat, SortOrder } from "./PrintTypes";

const sortWorkOrders = (
  workOrders: TypeTblWorkOrderWithRels[],
  sortOrder: SortOrder,
): TypeTblWorkOrderWithRels[] => {
  const comparators: Record<
    SortOrder,
    (a: TypeTblWorkOrderWithRels, b: TypeTblWorkOrderWithRels) => number
  > = {
    component: (a, b) =>
      (a.tblComponentUnit?.compNo ?? "").localeCompare(
        b.tblComponentUnit?.compNo ?? "",
      ),
    workOrderNumber: (a, b) => (a.woNo ?? "").localeCompare(b.woNo ?? ""),
    dueDate: (a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateA - dateB;
    },
  };

  return [...workOrders].sort(comparators[sortOrder]);
};

interface Props {
  workOrders: TypeTblWorkOrderWithRels[];
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
