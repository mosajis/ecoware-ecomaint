import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: Props) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={3}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
