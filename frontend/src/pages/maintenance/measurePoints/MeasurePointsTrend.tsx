// MeasurePointTrendDialog.tsx
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import { LineChart } from "@mui/x-charts/LineChart";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  tblCompMeasurePointLog,
  TypeTblCompMeasurePointLog,
} from "@/core/api/generated/api";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import Spinner from "@/shared/components/Spinner";
import { formatDateTime } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomLanguage } from "@/shared/atoms/general.atom";

interface MeasurePointTrendDialogProps {
  open: boolean;
  onClose: () => void;
  compMeasurePointId: number | null;
  title?: string;
}

export default function MeasurePointsTrend({
  open,
  onClose,
  compMeasurePointId,
  title = "Measure Point Trend",
}: MeasurePointTrendDialogProps) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<TypeTblCompMeasurePointLog[]>([]);

  const [useDateFilter, setUseDateFilter] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 10);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [recordCount, setRecordCount] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  // Debounced values
  const [debouncedRecordCount, setDebouncedRecordCount] = useState<number>(10);
  const [debouncedStartDate, setDebouncedStartDate] = useState<Date | null>(
    startDate,
  );
  const [debouncedEndDate, setDebouncedEndDate] = useState<Date | null>(
    endDate,
  );

  // Debounce recordCount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedRecordCount(recordCount);
    }, 500);

    return () => clearTimeout(timer);
  }, [recordCount]);

  // Debounce dates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedStartDate(startDate);
      setDebouncedEndDate(endDate);
    }, 500);

    return () => clearTimeout(timer);
  }, [startDate, endDate]);

  const fetchData = useCallback(async () => {
    if (!compMeasurePointId) return;

    setLoading(true);
    try {
      let allLogs: TypeTblCompMeasurePointLog[] = [];

      if (useDateFilter) {
        // فیلتر بر اساس تاریخ
        if (!debouncedStartDate || !debouncedEndDate) return;

        const result = await tblCompMeasurePointLog.getAll({
          filter: {
            compMeasurePointId,
            currentDate: {
              gte: debouncedStartDate,
              lte: debouncedEndDate,
            },
          },
          include: {
            tblUnit: true,
            tblCompMeasurePoint: {
              include: {
                tblCounterType: true,
                tblComponentUnit: true,
              },
            },
          },
        });

        allLogs = result.items || [];
      } else {
        // فیلتر بر اساس تعداد
        const result = await tblCompMeasurePointLog.getAll({
          filter: {
            compMeasurePointId,
          },
          include: {
            tblUnit: true,
            tblCompMeasurePoint: {
              include: {
                tblCounterType: true,
                tblComponentUnit: true,
              },
            },
          },
        });

        allLogs = result.items || [];

        // مرتب‌سازی نزولی بر اساس تاریخ
        allLogs.sort((a, b) => {
          const dateA = a.currentDate ? new Date(a.currentDate).getTime() : 0;
          const dateB = b.currentDate ? new Date(b.currentDate).getTime() : 0;
          return dateB - dateA;
        });

        // اعمال offset و count دستی
        const start = offset;
        const end = offset + debouncedRecordCount;
        allLogs = allLogs.slice(start, end);

        // برگرداندن به ترتیب صعودی برای چارت
        allLogs.reverse();
      }

      setLogs(allLogs);
    } catch (error) {
      console.error("Error fetching trend data:", error);
    } finally {
      setLoading(false);
    }
  }, [
    compMeasurePointId,
    useDateFilter,
    debouncedStartDate,
    debouncedEndDate,
    debouncedRecordCount,
    offset,
  ]);

  useEffect(() => {
    if (open && compMeasurePointId) {
      fetchData();
    }
  }, [open, compMeasurePointId, fetchData]);

  // داده‌های چارت
  const chartData = useMemo(() => {
    const xData: Date[] = [];
    const yData: number[] = [];

    logs.forEach((log) => {
      if (log.currentDate && log.currentValue != null) {
        xData.push(new Date(log.currentDate));
        yData.push(log.currentValue);
      }
    });

    return { xData, yData };
  }, [logs]);

  // دکمه‌های Previous / Next برای حالت تعداد
  const handleCountPrevious = () => {
    setOffset((prev) => prev + debouncedRecordCount);
  };

  const handleCountNext = () => {
    setOffset((prev) => Math.max(0, prev - debouncedRecordCount));
  };

  // Reset offset وقتی حالت تغییر می‌کنه
  useEffect(() => {
    setOffset(0);
  }, [useDateFilter]);

  const unitName = logs[0]?.tblUnit?.name;

  // @ts-ignore
  const measureName = logs[0]?.tblCompMeasurePoint?.tblCounterType?.name;
  const name = `${measureName} (${unitName})`;

  const lang = useAtomValue(atomLanguage);
  const isPersian = lang === "fa";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* فیلتر Panel */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            spacing={1.5}
          >
            {/* Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={useDateFilter}
                  onChange={(e) => setUseDateFilter(e.target.checked)}
                />
              }
              label={
                <Typography variant="subtitle2" fontWeight={600}>
                  Filter by Date Range
                </Typography>
              }
            />

            {!useDateFilter ? (
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                m={"0 !important"}
              >
                <IconButton
                  onClick={handleCountPrevious}
                  disabled={loading}
                  size="small"
                  color="primary"
                >
                  <NavigateBeforeIcon />
                </IconButton>
                <TextField
                  label="Number of Records"
                  type="number"
                  size="small"
                  value={recordCount}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val > 0) setRecordCount(val);
                  }}
                  disabled={loading}
                  inputProps={{ min: 1, max: 1000 }}
                  sx={{ width: 200 }}
                />
                <IconButton
                  onClick={handleCountNext}
                  disabled={loading || offset === 0}
                  size="small"
                  color="primary"
                >
                  <NavigateNextIcon />
                </IconButton>
              </Stack>
            ) : (
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                m={"0 !important"}
              >
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />

                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                />
              </Stack>
            )}
          </Stack>
        </Paper>

        {/* چارت */}
        <Box sx={{ width: "100%", height: 400 }}>
          {loading ? (
            <Spinner />
          ) : chartData.xData.length === 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <Typography color="text.secondary">No data available</Typography>
            </Box>
          ) : (
            <LineChart
              grid={{ horizontal: true, vertical: true }}
              xAxis={[
                {
                  data: chartData.xData,
                  scaleType: "time",
                  valueFormatter: (date) =>
                    formatDateTime(date, "DATE", isPersian, "MM/dd"),
                },
              ]}
              series={[
                {
                  data: chartData.yData,
                  label: name,
                  curve: "linear",
                  showMark: true,
                },
              ]}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
