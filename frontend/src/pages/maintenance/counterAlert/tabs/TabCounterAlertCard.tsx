import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { calculateProgress } from "../CounterAlertUtil";
import { useMemo, useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { CounterAlert } from "./TabCounterAlertType";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

const TabCounterAlertCard = ({ counterAlerts }: { counterAlerts: any }) => {
  const [sortBy, setSortBy] = useState("orderNo-asc");

  const sortedCounterAlerts = useMemo(() => {
    const items = [...counterAlerts];

    return items.sort((a: CounterAlert, b: CounterAlert) => {
      const progressA = calculateProgress(
        a.start.lastDoneCount,
        a.value.currentValue,
        a.end.nextDueCount,
      );

      const progressB = calculateProgress(
        b.start.lastDoneCount,
        b.value.currentValue,
        b.end.nextDueCount,
      );

      switch (sortBy) {
        case "orderNo-asc":
          return (a.info.orderNo ?? Infinity) - (b.info.orderNo ?? Infinity);

        case "orderNo-desc":
          return (b.info.orderNo ?? -Infinity) - (a.info.orderNo ?? -Infinity);
        case "component-asc":
          return (a.info.componentName ?? "").localeCompare(
            b.info.componentName ?? "",
          );

        case "component-desc":
          return (b.info.componentName ?? "").localeCompare(
            a.info.componentName ?? "",
          );

        case "job-asc":
          return a.info.jobDescTitle.localeCompare(b.info.jobDescTitle);

        case "progress-desc":
          return progressB - progressA;

        case "progress-asc":
          return progressA - progressB;

        case "current-desc":
          return (b.value.currentValue ?? 0) - (a.value.currentValue ?? 0);

        case "next-due-asc":
          return (
            (a.end.nextDueCount ?? Infinity) - (b.end.nextDueCount ?? Infinity)
          );

        case "frequency-asc":
          return (
            (a.info.frequency ?? Infinity) - (b.info.frequency ?? Infinity)
          );

        case "alert-first":
          return Number(a.info.status) - Number(b.info.status);

        default:
          return 0;
      }
    });
  }, [counterAlerts, sortBy]);
  const RenderCards = () => {
    return sortedCounterAlerts.map((item: CounterAlert, index: number) => {
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
            borderRadius: 2,
            height: "100%",
          }}
        >
          <CardContent>
            {/* Header */}
            <Stack
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {item.info.componentName || "--"}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {item.info.jobDescTitle}
                </Typography>
              </Box>

              <Tooltip title="Frequency">
                <Box
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    {item.info.frequency}
                  </Typography>
                </Box>
              </Tooltip>
            </Stack>

            {/* Counter Values */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: "action.hover",
              }}
            >
              <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Done
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.start.lastDoneCount?.toLocaleString() ?? "--"}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    <CellDateTime value={item.start.lastDone} type="DATE" />
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">
                    Current
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {item.value.currentValue?.toLocaleString() ?? "--"}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    <CellDateTime value={item.value.currentDate} type="DATE" />
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" color="text.secondary">
                    Next Due
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {item.end.nextDueCount?.toLocaleString() ?? "--"}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    <CellDateTime value={item.end.nextDueDate} type="DATE" />
                  </Typography>
                </Box>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progressValue}
                color={isHealthy ? "success" : "error"}
                sx={{
                  height: 6,
                  borderRadius: 5,
                  mt: 1.5,
                  backgroundColor: "action.selected",
                }}
              />
            </Box>
          </CardContent>
        </Card>
      );
    });
  };
  return (
    <Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h6">Counter Alert</Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ p: 0.5 }}
        >
          <Select
            size="small"
            value={sortBy}
            onChange={(event: SelectChangeEvent) =>
              setSortBy(event.target.value)
            }
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="orderNo-asc">Order No: Low to High</MenuItem>

            <MenuItem value="orderNo-desc">Order No: High to Low</MenuItem>

            <MenuItem value="progress-desc">Progress: High to Low</MenuItem>

            <MenuItem value="progress-asc">Progress: Low to High</MenuItem>

            <MenuItem value="alert-first">Alerts First</MenuItem>

            <MenuItem value="component-asc">Component: A to Z</MenuItem>

            <MenuItem value="component-desc">Component: Z to A</MenuItem>

            <MenuItem value="job-asc">Job Description: A to Z</MenuItem>

            <MenuItem value="current-desc">Current Value: High to Low</MenuItem>

            <MenuItem value="next-due-asc">Next Due: Low to High</MenuItem>

            <MenuItem value="frequency-asc">Frequency: Low to High</MenuItem>
          </Select>
        </Stack>
      </Box>
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(3, 1fr)"}
        gap={0.5}
        p={0.5}
      >
        <RenderCards />
      </Box>
    </Box>
  );
};

export default TabCounterAlertCard;
