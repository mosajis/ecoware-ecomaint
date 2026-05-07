import Spinner from "@/shared/components/Spinner";
import ComponentUnitTabs from "./ComponentUnitTabs";
import { useEffect, useState } from "react";

import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from "@/core/api/generated/api";
import { RouteDetail } from "./ComponentUnitRoutes";

const ComponentTypeDetail = () => {
  const { id } = RouteDetail.useParams();
  const { breadcrumb } = RouteDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [componentUnit, setComponentUnit] =
    useState<TypeTblComponentUnit | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblComponentUnit
      .getById(id)
      .then(setComponentUnit)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  if (!componentUnit) return null;

  return <ComponentUnitTabs label={breadcrumb} componentUnit={componentUnit} />;
};

export default ComponentTypeDetail;
