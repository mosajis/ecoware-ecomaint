import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { formatDateTime } from "@/core/api/helper";
import { forwardRef } from "react";

type Props = {
  workOrders: TypeTblWorkOrder[];
};

type WOProps = {
  wo: TypeTblWorkOrder;
};

const val = (v?: string | number | null) => v ?? "-";

const PrintWorkOrder = ({ wo }: WOProps) => {
  const componentName = wo.tblComponentUnit?.compNo ?? "-";

  const serialNumber = wo.tblComponentUnit?.serialNo ?? "-";
  const isCritical = wo.tblComponentUnit?.isCritical ?? "-";

  // @ts-ignore
  const location = wo.tblComponentUnit?.tblLocation.name ?? "-";

  const discipline = wo.tblDiscipline?.name ?? "-";

  const frequency = wo.tblCompJob?.frequency ?? "-";
  // @ts-ignore
  const frequencyPeriod = wo.tblCompJob?.tblPeriod.name ?? "-";
  // @ts-ignore
  const jobCode = wo.tblCompJob?.tblJobDescription.jobDescCode ?? "-";
  // @ts-ignore
  const jobDesc = wo.tblCompJob?.tblJobDescription.jobDesc ?? "-";

  return (
    <div key={wo.workOrderId} className="print-block">
      <table>
        <tbody>
          <tr>
            <td className="label">Component</td>
            <td>{componentName}</td>

            <td className="label">Due Date</td>
            <td>{formatDateTime(String(wo.dueDate))}</td>

            <td className="label">Discipline</td>
            <td>{discipline}</td>
          </tr>

          <tr>
            <td className="label">Location</td>
            <td>{location}</td>

            <td className="label">Last Done</td>
            <td>{formatDateTime(String(wo.completed))}</td>

            <td className="label">Frequency</td>
            <td>
              {frequency} {frequencyPeriod}
            </td>
          </tr>

          <tr>
            <td className="label">Job Title</td>
            <td>{val(wo.title)}</td>

            <td className="label">Over Due</td>
            <td>{val(wo.overDue)}</td>

            <td className="label">WO No</td>
            <td>{val(wo.woNo)}</td>
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
        </tbody>
      </table>
    </div>
  );
};

const PrintHeader = () => (
  <div className="print-header">
    <h1>Preventive Maintenance System</h1>
    <h3>Workorder List</h3>
  </div>
);

export const ReportPrint = forwardRef<HTMLDivElement, Props>(
  ({ workOrders }, ref) => {
    return (
      <div ref={ref}>
        <PrintHeader />

        {workOrders.map((wo) => (
          <PrintWorkOrder key={wo.workOrderId} wo={wo} />
        ))}
      </div>
    );
  }
);

ReportPrint.displayName = "ReportPrint";
