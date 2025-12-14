import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { formatDateTime } from "@/core/api/helper";
import { forwardRef } from "react";
import { calculateOverdue } from "../workOrderHelper";

type Props = {
  workOrders: TypeTblWorkOrder[];
};

const val = (v?: string | number | null) => v ?? "-";

const PrintWorkOrder = ({ workorder }: { workorder: TypeTblWorkOrder }) => {
  const componentName = workorder.tblComponentUnit?.compNo ?? "-";

  const serialNumber = workorder.tblComponentUnit?.serialNo ?? "-";
  const isCritical = workorder.tblComponentUnit?.isCritical ?? "-";

  // @ts-ignore
  const location = workorder.tblComponentUnit?.tblLocation.name ?? "-";

  const discipline = workorder.tblDiscipline?.name ?? "-";

  const frequency = workorder.tblCompJob?.frequency ?? "-";
  // @ts-ignore
  const frequencyPeriod = workorder.tblCompJob?.tblPeriod.name ?? "-";
  // @ts-ignore
  const jobCode = workorder.tblCompJob?.tblJobDescription.jobDescCode ?? "-";
  // @ts-ignore
  const jobDesc = workorder.tblCompJob?.tblJobDescription.jobDesc ?? "-";
  // @ts-ignore
  const pendTypeName = workorder.tblPendingType?.pendTypeName ?? "-";
  const pendingDate = workorder.pendingdate;
  const pendingDescription = workorder?.tblPendingType?.description;

  const overDue = calculateOverdue(workorder);

  return (
    <div key={workorder.workOrderId} className="print-block">
      <table>
        <tbody>
          <tr>
            <td className="label">Title</td>
            <td>{workorder.title}</td>
            <td className="label">PlannedBy</td>
            <td>{workorder.usersTblWorkOrderPlannedByToUsers?.uName}</td>
            <td className="label">Priority</td>
            <td>{workorder.priority}</td>
          </tr>
          <tr>
            <td className="label">Component</td>
            <td>{componentName}</td>

            <td className="label">Due Date</td>
            <td>
              {workorder.dueDate
                ? formatDateTime(String(workorder.dueDate))
                : "-"}
            </td>

            <td className="label">Discipline</td>
            <td>{discipline}</td>
          </tr>

          <tr>
            <td className="label">Location</td>
            <td>{location}</td>

            <td className="label">Last Done</td>
            <td>
              {workorder.completed
                ? formatDateTime(String(workorder.completed))
                : "-"}
            </td>

            <td className="label">Frequency</td>
            <td>
              {frequency} {frequencyPeriod}
            </td>
          </tr>

          <tr>
            <td className="label">Job Title</td>
            <td>{val(workorder.title)}</td>

            <td className="label">Over Due</td>
            <td
              style={{
                color: Number(overDue) < 0 ? "red" : "green",
                fontWeight: 600,
              }}
            >
              {overDue}
            </td>

            <td className="label">WO No</td>
            <td>{val(workorder.woNo)}</td>
          </tr>

          <tr>
            <td className="label">Job Code</td>
            <td colSpan={1}>{jobCode}</td>
            <td className="label">Serial</td>
            <td>{serialNumber}</td>
            <td className="label">is Critical</td>
            <td>{isCritical ? "Yes" : "No"}</td>
          </tr>

          <tr>
            <td className="label">Job Description</td>
            <td colSpan={5}>{jobDesc}</td>
          </tr>
          <tr>
            <td className="label">Pend Type</td>
            <td colSpan={3}>{pendTypeName}</td>
            <td className="label">Pend Date</td>
            <td colSpan={2}>
              {/* {pendingDate ? formatDateTime(String(pendingDate)) : "-"} */}
            </td>
          </tr>

          <tr>
            <td className="label">Pend Description</td>
            <td colSpan={5}>{pendingDescription}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const PrintHeader = ({ total }: { total: number }) => (
  <div className="print-header">
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

export const ReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ workOrders }, ref) => {
    return (
      <div ref={ref} className="print-root">
        <PrintHeader total={workOrders.length} />

        {workOrders.map((wo) => (
          <PrintWorkOrder key={wo.workOrderId} workorder={wo} />
        ))}
      </div>
    );
  }
);

ReportPrint.displayName = "ReportPrint";
