import { formatDateTime } from "@/core/helper";

type FooterProps = {
  printedBy: string;
};

export const ReportFooter = ({ printedBy }: FooterProps) => {
  return (
    <div className="template-workorder-footer">
      <div>
        <strong>Printed At:</strong>{" "}
        {formatDateTime(new Date(), "DATETIME", true)}
      </div>
      <div>
        <strong>Printed By:</strong> {printedBy}
      </div>
    </div>
  );
};
