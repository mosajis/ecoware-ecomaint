import { formatDateTime } from "@/core/api/helper";

type HeaderProps = {
  title: string;
  total: number;
  printDate?: Date;
  reportId?: string;
  generatedBy?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
};

export const ReportHeader = ({
  title,
  total,
  printDate = new Date(),
  reportId = "-",
  generatedBy = "System",
  dateRange,
}: HeaderProps) => {
  return (
    <div className="report-workorder-header">
      <h1>Ecoware (Preventive Maintenance System)</h1>
      <div>
        <strong>Location:</strong> Pasargad 100
      </div>
      <h3>Work Order Report</h3>
      <div>
        <strong>Total: </strong> {total}
      </div>
    </div>
  );
};
