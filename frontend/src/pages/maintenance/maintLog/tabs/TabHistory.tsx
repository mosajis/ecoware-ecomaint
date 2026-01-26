import { TypeTblMaintLog } from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";

type props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabHistory = (props: props) => {
  const { label, selected } = props;

  return (
    <Editor label={label || "History"} initValue={selected?.history} readOnly />
  );
};

export default TabHistory;
