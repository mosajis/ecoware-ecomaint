import { calculateOverdue, formatDateTime, val } from "@/core/api/helper";
import { TypeTblWorkOrderWithRels } from "../types";

const extractData = (wo: TypeTblWorkOrderWithRels) => ({
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

type OutputFormat = "list" | "details";

interface WorkOrderReportProps {
  workorder: TypeTblWorkOrderWithRels;
  outputFormat: OutputFormat;
}

const ReportTable = ({ workorder, outputFormat }: WorkOrderReportProps) => {
  const data = extractData(workorder);

  return (
    <table key={workorder.workOrderId} className="template-workorder-box">
      <tbody>
        {/* Header Section */}
        <tr>
          <td style={{ backgroundColor: "#fff8b6ff" }}>Title</td>
          <td colSpan={3} style={{ backgroundColor: "#fff8b6ff" }}>
            {val(data.title)}
          </td>
          <td style={{ backgroundColor: "#fff8b6ff" }}>PlannedBy</td>
          <td style={{ backgroundColor: "#fff8b6ff" }}>
            {val(data.plannedBy)}
          </td>
        </tr>

        {/* Main Info Section */}
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
            style={{
              color: Number(data.overDue) < 0 ? "red" : "green",
              fontWeight: 600,
            }}
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

        {/* Details Section - Conditional */}
        {outputFormat === "details" && (
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
        )}
      </tbody>
    </table>
  );
};

// const ReportTable = ({
//   workOrders,
//   outputFormat,
//   sortOrder,
// }: WorkOrderReportProps) => {
//   const sortedWorkOrders = sortWorkOrders(workOrders, sortOrder);

//   return (
//     <div className="work-order-report">
//       {sortedWorkOrders.map((workorder) => {
//         const data = extractData(workorder);

//         return (
//           <table key={workorder.workOrderId} className="template-workorder-box">
//             <tbody>
//               {/* Header Section */}
//               <tr>
//                 <td className="label">Title</td>
//                 <td colSpan={3}>{val(data.title)}</td>
//                 <td className="label">PlannedBy</td>
//                 <td>{val(data.plannedBy)}</td>
//               </tr>

//               {/* Main Info Section */}
//               <tr>
//                 <td className="label">Component</td>
//                 <td>{val(data.component)}</td>
//                 <td className="label">Due Date</td>
//                 <td>{data.dueDate ? formatDateTime(data.dueDate) : "-"}</td>
//                 <td className="label">Discipline</td>
//                 <td>{val(data.discipline)}</td>
//               </tr>
//               <tr>
//                 <td className="label">Location</td>
//                 <td>{val(data.location)}</td>
//                 <td className="label">Last Done</td>
//                 <td>{data.lastDone ? formatDateTime(data.lastDone) : "-"}</td>
//                 <td className="label">Frequency</td>
//                 <td>
//                   {val(data.frequency)} {val(data.frequencyPeriod)}
//                 </td>
//               </tr>
//               <tr>
//                 <td className="label">Priority</td>
//                 <td>{val(data.priority)}</td>
//                 <td className="label">Over Due</td>
//                 <td
//                   style={{
//                     color: Number(data.overDue) < 0 ? "red" : "green",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {data.overDue}
//                 </td>
//                 <td className="label">WO No</td>
//                 <td>{val(data.woNo)}</td>
//               </tr>
//               <tr>
//                 <td className="label">Job Code</td>
//                 <td>{val(data.jobCode)}</td>
//                 <td className="label">Serial</td>
//                 <td>{val(data.serialNo)}</td>
//                 <td className="label">is Critical</td>
//                 <td>{data.isCritical ? "Yes" : "No"}</td>
//               </tr>

//               {/* Details Section - Conditional */}
//               {outputFormat === "details" && (
//                 <>
//                   <tr>
//                     <td className="label">Job Description</td>
//                     <td colSpan={5}>{val(data.jobDesc)}</td>
//                   </tr>
//                   <tr>
//                     <td className="label">Pend Type</td>
//                     <td colSpan={3}>{val(data.pendType)}</td>
//                     <td className="label">Pend Date</td>
//                     <td>
//                       {data.pendDate ? formatDateTime(data.pendDate) : "-"}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="label">Pend Description</td>
//                     <td colSpan={5}>{val(data.pendDesc)}</td>
//                   </tr>
//                 </>
//               )}
//             </tbody>
//           </table>
//         );
//       })}
//     </div>
//   );
// };

export default ReportTable;
