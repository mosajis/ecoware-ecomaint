import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Timer from "@mui/icons-material/Timer";
import Spinner from "@/shared/components/Spinner";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { useEffect, useState } from "react";
import { getCountersAlert } from "@/core/api/api";

const CountersAlert = () => {
  const [alerts, setAlerts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountersAlert()
      .then((data) => {
        setAlerts(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const calculateProgress = (start: number, current: number, end: number) => {
    if (!start || !current || !end) return 0;
    const total = end - start;
    const progress = current - start;
    if (total <= 0) return 100;

    const percentage = (progress / total) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box
      display={"grid"}
      gridTemplateColumns={"repeat(3, 1fr)"}
      gap={1.5}
      p={1.5}
    >
      {alerts.map((item: any, index: number) => {
        const progressValue = calculateProgress(
          item.start.lastDoneCount,
          item.value.currentValue,
          item.end.nextDueCount,
        );

        const isHealthy = item.info.status;

        return (
          <Card
            key={index}
            sx={{
              borderRadius: 1,
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div">
                {item.info.componentName}
              </Typography>
              <Typography variant="overline" component="div">
                {item.info.jobDescTitle}
              </Typography>

              <Box sx={{ mb: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Current {item.value.currentValue?.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next: {item.end.nextDueCount?.toLocaleString()}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progressValue}
                  color={isHealthy ? "success" : "error"}
                  sx={{ height: 5, borderRadius: 5, mt: 1 }}
                />
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  display="flex"
                  alignItems="center"
                  color="text.secondary"
                >
                  <Timer fontSize="small" sx={{ mr: 0.5 }} />
                  Frequency: {item.info.frequency || "--"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  LastDone:{" "}
                  <CellDateTime value={item.start.lastDone} type="DATE" />
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default CountersAlert;
