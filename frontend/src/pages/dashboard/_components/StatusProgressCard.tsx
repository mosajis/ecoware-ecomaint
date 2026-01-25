import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

type Props = {
  title: string;
  count: number;
  progress: number;
  color: string;
};

export function StatusProgressCard({ title, count, progress, color }: Props) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color }}>
              {count}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: color,
              },
            }}
          />

          <Typography variant="caption" align="right">
            {progress}%
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
