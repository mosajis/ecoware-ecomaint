import Spinner from "@/shared/components/Spinner";
import Dialog from "@mui/material/Dialog";
import DialogHeader from "@/shared/components/dialog/DialogHeader";
import ReportWorkTabs from "./ReportWorkTabs";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { reportWorkAtom } from "./ReportWorkAtom";
import { atomUser } from "@/pages/auth/auth.atom";
import { generateNextWorkORder } from "@/core/api/api";
import {
  tblComponentUnit,
  tblMaintLog,
  tblWorkOrder,
  TypeTblComponentUnit,
  TypeTblMaintLog,
} from "@/core/api/generated/api";

type Props = {
  open: boolean;
  onSuccess: (t: any) => void;
  onClose: () => void;
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
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const [reportWork, setReportWork] = useAtom(reportWorkAtom);
  const { maintLog, workOrder } = reportWork;

  const user = useAtomValue(atomUser);

  const userId = user?.userId as number;
  /* ================= Fetch Data ================= */
  useEffect(() => {
    if (!open) {
      setReportWork({
        maintLog: null,
        workOrder: null,
        componentUnit: null,
      });
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Edit Mode
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

          const maintLog = { ...result } as TypeTblMaintLog;
          const componentUnit = result.tblComponentUnit as TypeTblComponentUnit;
          const workOrder = result.tblWorkOrder as any;

          setReportWork({
            maintLog,
            componentUnit,
            workOrder,
          });
        }

        // From WorkOrder
        else if (workOrderId) {
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

          const maintLog = {
            tblMaintType: workOrder.tblMaintType || null,
            tblMaintCause: workOrder.tblMaintCause || null,
            tblMaintClass: workOrder.tblMaintClass || null,
            tblJobDescription: workOrder.tblCompJob?.tblJobDescription || null,
            tblWorkOrder: workOrder,
          };

          setReportWork({
            maintLog: maintLog as any,
            componentUnit,
            workOrder: workOrder as any,
          });
        }

        // From Component Unit
        else if (componentUnitId) {
          const componentUnit = await tblComponentUnit.getById(componentUnitId);
          setReportWork({
            componentUnit,
            maintLog: null,
            workOrder: null,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [open, maintLogId, workOrderId, componentUnitId]);

  const handleClose = async () => {
    if (workOrderId) {
      setIsLoadingSubmit(true);
      const record = await tblWorkOrder.update(
        workOrderId,
        {
          completed: new Date().toString(),
          tblWorkOrderStatus: {
            connect: {
              workOrderStatusId: 5,
            },
          },
        },
        { include: { tblWorkOrderStatus: true } },
      );

      if (record.workOrderTypeId === 1 && reportWork?.maintLog?.maintLogId) {
        await generateNextWorkORder(reportWork.maintLog.maintLogId, userId);
      }
      setIsLoadingSubmit(false);
      onSuccess(record);
    }
    onSuccess({});
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogHeader
        title={`Report Work / ${workOrder?.title ?? reportWork.componentUnit?.compNo ?? ""}`}
        onClose={handleClose}
        loading={isLoadingSubmit || isLoading}
      />
      <DialogContent
        dividers
        style={{
          padding: "4px",
          height: "630px",
          background: "var(--template-palette-background-default)",
        }}
      >
        {isLoading ? <Spinner /> : <ReportWorkTabs />}
      </DialogContent>
    </Dialog>
  );
};

export default ReportWorkDialog;
