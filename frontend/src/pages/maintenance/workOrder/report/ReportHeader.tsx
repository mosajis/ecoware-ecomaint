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
    <div className="template-workorder-header">
      <div className="header-brand">
        <h2 className="brand-title">Preventive Maintenance System</h2>

        <div className="d">
          <h3>Pasargad 100</h3>
          <h3>Work Order Report</h3>
          <h3>EcoMaint</h3>
        </div>
      </div>
    </div>
  );
};
