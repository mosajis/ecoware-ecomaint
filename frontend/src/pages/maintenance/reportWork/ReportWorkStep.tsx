import React from "react";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ReportWorkStepper from "./reportWorkStepper";
import DialogActions from "@mui/material/DialogActions";
import FieldAsyncSelectGrid from "@/shared/components/fields/FieldAsyncSelectGrid";
import { useAtom } from "jotai";
import { reportWorkSteps } from "./reportWorkSteps";
import { atomActiveStep, atomInitalData } from "./ReportWorkAtom";
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";

interface ReportWorkStepProps {
  children: React.ReactNode;
  disabled?: boolean;
  onNext?: (goNext: () => void) => void;
  onPrev?: (prevStep: number) => void;
  onFinish?: () => void | Promise<void>;
  onDialogSuccess?: () => void;
  finishLabel?: string;
}

const ReportWorkStep: React.FC<ReportWorkStepProps> = ({
  children,
  disabled = false,
  onNext,
  onPrev,
  onFinish,
  onDialogSuccess,
  finishLabel = "Finish",
}) => {
  const totalSteps = reportWorkSteps.length;

  const [activeStep, setActiveStep] = useAtom(atomActiveStep);
  const [initalData, setInitData] = useAtom(atomInitalData);

  const handleNextClick = () => {
    if (onNext) {
      onNext(goNext);
    } else {
      goNext();
    }
  };

  const goNext = () => {
    if (activeStep < totalSteps - 1) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      setActiveStep(prevStep);
      onPrev?.(prevStep);
    }
  };

  const handleChangeComponentUnit = (
    componentUnit: TypeTblComponentUnit | null,
  ) => {
    setInitData({
      workOrder: null,
      componentUnit: componentUnit,
      maintLog: null,
    });
  };

  const handleFinish = async () => {
    if (onFinish) {
      await onFinish();
    }
    // Call parent dialog success handler
    onDialogSuccess?.();
  };

  // Disable if no component selected
  const isComponentDisabled = !initalData.componentUnit?.compId;

  // For steps after General, require maintLogId to be saved
  const requiresMaintLog = activeStep > 0;
  const hasMaintLog = !!initalData.maintLog?.maintLogId;
  const isMaintLogDisabled = requiresMaintLog && !hasMaintLog;

  const isDisabled = disabled || isComponentDisabled || isMaintLogDisabled;

  const isLastStep = activeStep === totalSteps - 1;

  return (
    <>
      <DialogContent
        dividers
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <ReportWorkStepper />
        <Box display={"grid"} gap={1.5} gridTemplateColumns={"1fr 1fr"}>
          <FieldAsyncSelectGrid
            label="Component"
            disabled={!!initalData.maintLog}
            request={tblComponentUnit.getAll}
            getOptionLabel={(row) => row.compNo}
            value={initalData.componentUnit}
            onChange={handleChangeComponentUnit}
            columns={[
              {
                field: "compNo",
                headerName: "Component",
                flex: 1,
              },
            ]}
            getRowId={(row) => row.compId}
          />
          <TextField
            fullWidth
            size="small"
            label="Job Title"
            disabled
            value={initalData.maintLog?.tblWorkOrder?.title || "--"}
            slotProps={{
              input: { readOnly: true },
              inputLabel: { shrink: true },
            }}
          />
        </Box>
        {initalData.componentUnit?.compId && children}
      </DialogContent>

      <DialogActions>
        <Button onClick={handlePrev} disabled={activeStep === 0}>
          Previous
        </Button>

        {activeStep && (
          <Button variant="contained" onClick={handleFinish}>
            {finishLabel}
          </Button>
        )}

        {!isLastStep && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleNextClick}
            disabled={isDisabled}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </>
  );
};

export default ReportWorkStep;
