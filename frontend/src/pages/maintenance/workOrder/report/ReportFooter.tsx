import { formatDateTime } from "@/core/api/helper";

type FooterProps = {
  printedBy: string;
};

export const ReportFooter = ({ printedBy }: FooterProps) => {
  return (
    <div className="template-workorder-footer">
      <div>
        <strong>Printed At:</strong> {formatDateTime(new Date())}
      </div>
      <div>
        <strong>Printed By:</strong> {printedBy}
      </div>
    </div>
  );
};
