import { memo, useState, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { BorderedBox } from "@/shared/components/BorderedBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import ReportPrintTemplate from "./ReportPrintTemplate";
import { TypeTblWorkOrderWithRels } from "../workOrderTypes";
import { useReactToPrint } from "react-to-print";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  workOrders: TypeTblWorkOrderWithRels[];
};

function ReportPrintDialog({
  onSubmit,
  open,
  title,
  onClose,
  workOrders,
}: Props) {
  const [outputFormat, setOutputFormat] = useState<string>("list");
  const [sortOrder, setSortOrder] = useState<string>("component");

  const contentRef = useRef<HTMLDivElement>(null);
  const printFn = useReactToPrint({ contentRef });

  const handlePrint = useCallback(() => {
    printFn();
  }, [printFn]);

  return (
    <FormDialog open={open} onClose={onClose} title={title} onSubmit={onSubmit}>
      {/* Output Format Section */}
      <Box display={"flex"} gap={1}>
        <BorderedBox label="Output Format" direction="column">
          <RadioGroup
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          >
            <FormControlLabel
              style={{ height: "1.8rem" }}
              value="list"
              control={<Radio size="small" />}
              label="List"
            />
            <FormControlLabel
              style={{ height: "1.8rem" }}
              value="details"
              control={<Radio size="small" />}
              label="List With Details"
            />
          </RadioGroup>
        </BorderedBox>

        {/* Sort Order Section */}
        <BorderedBox label="Sort Order" direction="column">
          <RadioGroup
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <FormControlLabel
              style={{ height: "1.8rem" }}
              value="component"
              control={<Radio size="small" />}
              label="Component"
            />
            <FormControlLabel
              style={{ height: "1.8rem" }}
              value="workOrderNumber"
              control={<Radio size="small" />}
              label="Work Order Number"
            />
            <FormControlLabel
              style={{ height: "1.8rem" }}
              value="dueDate"
              control={<Radio size="small" />}
              label="Due Date"
            />
          </RadioGroup>
        </BorderedBox>
      </Box>
      <Button
        onClick={handlePrint}
        variant="outlined"
        color="primary"
        sx={{ mt: 1, width: "100%" }}
      >
        Print
      </Button>
      {/* Hidden Print Template */}
      <Box display="none">
        <ReportPrintTemplate ref={contentRef} workOrders={workOrders} />
      </Box>
    </FormDialog>
  );
}

export default memo(ReportPrintDialog);
