import { memo, useState, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import { BorderedBox } from "@/shared/components/BorderedBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { useReactToPrint } from "react-to-print";
import WorkOrderReport from "./report/Report";
import { TypeTblWorkOrderWithRels } from "./types";

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
  const [outputFormat, setOutputFormat] = useState<"list" | "details">("list");
  const [sortOrder, setSortOrder] = useState<
    "component" | "workOrderNumber" | "dueDate"
  >("component");

  const contentRef = useRef<HTMLDivElement>(null);
  const printFn = useReactToPrint({ contentRef });

  const handlePrint = useCallback(() => {
    printFn();
  }, [printFn]);

  return (
    <FormDialog open={open} onClose={onClose} title={title} onSubmit={onSubmit}>
      <Box display="flex" gap={2}>
        <BorderedBox label="Output Format" direction="column">
          <RadioGroup
            value={outputFormat}
            onChange={(e) =>
              setOutputFormat(e.target.value as "list" | "details")
            }
          >
            <FormControlLabel
              value="list"
              control={<Radio size="small" />}
              label="List"
            />
            <FormControlLabel
              value="details"
              control={<Radio size="small" />}
              label="List With Details"
            />
          </RadioGroup>
        </BorderedBox>

        <BorderedBox label="Sort Order" direction="column">
          <RadioGroup
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(
                e.target.value as "component" | "workOrderNumber" | "dueDate",
              )
            }
          >
            <FormControlLabel
              value="component"
              control={<Radio size="small" />}
              label="Component"
            />
            <FormControlLabel
              value="workOrderNumber"
              control={<Radio size="small" />}
              label="Work Order Number"
            />
            <FormControlLabel
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
        sx={{ mt: 2, width: "100%" }}
      >
        Print
      </Button>

      <Box display="none">
        <WorkOrderReport
          ref={contentRef}
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      </Box>
    </FormDialog>
  );
}

export default memo(ReportPrintDialog);
