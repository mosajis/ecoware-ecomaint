import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import PrintIcon from "@mui/icons-material/Print";
import WorkOrderReport from "./report/Report";
import { useState, useRef } from "react";
import { BorderedBox } from "@/shared/components/BorderedBox";
import { useReactToPrint } from "react-to-print";
import { TypeTblWorkOrderWithRels } from "./types";

type OutputFormat = "list" | "details";
type SortOrder = "component" | "workOrderNumber" | "dueDate";

type Props = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  readOnly?: boolean;
  workOrders: TypeTblWorkOrderWithRels[];
};

export default function WorkOrderDialogPrint({
  onSubmit,
  open,
  title,
  onClose,
  readOnly,
  workOrders,
}: Props) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("list");
  const [sortOrder, setSortOrder] = useState<SortOrder>("component");

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onSubmit}
      readonly={readOnly}
    >
      <Stack spacing={1.5}>
        {/* Settings */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <BorderedBox
            label="Output Format"
            direction="column"
            sx={{ flex: 1 }}
          >
            <RadioGroup
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            >
              <FormControlLabel
                value="list"
                control={<Radio size="small" />}
                label="List"
              />
              <FormControlLabel
                value="details"
                control={<Radio size="small" />}
                label="By Details"
              />
            </RadioGroup>
          </BorderedBox>
          <Divider orientation="vertical" flexItem />

          <BorderedBox label="Sort Order" direction="column" sx={{ flex: 1 }}>
            <RadioGroup
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
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
        </Stack>

        <Divider />

        {/* Action */}
        <Button
          onClick={handlePrint}
          variant="contained"
          size="large"
          startIcon={<PrintIcon />}
          sx={{
            alignSelf: "stretch",
            py: 1.2,
            fontWeight: 600,
          }}
        >
          Print Report
        </Button>
      </Stack>

      {/* Hidden printable content */}
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
