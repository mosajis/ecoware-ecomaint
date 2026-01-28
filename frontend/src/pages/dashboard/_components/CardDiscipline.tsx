import { TypeStatistics } from "@/core/api/api";
import { toPercent } from "@/shared/utils/zodUtils";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Box,
} from "@mui/material";

type Props = {
  title: string;
  counts: TypeStatistics;
};

const DisciplineCard = ({ title, counts }: Props) => {
  const disciplineStats = counts.disciplines[title] || {
    open: 0,
    pending: 0,
    overdue: 0,
    current: 0,
  };

  const totalOpen = disciplineStats.open;

  const items = [
    {
      label: "Open",
      value: disciplineStats.open,
      color: "info",
      total: counts.workOrder.total,
      sx: {
        marginBottom: 2,
      },
    },
    {
      label: "Current",
      value: disciplineStats.current,
      color: "info",
      total: totalOpen,
    },
    {
      label: "Pending",
      value: disciplineStats.pending,
      color: "warning",
      total: totalOpen,
    },
    {
      label: "Overdue",
      value: disciplineStats.overdue,
      color: "error",
      total: totalOpen,
    },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={"bold"}>
            {title}
          </Typography>

          {items.map((item) => {
            const percent = toPercent(item.value, item.total);
            return (
              <Box key={item.label}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography flex={1} variant="caption" fontWeight="bold">
                    {item.label}
                  </Typography>

                  <Typography
                    textAlign={"center"}
                    flex={2}
                    variant="caption"
                    fontWeight="bold"
                  >
                    {percent === 0 ? "0.00" : percent} %
                  </Typography>
                  <Typography
                    textAlign={"right"}
                    flex={1}
                    variant="caption"
                    fontWeight="bold"
                  >
                    {item.value}
                  </Typography>
                </Stack>
                <LinearProgress
                  color={item.color as any}
                  variant="determinate"
                  value={percent}
                  sx={{
                    background: "#acacac49",
                    height: 4,
                    borderRadius: 4,
                    ...item.sx,
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DisciplineCard;
