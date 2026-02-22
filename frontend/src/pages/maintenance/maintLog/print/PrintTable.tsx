import DOMPurify from "dompurify";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { formatDateTime, val } from "@/core/helper";

type Props = {
  row: TypeTblMaintLog;
};

const extractData = (row: TypeTblMaintLog) => ({
  component: row.tblComponentUnit?.compNo ?? "-",
  jobCode: row.tblJobDescription?.jobDescCode ?? "-",
  jobTitle: row.tblJobDescription?.jobDescTitle ?? "-",
  dateDone: row.dateDone,
  discipline: row.tblDiscipline?.name ?? "-",
  maintClass: row.tblMaintClass?.descr ?? "-",
  followStatus: row.tblFollowStatus?.fsName ?? "-",
  downTime: row.downTime,
  unexpected: row.unexpected,
  description: row.history ?? "",
});

export const MaintLogPrintTable = ({ row }: Props) => {
  const data = extractData(row);

  const sanitizedHistory = DOMPurify.sanitize(data.description);

  return (
    <div className="print">
      <table className="print__box">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>

        <tbody>
          <tr>
            <td className="print__cell print__label bg--yellow">Component</td>
            <td className="print__cell bg--yellow">{val(data.component)}</td>
            <td className="print__cell print__label bg--yellow">Job Code</td>
            <td className="print__cell bg--yellow">{val(data.jobCode)}</td>
          </tr>
          <tr>
            <td className="print__cell print__label">Job Title</td>
            <td className="print__cell" colSpan={3}>
              {val(data.jobTitle)}
            </td>
          </tr>
          <tr>
            <td className="print__cell print__label">Date Done</td>
            <td className="print__cell">
              {data.dateDone
                ? formatDateTime(data.dateDone, "DATETIME", true)
                : "-"}
            </td>
            <td className="print__cell print__label">Discipline</td>
            <td className="print__cell">{val(data.discipline)}</td>
          </tr>
          <tr>
            <td className="print__cell print__label">Maint Class</td>
            <td className="print__cell">{val(data.maintClass)}</td>
            <td className="print__cell print__label">Follow Status</td>
            <td className="print__cell">{val(data.followStatus)}</td>
          </tr>
          <tr>
            <td className="print__cell print__label">Down Time</td>
            <td className="print__cell">{data.downTime}</td>
            <td className="print__cell print__label">UnExpected</td>
            <td className="print__cell">{data.unexpected ? "Yes" : "No"}</td>
          </tr>

          {/* History */}
          <tr>
            <td colSpan={4} className="print__cell print__label">
              History
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedHistory || "-",
              }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MaintLogPrintTable;
