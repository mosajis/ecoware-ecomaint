import DOMPurify from "dompurify";
import { TypeTblMaintLog, TypeTblPeriod } from "@/core/api/generated/api";
import { formatDateTime, val } from "@/core/helper";
import CellUnexpected from "@/shared/components/dataGrid/cells/CellUnexpected";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellFrequency from "@/shared/components/dataGrid/cells/CellFrequency";

type Props = {
  row: TypeTblMaintLog;
};

const extractData = (row: TypeTblMaintLog) => ({
  component: row.tblComponentUnit?.compNo,
  jobTitle: row.tblJobDescription?.jobDescTitle,
  jobCode: row.tblJobDescription?.jobDescCode,
  history: row?.history ?? "",
  frequency: row.frequency,
  tblPeriod: row.tblPeriod,
  location: row.tblComponentUnit?.compNo,
  maintType: row.tblMaintType?.descr,
  dateDone: row.dateDone || "",
  unexpected: row.unexpected,
  spares: row.tblMaintLogSpares ?? [],
});

export const PrintTable = ({ row }: Props) => {
  if (!row) return;
  const data = extractData(row);

  const sanitizedHistory = DOMPurify.sanitize(data.history);

  return (
    <div className="print">
      <table className="print__box">
        <colgroup>
          {Array.from({ length: 8 }).map((_, i) => (
            <col key={i} style={{ width: "12.5%" }} />
          ))}
        </colgroup>

        <tbody>
          {/* Row 1 */}
          <tr>
            <td className="print__cell print__label bg--yellow">Component</td>
            <td className="print__cell bg--yellow" colSpan={5}>
              {val(data.component)}
            </td>

            <td className="print__cell print__label bg--yellow">Type</td>
            <td className="print__cell bg--yellow">
              <CellUnexpected value={data.unexpected} />
            </td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td className="print__cell print__label">Location</td>
            <td className="print__cell" colSpan={3}>
              {val(data.location)}
            </td>

            <td className="print__cell print__label">Maint Type</td>
            <td className="print__cell">{val(data.maintType)}</td>

            <td className="print__cell print__label">Date Done</td>
            <td className="print__cell">
              <CellDateTime value={data.dateDone} />
            </td>
          </tr>

          {/* Row 3 */}
          <tr>
            <td className="print__cell print__label">Job Title</td>
            <td className="print__cell" colSpan={3}>
              {val(data.jobTitle)}
            </td>

            <td className="print__cell print__label">Job Code</td>
            <td className="print__cell">{val(data.jobCode)}</td>

            <td className="print__cell print__label">Frequency</td>
            <td className="print__cell">
              <CellFrequency
                frequency={data.frequency}
                frequencyPeriod={data.tblPeriod as TypeTblPeriod}
              />
            </td>
          </tr>

          {/* History */}
          <tr>
            <td
              colSpan={8}
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedHistory || "-",
              }}
            />
          </tr>
          {data.spares.length > 0 && (
            <>
              <tr>
                <td className="print__cell print__label" colSpan={4}>
                  Spare
                </td>
                <td className="print__cell print__label" colSpan={2}>
                  Maker Ref No
                </td>
                <td className="print__cell print__label" colSpan={1}>
                  MESC Code
                </td>
                <td className="print__cell print__label">Count</td>
              </tr>

              {data.spares.map((item, index) => (
                <tr key={index}>
                  <td className="print__cell" colSpan={4}>
                    {val(item.tblSpareUnit?.tblSpareType?.name)}
                  </td>

                  <td className="print__cell" colSpan={2}>
                    {val(item.tblSpareUnit?.tblSpareType?.makerRefNo)}
                  </td>

                  <td className="print__cell" colSpan={1}>
                    {val(item.tblSpareUnit?.tblSpareType?.partTypeNo)}
                  </td>

                  <td className="print__cell">{val(item.spareCount)}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PrintTable;
