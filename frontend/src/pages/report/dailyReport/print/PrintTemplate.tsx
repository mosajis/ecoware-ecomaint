import PrintTemplate from "@/shared/components/print/PrintTemplate";
import PrintContent from "./PrintContent";
import { forwardRef, useEffect, useState } from "react";
import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";

interface Props {
  date: string; // ISO date string
}

const ReportPrintTemplate = forwardRef<HTMLDivElement, Props>(
  ({ date }, ref) => {
    const [maintLogs, setMaintLogs] = useState<TypeTblMaintLog[]>([]);

    useEffect(() => {
      // فیلتر روی dateDone برای روز مورد نظر
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      tblMaintLog
        .getAll({
          filter: {
            reportedDate: {
              gte: startOfDay.toISOString(),
              lte: endOfDay.toISOString(),
            },
          },
        })
        .then((res) => setMaintLogs(res.items));
    }, [date]);

    return (
      <PrintTemplate
        content={<PrintContent maintLogs={maintLogs} />}
        reportTitle="Daily Report"
        ref={ref}
      />
    );
  },
);

export default ReportPrintTemplate;
