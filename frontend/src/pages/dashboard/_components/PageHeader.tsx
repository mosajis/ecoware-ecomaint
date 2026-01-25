import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: Props) {
  return (
    <Box gap={1.5} mb={2}>
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
