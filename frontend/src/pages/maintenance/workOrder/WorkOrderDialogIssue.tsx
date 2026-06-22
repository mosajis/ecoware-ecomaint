import FormDialog from "@/shared/components/formDialog/FormDialog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import PrintIcon from "@mui/icons-material/Print";
import PrintTemplate from "./print/PrintTemplate";
import { useState, useRef, useCallback } from "react";
import { BorderedBox } from "@/shared/components/BorderedBox";
import { useReactToPrint } from "react-to-print";
import { TypeTblWorkOrder } from "@/core/api/generated/api";
import { tblWorkOrder } from "@/core/api/generated/api";
import { toast } from "sonner";
import { workOrderIssue } from "@/core/api/api";

type OutputFormat = "list" | "details";
type SortOrder = "component" | "workOrderNumber" | "dueDate";

type Props = {
  open: boolean;
  onClose: () => void;
  workOrders: TypeTblWorkOrder[];
  onSuccess: (data: TypeTblWorkOrder[]) => void;
};

export default function WorkOrderDialogIssue({
  open,
  onClose,
  workOrders,
  onSuccess,
}: Props) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("list");
  const [sortOrder, setSortOrder] = useState<SortOrder>("component");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  const handleSubmit = useCallback(async () => {
    if (!workOrders.length) return;

    setLoading(true);
    try {
      const result = await workOrderIssue({
        workOrderIds: workOrders.map((wo) => wo.workOrderId),
      });

      onSuccess(result.workOrders as any);

      onClose();
    } catch (error) {
      toast.error("Failed to issue work orders");
    } finally {
      setLoading(false);
    }
  }, [workOrders, onSuccess, onClose]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Issue WorkOrder(s)"
      loadingInitial={loading}
      submitText="Issue"
    >
      <Stack spacing={1.5}>
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
                value="dueDate"
                control={<Radio size="small" />}
                label="Due Date"
              />
            </RadioGroup>
          </BorderedBox>
        </Stack>
        <Divider />
        <Button
          onClick={handlePrint}
          variant="outlined"
          size="large"
          startIcon={<PrintIcon />}
          sx={{ alignSelf: "stretch", py: 1.2, fontWeight: 600 }}
        >
          Print Preview
        </Button>
      </Stack>

      <Box display="none">
        <PrintTemplate
          ref={contentRef}
          workOrders={workOrders}
          outputFormat={outputFormat}
          sortOrder={sortOrder}
        />
      </Box>
    </FormDialog>
  );
}
