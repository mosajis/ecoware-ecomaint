import * as React from "react";
import Box from "@mui/material/Box";
import { formatDateTime } from "@/core/helper";
import { useAtom } from "jotai";
import { atomLanguage } from "@/shared/atoms/general.atom";

import "@/assets/fonts/digit.css";

function pad(num: number) {
  return String(num).padStart(2, "0");
}

export default function DigitalTime() {
  const [time, setTime] = React.useState(() => new Date());
  const [locale] = useAtom(atomLanguage);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  const formattedDate = formatDateTime(
    time.toISOString(),
    undefined,
    locale === "fa",
    "EEEE, MMM d, yyyy",
  );

  return (
    <Box
      textAlign={"center"}
      display={"flex"}
      flexDirection={"column"}
      position="relative"
      top="2px"
    >
      <Box
        sx={{
          fontFamily: "Digital",
          fontSize: "1.65rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          lineHeight: 0.7,
          justifyContent: "center",
        }}
      >
        <span>{hours}</span>
        <span>:</span>
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </Box>
      <Box fontSize={"10px"} pt={"1.5px"}>
        {formattedDate}
      </Box>
    </Box>
  );
}
