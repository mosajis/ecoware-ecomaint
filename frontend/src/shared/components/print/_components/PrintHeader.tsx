type HeaderProps = {
  title: string;
  location: string;
  totalLength: number;
};

export const PrintHeader = ({ title, location, totalLength }: HeaderProps) => {
  return (
    <div className="print__header">
      <div className="print__header-left">
        <h1 className="print__title">
          Ecoware (Preventive Maintenance System)
        </h1>
        <h3 className="print__subtitle">{title}</h3>
      </div>
      <div className="print__header-right">
        <div>
          <strong>GPTK - RIG:</strong> {location}
        </div>
        {totalLength > 1 && (
          <div>
            <strong>Total:</strong> {totalLength}
          </div>
        )}
      </div>
    </div>
  );
};
