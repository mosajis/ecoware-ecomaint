import { FC } from "react";

interface OverdueTextProps {
  value?: number | null;
}

const Overdue: FC<OverdueTextProps> = ({ value }) => {
  if (value == null) return null;

  const color = value < 0 ? "red" : "green";

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

export default Overdue;
