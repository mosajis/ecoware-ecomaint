import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Timer from "@mui/icons-material/Timer";
import Spinner from "@/shared/components/Spinner";
import CellDateTime from "@/shared/components/dataGrid/cells/CellDateTime";
import { useEffect, useState } from "react";
import { getCountersAlert } from "@/core/api/api";
import CounterAlertTabs from "./CounterAlertTabs";

const CountersAlert = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCountersAlert()
      .then((data) => {
        setAlerts(data.items);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return <CounterAlertTabs label={"test"} counterAlerts={alerts} />;
};

export default CountersAlert;
