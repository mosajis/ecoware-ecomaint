import FormDialog from "@/shared/components/formDialog/FormDialog";
import UserGroupTabs from "./UserGroupTabs";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { atomUserGroupId } from "./UserGroupAtom";

interface UserGroupUpsertProps {
  open: boolean;
  mode: "create" | "update";
  recordId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UserGroupUpsert = ({
  open,
  mode,
  recordId,
  onClose,
  onSuccess,
}: UserGroupUpsertProps) => {
  const [, setUserGroupId] = useAtom(atomUserGroupId);

  useEffect(() => {
    setUserGroupId(recordId);
  }, [recordId, setUserGroupId]);

  return (
    <FormDialog
      hideFooter
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={mode === "create" ? "Create UserGroup" : "Edit UserGroup"}
    >
      <UserGroupTabs />
    </FormDialog>
  );
};

export default UserGroupUpsert;
