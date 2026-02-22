import { calculateOverdue, formatDateTime, val } from "@/core/helper";
import { TypeTblWorkOrderWithRels } from "../types";
import { OutputFormat } from "./PrintTypes";

const extractData = (wo: TypeTblWorkOrderWithRels) => ({
  title: wo.title,
  // @ts-ignore
  plannedBy: wo.usersTblWorkOrderPlannedByToUsers?.uName,
  workorderId: wo.workOrderId,
  component: wo.tblComponentUnit?.compNo,
  dueDate: wo.dueDate,
  location: wo.tblComponentUnit?.tblLocation?.name,
  lastDone: wo.completed,
  discipline: wo.tblDiscipline?.name,
  frequency: wo.tblCompJob?.frequency,
  window: wo.window,
  pendDate: wo.pendingdate,
  frequencyPeriod: wo.tblCompJob?.tblPeriod?.name,
  priority: wo.priority,
  overDue: calculateOverdue(wo),
  jobCode: wo.tblCompJob?.tblJobDescription?.jobDescCode,
  serialNo: wo.tblComponentUnit?.serialNo,
  isCritical: wo.tblComponentUnit?.isCritical,
  jobDesc: wo.tblCompJob?.tblJobDescription?.jobDesc,
  pendType: wo.tblPendingType?.pendTypeName,
  pendDesc: wo.tblPendingType?.description,
});

type Props = {
  workorder: TypeTblWorkOrderWithRels;
  outputFormat: OutputFormat;
};

const PrintTable = ({ workorder, outputFormat }: Props) => {
  const data = extractData(workorder);

  return (
    <div className="print">
      <table key={workorder.workOrderId} className="print__box">
        <colgroup>
          <col style={{ width: "14%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>

        <tbody>
          {/* Header Section */}
          <tr>
            <td className="print__cell print__label bg--yellow">Title</td>
            <td colSpan={3} className="print__cell bg--yellow">
              {val(data.title)}
            </td>

            <td className="print__cell print__label bg--yellow">WO.NO</td>
            <td className="print__cell bg--yellow">
              WO-{val(data.workorderId)}
            </td>
          </tr>

          {/* Main Info */}
          <tr>
            <td className="print__cell print__label">Component</td>
            <td className="print__cell">{val(data.component)}</td>

            <td className="print__cell print__label">Due Date</td>
            <td className="print__cell">
              {data.dueDate ? formatDateTime(data.dueDate) : "-"}
            </td>

            <td className="print__cell print__label">Discipline</td>
            <td className="print__cell">{val(data.discipline)}</td>
          </tr>

          <tr>
            <td className="print__cell print__label">Location</td>
            <td className="print__cell">{val(data.location)}</td>

            <td className="print__cell print__label">Last Done</td>
            <td className="print__cell">
              {data.lastDone ? formatDateTime(data.lastDone) : "-"}
            </td>

            <td className="print__cell print__label">Frequency</td>
            <td className="print__cell">
              {val(data.frequency)} {val(data.frequencyPeriod)}
            </td>
          </tr>

          <tr>
            <td className="print__cell print__label">Priority</td>
            <td className="print__cell">{val(data.priority)}</td>

            <td className="print__cell print__label">Over Due</td>
            <td
              className="print__cell"
              style={{
                color: Number(data.overDue) < 0 ? "red" : "green",
                fontWeight: 600,
              }}
            >
              {data.overDue}
            </td>

            <td className="print__cell print__label">Window</td>
            <td className="print__cell">{val(data.window)}</td>
          </tr>

          <tr>
            <td className="print__cell print__label">Job Code</td>
            <td className="print__cell">{val(data.jobCode)}</td>

            <td className="print__cell print__label">Serial</td>
            <td className="print__cell">{val(data.serialNo)}</td>

            <td className="print__cell print__label">Is Critical</td>
            <td className="print__cell">{data.isCritical ? "Yes" : "No"}</td>
          </tr>

          {/* Details */}
          {outputFormat === "details" && (
            <>
              <tr>
                <td colSpan={6} className="print__cell print__label">
                  Job Description
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="print__cell print__content">
                  {val(data.jobDesc)}
                </td>
              </tr>

              <tr>
                <td className="print__cell print__label">Pend Type</td>
                <td colSpan={3} className="print__cell">
                  {val(data.pendType)}
                </td>

                <td className="print__cell print__label">Pend Date</td>
                <td className="print__cell">
                  {data.pendDate ? formatDateTime(data.pendDate) : "-"}
                </td>
              </tr>

              <tr>
                <td colSpan={6} className="print__cell print__label">
                  Pend Description
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="print__cell print__content">
                  {val(data.pendDesc)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrintTable;
