import { TypeTblWorkOrderWithRels } from "../types";
import ReportTable from "./ReportTable";

export type OutputFormat = "list" | "details";
export type SortOrder = "component" | "workOrderNumber" | "dueDate";

const sortWorkOrders = (
  workOrders: TypeTblWorkOrderWithRels[],
  sortOrder: SortOrder
): TypeTblWorkOrderWithRels[] => {
  const comparators: Record<
    SortOrder,
    (a: TypeTblWorkOrderWithRels, b: TypeTblWorkOrderWithRels) => number
  > = {
    component: (a, b) =>
      (a.tblComponentUnit?.compNo ?? "").localeCompare(
        b.tblComponentUnit?.compNo ?? ""
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

interface ContentProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const ReportContent = ({
  workOrders,
  outputFormat,
  sortOrder,
}: ContentProps) => {
  const sorted = sortWorkOrders(workOrders, sortOrder);

  return sorted.map((wo) => (
    <ReportTable
      workorder={wo}
      key={wo.workOrderId}
      outputFormat={outputFormat}
    />
  ));
};

export default ReportContent;
