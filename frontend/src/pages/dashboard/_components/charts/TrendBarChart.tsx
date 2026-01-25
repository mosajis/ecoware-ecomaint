import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  title?: string;
  xAxis: string[];
  created: number[];
  completed: number[];
};

export function TrendBarChart({
  title = "Created vs Completed Trend",
  xAxis,
  created,
  completed,
}: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={3}>
          {title}
        </Typography>
        <BarChart
          height={300}
          xAxis={[{ data: xAxis, scaleType: "band" }]}
          series={[
            { data: created, label: "Created", color: "#42a5f5" },
            { data: completed, label: "Completed", color: "#66bb6a" },
          ]}
          margin={{ bottom: 40, left: 40, right: 10, top: 10 }}
        />
      </CardContent>
    </Card>
  );
}
