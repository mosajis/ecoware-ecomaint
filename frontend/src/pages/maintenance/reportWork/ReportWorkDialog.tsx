import Dialog from "@mui/material/Dialog";
import Spinner from "@/shared/components/Spinner";
import DialogHeader from "@/shared/components/dialog/DialogHeader";
import Box from "@mui/material/Box";
import { Suspense, useEffect, useState } from "react";
import { reportWorkSteps } from "./reportWorkSteps";
import { useAtomValue, useSetAtom } from "jotai";
import {
  atomActiveStep,
  atomInitalData,
  atomIsDirty,
  resetReportWorkAtoms,
} from "./ReportWorkAtom";
import {
  tblComponentUnit,
  tblMaintLog,
  tblWorkOrder,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  componentUnitId?: number;
  maintLogId?: number;
  workOrderId?: number;
};

const ReportWorkDialog = ({
  open,
  onClose,
  onSuccess,
  componentUnitId,
  maintLogId,
  workOrderId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const activeStep = useAtomValue(atomActiveStep);
  const setActiveStep = useSetAtom(atomActiveStep);
  const setInitData = useSetAtom(atomInitalData);
  const setIsDirty = useSetAtom(atomIsDirty);

  const StepComponent = reportWorkSteps[activeStep].component;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        if (maintLogId) {
          // حالت ۱: ویرایش maintLog موجود
          const result = await tblMaintLog.getById(maintLogId, {
            include: {
              tblComponentUnit: true,
              tblMaintCause: true,
              tblMaintClass: true,
              tblMaintType: true,
              tblWorkOrder: true,
              tblJobDescription: true,
            },
          });
          const maintLog = { ...result, tblComponentUnit: null };
          const componentUnit = result.tblComponentUnit || null;

          setInitData({
            maintLog,
            componentUnit,
          });
        } else if (workOrderId) {
          // حالت ۲: ایجاد maintLog جدید از روی workOrder
          const workOrder = await tblWorkOrder.getById(workOrderId, {
            include: {
              tblComponentUnit: true,
              tblMaintType: true,
              tblMaintCause: true,
              tblMaintClass: true,
              tblCompJob: {
                include: {
                  tblJobDescription: true,
                },
              },
            },
          });

          const componentUnit = workOrder.tblComponentUnit || null;

          // ایجاد یک maintLog اولیه با مقادیر از workOrder
          const initialMaintLog = {
            tblMaintType: workOrder.tblMaintType || null,
            tblMaintCause: workOrder.tblMaintCause || null,
            tblMaintClass: workOrder.tblMaintClass || null,
            tblJobDescription: workOrder.tblCompJob?.tblJobDescription || null,
            tblWorkOrder: workOrder,
            history: "",
          };

          setInitData({
            maintLog: initialMaintLog as any,
            componentUnit,
          });
        } else if (componentUnitId) {
          // حالت ۳: ایجاد maintLog جدید فقط با component
          const componentUnit = await tblComponentUnit.getById(componentUnitId);
          setInitData({ componentUnit, maintLog: null });
        } else {
          // حالت ۴: بدون هیچ ID - باید component انتخاب شود
          setInitData({ componentUnit: null, maintLog: null });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, componentUnitId, maintLogId, workOrderId, setInitData]);

  const handleClose = () => {
    // Reset all atoms when closing
    resetReportWorkAtoms(setActiveStep, setInitData, setIsDirty);
    onClose();
  };

  const handleSuccess = () => {
    // Call parent onSuccess callback
    onSuccess?.();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogHeader
        title="Report Work"
        onClose={handleClose}
        loading={isLoading}
      />
      <Box height={"650px"} display="flex" flexDirection="column">
        {isLoading ? (
          <Spinner />
        ) : (
          <Suspense fallback={<Spinner />}>
            <StepComponent onDialogSuccess={handleSuccess} />
          </Suspense>
        )}
      </Box>
    </Dialog>
  );
};

export default ReportWorkDialog;
