import { formatDateTime } from "@/core/helper";

type FooterProps = {
  printedBy: string;
};

export const PrintFooter = ({ printedBy }: FooterProps) => {
  return (
    <div className="print__footer">
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
