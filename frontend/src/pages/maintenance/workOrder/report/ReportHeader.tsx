type HeaderProps = {
  title: string;
  location: string;
  totalLength: number;
};

export const ReportHeader = ({ title, location, totalLength }: HeaderProps) => {
  return (
    <div className="report-workorder-header">
      <h1>Ecoware (Preventive Maintenance System)</h1>
      <div>
        <strong>Location:</strong> {location}
      </div>
      <h3>{title}</h3>
      <div>
        <strong>Total: </strong> {JSON.stringify(totalLength)}
      </div>
    </div>
  );
};
