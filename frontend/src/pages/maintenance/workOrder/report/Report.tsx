import { forwardRef, ReactNode } from "react";

// ============================================================================
// TYPES
// ============================================================================

interface TypeTblLocation {
  name?: string;
}

interface TypeTblComponentUnit {
  compNo?: string;
  serialNo?: string;
  isCritical?: boolean;
  tblLocation?: TypeTblLocation;
}

interface TypeTblPeriod {
  name?: string;
}

interface TypeTblJobDescription {
  jobDescCode?: string;
  jobDesc?: string;
}

interface TypeTblCompJob {
  frequency?: number;
  tblPeriod?: TypeTblPeriod;
  tblJobDescription?: TypeTblJobDescription;
}

interface TypeTblDiscipline {
  name?: string;
}

interface TypeTblPendingType {
  pendTypeName?: string;
  description?: string;
}

interface TypeTblUsers {
  uName?: string;
}

interface TypeTblWorkOrderWithRels {
  workOrderId: string;
  title?: string;
  woNo?: string;
  priority?: number;
  dueDate?: string;
  completed?: string;
  pendingdate?: string;
  tblComponentUnit?: TypeTblComponentUnit;
  tblDiscipline?: TypeTblDiscipline;
  tblCompJob?: TypeTblCompJob;
  tblPendingType?: TypeTblPendingType;
  usersTblWorkOrderPlannedByToUsers?: TypeTblUsers;
}

interface WorkOrderData {
  title?: string;
  plannedBy?: string;
  component?: string;
  dueDate?: string;
  location?: string;
  lastDone?: string;
  discipline?: string;
  frequency?: number;
  frequencyPeriod?: string;
  priority?: number;
  overDue: number;
  woNo?: string;
  jobCode?: string;
  serialNo?: string;
  isCritical?: boolean;
  jobDesc?: string;
  pendType?: string;
  pendDate?: string;
  pendDesc?: string;
}

type OutputFormat = "list" | "details";
type SortOrder = "component" | "workOrderNumber" | "dueDate";

interface WorkOrderReportProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

// ============================================================================
// HELPERS
// ============================================================================

const val = (v?: string | number | null): string => v ?? "-";

const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US");
};

