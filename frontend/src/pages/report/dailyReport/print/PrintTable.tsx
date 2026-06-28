import DOMPurify from "dompurify";
import { TypeTblMaintLog } from "@/core/api/generated/api";
import { formatDateTime, val } from "@/core/helper";
import CellUnexpected from "@/shared/components/dataGrid/cells/CellUnexpected";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

type Props = {
  row: TypeTblMaintLog;
};

const extractData = (row: TypeTblMaintLog) => ({
  component: row.tblComponentUnit?.compNo,
  jobTitle: row.tblJobDescription?.jobDescTitle,
  jobCode: row.tblJobDescription?.jobDescCode,
  history: row?.history ?? "",

  location: row.tblComponentUnit?.compNo,

  maintType: row.tblMaintType?.descr,
  dateDone: row.dateDone || "",
  unexpected: row.unexpected,
});

export const PrintTable = ({ row }: Props) => {
  if (!row) return;
  const data = extractData(row);

  const sanitizedHistory = DOMPurify.sanitize(data.history);

  return (
    <div className="print">
      <table className="print__box">
        <colgroup>
          <col style={{ width: "12%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>

        <tbody>
          <tr>
            <td className="print__cell print__label bg--yellow">Component</td>
            <td className="print__cell bg--yellow" colSpan={2}>
              {val(data.component)}
            </td>
            <td className="print__cell print__label bg--yellow">Location</td>
            <td className="print__cell bg--yellow" colSpan={2}>
              {val(data.location)}
            </td>
          </tr>
          <tr>
            <td className="print__cell print__label">Type</td>
            <td className="print__cell">
              <CellUnexpected value={data.unexpected} />
            </td>
            <td className="print__cell print__label">Date Done</td>
            <td className="print__cell">
              <CellDateTime value={data.dateDone} />
            </td>
            <td className="print__cell print__label">Maint Type</td>
            <td className="print__cell">{val(data.maintType)}</td>
          </tr>

          {/* History */}
          <tr>
            <td className="print__cell print__label" colSpan={1}>
              Job Title
            </td>
            <td className="print__cell" colSpan={3}>
              {data.jobTitle}
            </td>
            <td className="print__cell print__label">Job Code</td>
            <td className="print__cell">{val(data.jobCode)}</td>
          </tr>
          <tr>
            <td
              colSpan={8}
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

export default PrintTable;
