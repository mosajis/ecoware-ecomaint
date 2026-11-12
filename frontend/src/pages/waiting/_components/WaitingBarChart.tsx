import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface TypeWaitingChartItem {
  name: string;
  value: number;
  subtitle?: string;
}

interface Props {
  items: TypeWaitingChartItem[];
  maxItems?: number;
}

const WaitingBarChart = ({ items, maxItems }: Props) => {
  const visibleItems = maxItems ? items.slice(0, maxItems) : items;

  const maxValue = Math.max(...visibleItems.map((item) => item.value), 1);

  if (!visibleItems.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No data available
      </Typography>
    );
  }

  return (
    <Stack gap={1.5}>
      {visibleItems.map((item) => (
        <Box key={item.name}>
          <Stack
            direction="row"
            justifyContent="space-between"
            gap={2}
            mb={0.5}
          >
            <Typography variant="body2" noWrap title={item.name}>
              {item.name}
            </Typography>

            <Typography variant="body2" fontWeight={700} whiteSpace="nowrap">
              {item.value.toFixed(1)} h
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={(item.value / maxValue) * 100}
            sx={{
              height: 8,
              borderRadius: 1,
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

export default WaitingBarChart;
