import Box from "@mui/material/Box";
import { PageHeader } from "./PageHeader";
import { KPICard, KPICardProps } from "./KPICard";

type Props = {
  title: string;
  subtitle?: string;
  kpis: KPICardProps[];
  columns?: number;
  cols?: number;
};

const KpiSection = ({ title, subtitle, kpis, cols = 3 }: Props) => (
  <Box p={1.5}>
    <PageHeader title={title} subtitle={subtitle} />
    <Box display="grid" gridTemplateColumns={`repeat(${cols}, 1fr)`} gap={1.5}>
      {kpis.map((kpi) => (
        <KPICard key={kpi.label} {...kpi} />
      ))}
    </Box>
  </Box>
);

export default KpiSection;
