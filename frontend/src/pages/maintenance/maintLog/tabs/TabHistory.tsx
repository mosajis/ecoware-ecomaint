import {
  tblJobDescription,
  tblMaintLog,
  TypeTblMaintLog,
} from "@/core/api/generated/api";
import Editor from "@/shared/components/Editor";
import Splitter from "@/shared/components/Splitter/Splitter";
import { useEffect, useState } from "react";

type props = {
  selected: TypeTblMaintLog;
  label?: string;
};

const TabHistory = (props: props) => {
  const { label, selected } = props;
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState("");

  useEffect(() => {
    if (!selected?.maintLogId) return;
    setLoading(true);
    tblMaintLog
      .getById(selected?.maintLogId, {
        include: {
          tblJobDescription: true,
        },
      })
      .then((res) => {
        setJobDesc(res.tblJobDescription?.jobDesc || "");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selected?.maintLogId]);

  return (
    <Splitter>
      <Editor
        loading={loading}
        label={"Job Description"}
        initValue={jobDesc}
        readOnly
      />
      <Editor label={"History"} initValue={selected?.history} readOnly />
    </Splitter>
  );
};

export default TabHistory;
