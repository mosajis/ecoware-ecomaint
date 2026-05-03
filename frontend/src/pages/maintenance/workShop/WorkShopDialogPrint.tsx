import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import PrintIcon from "@mui/icons-material/Print";
import PrintTemplate from "./print/PrintTemplate";
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import {
  tblWorkShop,
  tblWorkShopComponent,
  TypeTblWorkShop,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onClose: () => void;
  workShopId: number;
};

export default function WorkShopDialogPrint({
  open,
  onClose,
  workShopId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [workShop, setWorkShop] = useState<TypeTblWorkShop | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  useEffect(() => {
    if (!open || !workShopId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch workshop info and components in parallel
        const [res, components] = await Promise.all([
          tblWorkShop.getById(workShopId, {
            include: {
              tblDiscipline: true,
              tblEmployeeTblWorkShopPersonInChargeIdTotblEmployee: true,
              tblEmployeeTblWorkShopClosedByIdTotblEmployee: true
            },
          }),
          tblWorkShopComponent.getAll({
            filter: { workShopId },
            include: {
              tblComponentUnit: {
                include: {
                  tblLocation: true,
                  tblCompType: true,
                },
              },
              tblLocation: true,
            },
          }),
        ]);

        // Merge components into workShop object
        setWorkShop({ ...res, tblWorkShopComponents: components.items } as any);
      } catch {
        toast.error("Failed to fetch WorkShop Data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workShopId, open]);

  // Reset on close
  useEffect(() => {
    if (!open) setWorkShop(null);
  }, [open]);

  return (
    <FormDialog
      open={open}
      title="Print"
      onClose={onClose}
      loadingInitial={loading}
      hideFooter
      maxWidth="xs"
    >
      <Box display="flex" flexDirection="column" gap={2} p={1}>
        <Typography variant="body1" color="text.secondary" mb={2}>
          You are about to print the Work Shop. Please make sure all information
          is correct before printing.
        </Typography>

        <Button
          onClick={handlePrint}
          variant="contained"
          loading={!workShop}
          size="medium"
          startIcon={<PrintIcon />}
          sx={{
            alignSelf: "center",
            py: 1.5,
            px: 4,
            fontWeight: 600,
            fontSize: "1rem",
            width: "100%",
          }}
          disabled={!workShop}
        >
          Print Report
        </Button>
      </Box>

      {/* Hidden printable content */}
      <Box display="none">
        {workShop?.workShopId && (
          <PrintTemplate ref={contentRef} workShop={workShop} />
        )}
      </Box>
    </FormDialog>
  );
}
