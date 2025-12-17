import { formatDateTime } from "@/core/api/helper";

type FooterProps = {
  printDate?: string | Date;
  printedBy?: string;
};

export const ReportFooter = ({
  printDate = new Date(),
  printedBy = "Administrator",
}: FooterProps) => {
  return (
    <div className="template-workorder-footer">
      <div>
        <strong>Printed At:</strong> {formatDateTime(printDate)}
      </div>
      <div>
        <strong>Printed By:</strong> {printedBy}
      </div>
    </div>
  );
};
