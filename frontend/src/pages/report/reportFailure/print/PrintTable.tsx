import DOMPurify from "dompurify";
import { TypeTblFailureReports } from "@/core/api/generated/api";
import { formatDateTime, val } from "@/core/helper";

type Props = {
  failureReport: TypeTblFailureReports;
};

const extractData = (report: TypeTblFailureReports) => ({
  title: report.title ?? "-",
  //@ts-ignore
  component: report?.tblMaintLog?.tblComponentUnit?.compNo ?? "-",
  //@ts-ignore
  location: report?.tblLocation?.name ?? "-",
  //@ts-ignore
  serialNo: report?.tblMaintLog?.tblComponentUnit?.serialNo ?? "-",
  reportedDate: report.tblMaintLog?.reportedDate,
  downTime: report.tblMaintLog?.downTime ?? "-",
  reportedBy: report.tblMaintLog?.reportedBy ?? "-",
  failureNumber: report.failureNumber ?? "-",
  description: report.tblMaintLog?.history ?? "",
  followDesc: report.followDesc ?? "",
});

export const PrintTable = ({ failureReport }: Props) => {
  const data = extractData(failureReport);

  const sanitizedDescription = DOMPurify.sanitize(data.description);
  const sanitizedFollowDesc = DOMPurify.sanitize(data.followDesc);

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
          {/* ردیف‌های اصلی بدون تغییر */}
          <tr>
            <td className="print__cell print__label bg--yellow">Title</td>
            <td className="print__cell bg--yellow">{val(data.title)}</td>
            <td className="print__cell print__label bg--yellow">
              Failure Number
            </td>
            <td className="print__cell bg--yellow">
              {val(data.failureNumber)}
            </td>
          </tr>
          <tr>
            <td className="print__cell print__label">Component</td>
            <td className="print__cell">{val(data.component)}</td>
            <td className="print__cell print__label">Location</td>
            <td className="print__cell">{val(data.location)}</td>
          </tr>
          <tr>
            <td className="print__cell print__label">Serial Number</td>
            <td className="print__cell">{val(data.serialNo)}</td>
            <td className="print__cell print__label">Reported Date</td>
            <td className="print__cell">
              {data.reportedDate
                ? formatDateTime(data.reportedDate, "DATETIME", true)
                : "-"}
            </td>
          </tr>
          <tr>
            <td className="print__cell print__label">Down Time</td>
            <td className="print__cell">{val(data.downTime)}</td>
            <td className="print__cell print__label">Reported By</td>
            <td className="print__cell">{val(data.reportedBy)}</td>
          </tr>

          {/* Description */}
          <tr>
            <td colSpan={4} className="print__cell print__label">
              Description (History)
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedDescription || "-",
              }}
            />
          </tr>

          {/* Follow Description */}
          <tr>
            <td colSpan={4} className="print__cell print__label">
              Follow Description
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              className="print__cell print__content"
              dangerouslySetInnerHTML={{
                __html: sanitizedFollowDesc || "-",
              }}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
};
