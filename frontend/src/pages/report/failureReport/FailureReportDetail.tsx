import Spinner from "@/shared/components/Spinner";
import Tabs from "./FailureReportTabs";

import { useEffect, useState } from "react";
import { RouteDetail } from "./FailureReportRoutes";
import {
  tblFailureReport,
  TypeTblFailureReport,
} from "@/core/api/generated/api";

const ComponentTypeDetail = () => {
  const { id } = RouteDetail.useParams();
  const { breadcrumb } = RouteDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTblFailureReport | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblFailureReport
      .getById(id)
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  if (!data) return null;

  return <Tabs failreReport={data} />;
};

export default ComponentTypeDetail;
