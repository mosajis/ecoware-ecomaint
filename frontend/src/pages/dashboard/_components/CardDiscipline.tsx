import { TypeStatistics } from "@/core/api/api";
import { toPercent } from "@/shared/utils/zodUtils";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Box,
  LinearProgressPropsColorOverrides,
} from "@mui/material";

type Props = {
  title: string;
  counts: TypeStatistics;
};

const DisciplineCard = ({ title, counts }: Props) => {
  const items = [
    { label: "Open", value: counts.open, color: "info" },
    { label: "Current", value: counts.current, color: "info" },
    { label: "Pending", value: 2000, color: "warning" },
    { label: "Overdue", value: counts.overdue, color: "error" },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={"bold"}>
            {title}
          </Typography>

          {items.map((item) => {
            const percent = toPercent(item.value, counts.total);
            return (
              <Box key={item.label}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="caption" fontWeight="bold">
                    {item.label}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
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
