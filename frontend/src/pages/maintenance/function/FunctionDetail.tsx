import TabsComponent from "./FunctionTabs";
import Spinner from "@/shared/components/Spinner";
import { useEffect, useState } from "react";
import { routeDetail } from "./FunctionRoutes";
import { tblFunctions, TypeTblFunctions } from "@/core/api/generated/api";

const FunctionDetail = () => {
  const { id } = routeDetail.useParams();
  const { breadcrumb } = routeDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [recordFunction, setFunction] = useState<TypeTblFunctions | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblFunctions
      .getById(id, {
        include: {
          tblComponentUnit: true,
        },
      })
      .then(setFunction)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  return <TabsComponent label={breadcrumb} recordFunction={recordFunction!} />;
};

export default FunctionDetail;
