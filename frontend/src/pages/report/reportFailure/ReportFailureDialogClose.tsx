import FormDialog from "@/shared/components/formDialog/FormDialog";
import Editor from "@/shared/components/Editor";
import FieldDateTime from "@/shared/components/fields/FieldDateTime";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { tblFailureReports } from "@/core/api/generated/api";
import { buildRelation } from "@/core/helper";
import { useAtomValue } from "jotai";
import { atomUser } from "@/pages/auth/auth.atom";

type Props = {
  open: boolean;
  failureReportId: number | null;
  onClose: () => void;
  onSuccess: (record: any) => void;
};

export default function ReportFailureCloseDialog({
  open,
  failureReportId,
  onClose,
  onSuccess,
}: Props) {
  const [followDesc, setFollowDesc] = useState("");
  const [closedDateTime, setClosedDateTime] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  const user = useAtomValue(atomUser);
  const userId = user?.userId as number;

  useEffect(() => {
    if (!open || !failureReportId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await tblFailureReports.getById(failureReportId);

        setFollowDesc(res.followDesc ?? "");
        setClosedDateTime(
          res.closedDateTime ? new Date(res.closedDateTime) : new Date(),
        );
      } catch (error: any) {
        toast.error(error?.message || "Failed to load failure report");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, failureReportId]);

  useEffect(() => {
    if (!open) {
      setFollowDesc("");
      setClosedDateTime(new Date());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!failureReportId) return;

    setLoading(true);

    try {
      const record = await tblFailureReports.update(failureReportId, {
        closedDateTime: closedDateTime?.toString(),
        followDesc,
        tblUsers: buildRelation("tblUsers", "userId", userId),
      });

      onSuccess({ ...record, tblUsers: { userId, uName: user?.uName } });
      toast.success("Failure Report closed");
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to close");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !closedDateTime || loading;
  return (
    <FormDialog
      open={open}
      title="Close Failure Report"
      submitText="Ok"
      cancelText="Cancel"
      onClose={onClose}
      onSubmit={handleSubmit}
      loadingInitial={loading}
    >
      <Box display="flex" flexDirection="column" gap={1.5} height={300}>
        <FieldDateTime
          type="DATETIME"
          label="Closed Date"
          disabled={disabled}
          field={{
            value: closedDateTime,
            onChange: (v: Date) => setClosedDateTime(v),
          }}
        />

        <Editor
          disabled={disabled}
          label="Follow Description"
          initValue={followDesc}
          onChange={(v) => setFollowDesc(v)}
        />
      </Box>
    </FormDialog>
  );
}
