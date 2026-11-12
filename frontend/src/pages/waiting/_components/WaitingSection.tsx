import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const WaitingSection = ({ title, subtitle, children }: Props) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}

      <Box mt={1.5}>{children}</Box>
    </Paper>
  );
};

export default WaitingSection;
