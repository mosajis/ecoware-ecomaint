import Dialog from "@mui/material/Dialog";
import Spinner from "@/shared/components/Spinner";
import DialogHeader from "@/shared/components/dialog/DialogHeader";
import Box from "@mui/material/Box";
import { Suspense, useEffect, useState } from "react";
import { reportWorkSteps } from "./reportWorkSteps";
import { useAtomValue, useSetAtom } from "jotai";
import { atomActiveStep, atomInitalData } from "./ReportWorkAtom";
import { tblComponentUnit, tblMaintLog } from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onClose: () => void;
  componentUnitId?: number;
  maintLogId?: number;
};

const ReportWorkDialog = ({
  open,
  onClose,
  componentUnitId,
  maintLogId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const activeStep = useAtomValue(atomActiveStep);
  const setInitData = useSetAtom(atomInitalData);

  const StepComponent = reportWorkSteps[activeStep].component;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (componentUnitId) {
          const componentUnit = await tblComponentUnit.getById(componentUnitId);
          setInitData((prev) => ({ componentUnit, maintLog: null }));
        }

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

          setInitData({
            maintLog,
            componentUnit,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && (componentUnitId || maintLogId)) {
      fetchData();
    }
  }, [open, componentUnitId, maintLogId, setInitData]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogHeader
        title="Report Work"
        onClose={onClose}
        loading={isLoading || isLoading}
      />
      <Box height={"650px"} display="flex" flexDirection="column">
        {isLoading ? (
          <Spinner />
        ) : (
          <Suspense fallback={<Spinner />}>
            <StepComponent />
          </Suspense>
        )}
      </Box>
    </Dialog>
  );
};

export default ReportWorkDialog;
