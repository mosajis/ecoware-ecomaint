import Spinner from "@/shared/components/Spinner";
import Tabs from "./MaintLogTabs";
import { useEffect, useState } from "react";
import { RouteDetail } from "./MaintLogRoute";

import { tblMaintLog, TypeTblMaintLog } from "@/core/api/generated/api";

const MaintLogDetail = () => {
  const { id } = RouteDetail.useParams();
  const { breadcrumb } = RouteDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTblMaintLog | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblMaintLog
      .getById(id)
      .then((res) => setData(res as TypeTblMaintLog))
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  if (!data) return null;

  return <Tabs persistInUrl selectedMaintLog={data} />;
};

export default MaintLogDetail;
