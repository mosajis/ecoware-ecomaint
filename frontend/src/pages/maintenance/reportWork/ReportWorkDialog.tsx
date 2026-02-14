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
  tblPendingType,
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
          const workOrder = result.tblWorkOrder;

          setInitData({
            maintLog,
            componentUnit,
            workOrder,
          });
        } else if (workOrderId) {
          const workOrder = await tblWorkOrder.getById(workOrderId, {
            include: {
              tblComponentUnit: true,
              tblPendingType: true,
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

          const initialMaintLog = {
            tblMaintType: workOrder.tblMaintType || null,
            tblMaintCause: workOrder.tblMaintCause || null,
            tblMaintClass: workOrder.tblMaintClass || null,
            tblJobDescription: workOrder.tblCompJob?.tblJobDescription || null,
            tblWorkOrder: workOrder,
          };

          setInitData({
            maintLog: initialMaintLog as any,
            componentUnit,
            workOrder,
          });
        } else if (componentUnitId) {
          const componentUnit = await tblComponentUnit.getById(componentUnitId);
          setInitData({ componentUnit, maintLog: null, workOrder: null });
        } else {
          setInitData({ componentUnit: null, maintLog: null, workOrder: null });
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
    onSuccess?.(workOrderId);
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
            <StepComponent onFinish={handleSuccess} />
          </Suspense>
        )}
      </Box>
    </Dialog>
  );
};

export default ReportWorkDialog;
