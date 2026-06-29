import DOMPurify from "dompurify";
import PrintTemplate from "@/shared/components/print/PrintTemplate";
import PrintContent from "./PrintContent";
import { formatDateTime } from "@/core/helper";
import { forwardRef } from "react";
import { TypeTblDailyReport, TypeTblMaintLog } from "@/core/api/generated/api";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";

interface Props {
  dailyReport: TypeTblDailyReport;
  maintLogs: TypeTblMaintLog[];
}

const ReportPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ maintLogs, dailyReport }, ref) => {
    const sanitizedUserComment = DOMPurify.sanitize(
      dailyReport?.userComment || "",
    );

    return (
      <PrintTemplate
        content={
          <>
            <table className="pht">
              <tbody>
                <tr>
                  <td className="cell-label">Created Date</td>
                  <td className="cell-value">
                    <CellDateTime value={dailyReport.createdDate} />
                  </td>
                  <td className="cell-label">Reported Date</td>
                  <td className="cell-value">
                    <CellDateTime value={dailyReport.reportDate} />{" "}
                  </td>
                  <td className="cell-label">Total Waiting</td>
                  <td className="cell-value">
                    {dailyReport.totalwaiting ?? "-"}
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan={6}
                    className="cell-value"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedUserComment || "-",
                    }}
                  />
                </tr>
              </tbody>
            </table>
            <PrintContent maintLogs={maintLogs} dailyReport={dailyReport} />
          </>
        }
        reportTitle={dailyReport.reportTitle}
        ref={ref}
      />
    );
  },
);

export default ReportPrintTemplate;
