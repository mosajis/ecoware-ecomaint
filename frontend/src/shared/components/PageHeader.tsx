import { type SxProps } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type Props = {
  title: string;
  subtitle?: string;
  sx?: SxProps;
};

export function PageHeader({ title, subtitle, sx }: Props) {
  return (
    <Box gap={1.5} mb={2} sx={sx}>
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