const calculateOverdue = (wo: TypeTblWorkOrderWithRels): number => {
  if (!wo.dueDate) return 0;
  const days = Math.floor(
    (new Date(wo.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return days;
};

const extractWorkOrderData = (wo: TypeTblWorkOrderWithRels): WorkOrderData => ({
  title: wo.title,
  plannedBy: wo.usersTblWorkOrderPlannedByToUsers?.uName,
  component: wo.tblComponentUnit?.compNo,
  dueDate: wo.dueDate,
  location: wo.tblComponentUnit?.tblLocation?.name,
  lastDone: wo.completed,
  discipline: wo.tblDiscipline?.name,
  frequency: wo.tblCompJob?.frequency,
  frequencyPeriod: wo.tblCompJob?.tblPeriod?.name,
  priority: wo.priority,
  overDue: calculateOverdue(wo),
  woNo: wo.woNo,
  jobCode: wo.tblCompJob?.tblJobDescription?.jobDescCode,
  serialNo: wo.tblComponentUnit?.serialNo,
  isCritical: wo.tblComponentUnit?.isCritical,
  jobDesc: wo.tblCompJob?.tblJobDescription?.jobDesc,
  pendType: wo.tblPendingType?.pendTypeName,
  pendDate: wo.pendingdate,
  pendDesc: wo.tblPendingType?.description,
});

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
    dueDate: (a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""),
  };

  return [...workOrders].sort(comparators[sortOrder] || (() => 0));
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

interface WorkOrderHeaderProps {
  data: WorkOrderData;
}

const WorkOrderHeader = ({ data }: WorkOrderHeaderProps): ReactNode => (
  <tr style={{ backgroundColor: "#fcf6d3" }}>
    <td className="label">Title</td>
    <td colSpan={3}>{val(data.title)}</td>
    <td className="label">PlannedBy</td>
    <td>{val(data.plannedBy)}</td>
  </tr>
);

interface WorkOrderMainInfoProps {
  data: WorkOrderData;
}

const WorkOrderMainInfo = ({ data }: WorkOrderMainInfoProps): ReactNode => (
  <>
    <tr>
      <td className="label">Component</td>
      <td>{val(data.component)}</td>
      <td className="label">Due Date</td>
      <td>{data.dueDate ? formatDateTime(data.dueDate) : "-"}</td>
      <td className="label">Discipline</td>
      <td>{val(data.discipline)}</td>
    </tr>
    <tr>
      <td className="label">Location</td>
      <td>{val(data.location)}</td>
      <td className="label">Last Done</td>
      <td>{data.lastDone ? formatDateTime(data.lastDone) : "-"}</td>
      <td className="label">Frequency</td>
      <td>
        {val(data.frequency)} {val(data.frequencyPeriod)}
      </td>
    </tr>
    <tr>
      <td className="label">Priority</td>
      <td>{val(data.priority)}</td>
      <td className="label">Over Due</td>
      <td
        style={{ color: data.overDue < 0 ? "red" : "green", fontWeight: 600 }}
      >
        {data.overDue}
      </td>
      <td className="label">WO No</td>
      <td>{val(data.woNo)}</td>
    </tr>
    <tr>
      <td className="label">Job Code</td>
      <td>{val(data.jobCode)}</td>
      <td className="label">Serial</td>
      <td>{val(data.serialNo)}</td>
      <td className="label">is Critical</td>
      <td>{data.isCritical ? "Yes" : "No"}</td>
    </tr>
  </>
);

interface WorkOrderDetailsProps {
  data: WorkOrderData;
}

const WorkOrderDetails = ({ data }: WorkOrderDetailsProps): ReactNode => (
  <>
    <tr>
      <td className="label">Job Description</td>
      <td colSpan={5}>{val(data.jobDesc)}</td>
    </tr>
    <tr>
      <td className="label">Pend Type</td>
      <td colSpan={3}>{val(data.pendType)}</td>
      <td className="label">Pend Date</td>
      <td>{data.pendDate ? formatDateTime(data.pendDate) : "-"}</td>
    </tr>
    <tr>
      <td className="label">Pend Description</td>
      <td colSpan={5}>{val(data.pendDesc)}</td>
    </tr>
  </>
);

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

interface WorkOrderBoxProps {
  workorder: TypeTblWorkOrderWithRels;
  outputFormat: OutputFormat;
}

const WorkOrderBox = ({
  workorder,
  outputFormat,
}: WorkOrderBoxProps): ReactNode => {
  const data = extractWorkOrderData(workorder);

  return (
    <table className="template-workorder-box">
      <tbody>
        <WorkOrderHeader data={data} />
        <WorkOrderMainInfo data={data} />
        {outputFormat === "details" && <WorkOrderDetails data={data} />}
      </tbody>
    </table>
  );
};

interface HeaderProps {
  total: number;
}

const Header = ({ total }: HeaderProps): ReactNode => (
  <div className="template-workorder-header">
    <h1>Ecoware (Preventive Maintenance System)</h1>
    <div>
      <strong>Printed At:</strong> {formatDateTime(new Date().toISOString())}
    </div>
    <h3>Work Order Report</h3>
    <div>
      <strong>Total WorkOrders:</strong> {total}
    </div>
  </div>
);

const Footer = (): ReactNode => (
  <div className="template-workorder-footer">
    <div>
      <strong>Printed At:</strong> {formatDateTime(new Date().toISOString())}
    </div>
    <div>
      <strong>Printed By:</strong> Administrator
    </div>
  </div>
);

interface ContentProps {
  workOrders: TypeTblWorkOrderWithRels[];
  outputFormat: OutputFormat;
  sortOrder: SortOrder;
}

const Content = ({
  workOrders,
  outputFormat,
  sortOrder,
}: ContentProps): ReactNode => {
  const sorted = sortWorkOrders(workOrders, sortOrder);

  return (
    <div className="template-workorder-box-parent">
      {sorted.map((wo) => (
        <WorkOrderBox
          key={wo.workOrderId}
          workorder={wo}
          outputFormat={outputFormat}
        />
      ))}
    </div>
  );
};

// ============================================================================
// EXPORTED COMPONENT
// ============================================================================

const WorkOrderReport = forwardRef<HTMLDivElement, WorkOrderReportProps>(
  ({ workOrders, outputFormat, sortOrder }, ref) => (
    <div ref={ref} style={{ pageBreakAfter: "always" }}>
      <Header total={workOrders.length} />
      <Content
        workOrders={workOrders}
        outputFormat={outputFormat}
        sortOrder={sortOrder}
      />
      <Footer />
    </div>
  )
);

WorkOrderReport.displayName = "WorkOrderReport";

export default WorkOrderReport;
