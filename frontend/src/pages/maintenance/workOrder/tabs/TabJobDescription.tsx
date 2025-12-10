import Editor from "@/shared/components/Editor";

interface Props {
  workOrderId?: number | null;
  label?: string | null;
}

const TabJobDescription = (props: Props) => {
  return <Editor />;
};

export default TabJobDescription;
