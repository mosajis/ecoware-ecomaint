import Editor from "@/shared/components/Editor";

interface TabDetailsProps {
  functionId?: number | null;
  label?: string | null;
}

const TabDetails = (props: TabDetailsProps) => {
  const { label, functionId } = props;

  const handleSave = () => {};

  return (
    <Editor
      label={label || "Details"}
      autoSave
      initValue={""}
      onSave={handleSave}
    />
  );
};

export default TabDetails;
