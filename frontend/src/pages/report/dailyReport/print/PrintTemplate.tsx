import DOMPurify from "dompurify";
import PrintTemplate from "@/shared/components/print/PrintTemplate";
import PrintContent from "./PrintContent";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import CellDailyReportTitle from "../_components/CellDailyReportTitle";
import { forwardRef } from "react";
import { TypeTblDailyReport, TypeTblMaintLog } from "@/core/api/generated/api";

interface Props {
  dailyReport: TypeTblDailyReport;
  maintLogs: TypeTblMaintLog[];
  withRoutine: boolean;
}

const ReportPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ maintLogs, dailyReport, withRoutine }, ref) => {
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
                  <td className="cell-label">Include Routine Jobs</td>
                  <td className="cell-value">{withRoutine ? "Yes" : "No"}</td>
                  <td className="cell-label">Reported Date</td>
                  <td className="cell-value">
                    <CellDateTime
                      value={dailyReport.reportDate}
                      type="DATE"
                    />{" "}
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
            <PrintContent
              maintLogs={maintLogs}
              dailyReport={dailyReport}
              withRoutine={withRoutine}
            />
          </>
        }
        reportTitle={<CellDailyReportTitle row={dailyReport} />}
        ref={ref}
      />
    );
  },
);

export default ReportPrintTemplate;
