import { TypeTblWorkOrderWithRels } from "../types";
import ReportTable from "./ReportTable";

type OutputFormat = "list" | "details";
type SortOrder = "component" | "workOrderNumber" | "dueDate";

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
    dueDate: (a, b) =>
      ((a.dueDate as any) ?? "").localeCompare(b.dueDate ?? ""),
  };

  return [...workOrders].sort(comparators[sortOrder] || (() => 0));
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

  return (
    <div className="template-workorder-box-parent">
      {sorted.map((wo) => (
        <ReportTable
          workorder={wo}
          key={wo.workOrderId}
          outputFormat={outputFormat}
        />
      ))}
    </div>
  );
};

export default ReportContent;
