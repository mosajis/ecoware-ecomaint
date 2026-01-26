import { TypeTblMaintLog } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

type props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabOverDueHistory = (props: props) => {
  const { label, selected } = props;

  return (
    <Editor
      label={label || "OverDue Reason"}
      initValue={selected?.overdueReason}
      readOnly
    />
  );
};

export default TabOverDueHistory;
