import Editor from "@/shared/components/Editor";
import { useEditor } from "@/shared/hooks/useEditor";
import { tblJobDescription } from "@/core/api/generated/api";

interface Props {
  jobDescriptionId?: number | null;
  label?: string | null;
}
const TabJobDescription = ({ label, jobDescriptionId }: Props) => {
  const { data, loading, save } = useEditor({
    id: jobDescriptionId,
    fetcher: tblJobDescription.getById,
    updater: tblJobDescription.update,
  });

  return (
    <Editor
      autoSave
      readOnly={!jobDescriptionId}
      label={label || "Details"}
      initValue={data?.jobDesc}
      loading={loading}
      onSave={(value) => save({ jobDesc: value })}
    />
  );
};

export default TabJobDescription;
