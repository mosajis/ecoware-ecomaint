import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon,
}: MetricCardProps) => (
  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
    <Stack direction="row" justifyContent="space-between">
      <Typography color="text.secondary" variant="body2">
        {title}
      </Typography>
      {icon}
    </Stack>

    <Typography variant="h4" fontWeight={700} mt={1}>
      {value}
    </Typography>

    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Paper>
);

interface SectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const WaitingSection = ({ title, subtitle, children }: SectionProps) => (
  <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
    <Typography variant="subtitle1" fontWeight={700}>
      {title}
    </Typography>

    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}

    <Box mt={2}>{children}</Box>
  </Paper>
);

interface BarItem {
  name: string;
  value: number;
  subtitle?: string;
}

export const WaitingBarList = ({ items }: { items: BarItem[] }) => {
  const max = Math.max(...items.map((x) => x.value), 1);

  return (
    <Stack gap={2}>
      {items.length === 0 && (
        <Typography color="text.secondary" variant="body2">
          No data available
        </Typography>
      )}

      {items.map((item, index) => (
        <Box key={`${item.name}-${index}`}>
          <Stack direction="row" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2">{item.name}</Typography>

            <Typography variant="body2" fontWeight={700}>
              {item.value.toFixed(1)} h
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={(item.value / max) * 100}
            sx={{
              height: 9,
              borderRadius: 5,
            }}
          />

          {item.subtitle && (
            <Typography variant="caption" color="text.secondary">
              {item.subtitle}
            </Typography>
          )}
        </Box>
      ))}
    </Stack>
  );
};

export const WaitingDateFilter = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: {
  startDate: string;
  endDate: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
}) => (
  <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
    <TextField
      size="small"
      type="date"
      label="From"
      value={startDate}
      onChange={(e) => onStartChange(e.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />

    <TextField
      size="small"
      type="date"
      label="To"
      value={endDate}
      onChange={(e) => onEndChange(e.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  </Stack>
);
