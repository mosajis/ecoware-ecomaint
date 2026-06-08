import { FC } from "react";

interface OverdueTextProps {
  value?: number | null;
}

const CellOverdueCount: FC<OverdueTextProps> = ({ value }) => {
  if (value == null) return null;

  const color = value < 0 ? "green" : "red";

  return (
    <span
      style={{
        color,
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  );
};

export default CellOverdueCount;
