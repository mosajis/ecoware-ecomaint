import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
}

const WaitingMetricCard = ({ title, value, subtitle }: Props) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="h4" fontWeight={700} mt={0.75}>
        {value}
      </Typography>

      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

export default WaitingMetricCard;
