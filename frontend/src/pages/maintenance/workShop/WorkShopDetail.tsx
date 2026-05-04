import TabsComponent from "./WorkShopTabs";
import Spinner from "@/shared/components/Spinner";
import { useEffect, useState } from "react";
import { RouteDetail } from "./WorkShopRoutes";
import { tblWorkShop, TypeTblWorkShop } from "@/core/api/generated/api";

const FunctionDetail = () => {
  const { id } = RouteDetail.useParams();
  const { breadcrumb } = RouteDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TypeTblWorkShop | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblWorkShop
      .getById(id)
      .then(setData)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  return <TabsComponent label={breadcrumb} workShopId={data?.workShopId} />;
};

export default FunctionDetail;
