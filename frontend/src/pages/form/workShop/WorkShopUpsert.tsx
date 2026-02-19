import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogHeader from "@/shared/components/dialog/DialogHeader";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import WorkShopTabs from "./WorkShopTabs";
import { memo, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { tblWorkShop } from "@/core/api/generated/api";
import { atomInitData, Type } from "./WorkShopAtom";
import Spinner from "@/shared/components/Spinner";

type Props = {
  open: boolean;
  mode: "create" | "update";
  workShopId?: number | null;
  onClose: () => void;
  onSuccess: (initData: Type) => void;
};

function WorkShopUpsert({ open, workShopId, onClose, onSuccess }: Props) {
  const [initData, setInitData] = useAtom(atomInitData);
  const [loading, setLoading] = useState(false);

  const mode = workShopId ? "update" : "create";

  useEffect(() => {
    if (!open) {
      setInitData({ workShop: null });
    }
  }, [open, setInitData]);

  useEffect(() => {
    if (!open || mode !== "update" || !workShopId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const workShop = await tblWorkShop.getById(workShopId, {
          include: {
            tblDiscipline: true,
            tblUsersTblWorkShopPersonInChargeIdTotblUsers: {
              include: {
                tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
              },
            },
            tblUsersTblWorkShopPersonInChargeApproveIdTotblUsers: {
              include: {
                tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
              },
            },
            tblUsersTblWorkShopClosedByIdTotblUsers: {
              include: {
                tblEmployeeTblUsersEmployeeIdTotblEmployee: true,
              },
            },
          },
        });
        setInitData({ workShop });
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, mode, workShopId, setInitData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogHeader
        title={mode === "create" ? "Create WorkShop" : "Edit WorkShop"}
        onClose={onClose}
      />

      <DialogContent
        dividers
        style={{
          height: 700,
          padding: "4px",
          background: "var(--template-palette-background-default)",
        }}
      >
        {loading ? (
          <Spinner />
        ) : (
          <WorkShopTabs mode={mode} workShopId={workShopId} />
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={() => onSuccess(initData)}
          sx={{ width: 200 }}
          variant={initData?.workShop?.workShopId ? "contained" : "outlined"}
          disabled={!initData?.workShop?.workShopId}
        >
          Ok
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ width: 200 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(WorkShopUpsert);
