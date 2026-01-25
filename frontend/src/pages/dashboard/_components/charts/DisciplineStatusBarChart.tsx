import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  title: string;
  statuses: { id: number; name: string; color?: string }[];
  data: number[];
};

export function DisciplineStatusBarChart({ title, statuses, data }: Props) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} mb={3}>
          {title}
        </Typography>
        <BarChart
          height={250}
          xAxis={[
            {
              data: statuses.map((s) => s.name),
              scaleType: "band",
            },
          ]}
          series={[{ data, label: "Count" }]}
          colors={[statuses.map((s) => s.color)]}
          margin={{ bottom: 30, left: 40, right: 10, top: 10 }}
        />
      </CardContent>
    </Card>
  );
}
