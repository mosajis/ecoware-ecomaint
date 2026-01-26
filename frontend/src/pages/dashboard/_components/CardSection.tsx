import Box from "@mui/material/Box";
import { PageHeader } from "../../../shared/components/PageHeader";
import { DashboardCard, DashboardCardProps } from "./Card";

type Props = {
  title: string;
  subtitle?: string;
  cards: DashboardCardProps[];
  cols?: number;
};

const CardSection = ({ title, subtitle, cards, cols = 3 }: Props) => (
  <Box p={1.5}>
    <PageHeader title={title} subtitle={subtitle} />
    <Box display="grid" gridTemplateColumns={`repeat(${cols}, 1fr)`} gap={1.5}>
      {cards.map((kpi) => (
        <DashboardCard key={kpi.label} {...kpi} />
      ))}
    </Box>
  </Box>
);

export default CardSection;
