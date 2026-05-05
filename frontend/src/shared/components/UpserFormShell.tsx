import React from "react";
import FormDialog from "@/shared/components/formDialog/FormDialog";

type Mode = "create" | "update" | "view";

function getTitle(entity: string, mode: Mode) {
  const action =
    mode === "create" ? "Create" : mode === "update" ? "Edit" : "View";

  return `${action} ${entity}`;
}

type UpsertFormShellProps = {
  entityName: string;
  mode: Mode;

  form: {
    isView: boolean;
    loadingInitial: boolean;
    submitting: boolean;
    handleSubmit: any;
    submit: (values: any) => Promise<void>;
  };

  dialog: {
    open: boolean;
    onClose: () => void;
  };

  children: React.ReactNode;
};

export default function UpsertFormShell({
  entityName,
  mode,
  form,
  dialog,
  children,
}: UpsertFormShellProps) {
  return (
    <FormDialog
      open={dialog.open}
      onClose={dialog.onClose}
      title={getTitle(entityName, mode)}
      readonly={form.isView}
      loadingInitial={form.loadingInitial}
      submitting={form.submitting}
      onSubmit={form.handleSubmit(form.submit)}
    >
      {children}
    </FormDialog>
  );
}
