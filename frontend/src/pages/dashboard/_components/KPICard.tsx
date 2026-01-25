import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export type KPICardProps = {
  label: string;
  value: string | number;
  color: string;
  percent?: string | number;
};

export function KPICard({ label, value, color, percent }: KPICardProps) {
  return (
    <Card
      sx={{
        borderTop: `4px solid rgb(${color})`,
        height: "100%",
        width: "100%",
        background: `rgba(${color}, 0.065) !important`,
      }}
    >
      <CardContent>
        <Typography variant="caption" color="textSecondary" fontWeight={"bold"}>
          {label}
        </Typography>
        <Box
          mt={"5px"}
          display={"flex"}
          alignItems={"baseline"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6" sx={{ color }}>
            {value}
          </Typography>
          {percent && (
            <Typography
              textAlign={"center"}
              variant="h6"
              fontWeight={700}
              sx={{ color }}
            >
              {percent}%
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
