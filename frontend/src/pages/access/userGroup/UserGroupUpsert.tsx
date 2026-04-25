import { useEffect, useState } from "react";
import FormDialog from "@/shared/components/formDialog/FormDialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import {
  tblUserGroup,
  tblElement,
  TypeTblElement,
} from "@/core/api/generated/api";
import UserGroupTabs from "./UserGroupTabs";

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
  const [activeTab, setActiveTab] = useState(0);

  return (
    <FormDialog
      hideFooter
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={mode === "create" ? "Create" : "Edit"}
    >
      <UserGroupTabs />
    </FormDialog>
  );
};

export default UserGroupUpsert;
