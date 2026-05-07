import Spinner from "@/shared/components/Spinner";
import Tabs from "./UserGroupTabs";
import { useEffect, useState } from "react";
import { tblUserGroup, TypeTblUserGroup } from "@/core/api/generated/api";
import { RouteDetail } from "./UserGroupRoutes";

const UserGroupDetail = () => {
  const { id } = RouteDetail.useParams();
  const { breadcrumb } = RouteDetail.useSearch();

  const [loading, setLoading] = useState(true);
  const [userGroup, setUserGroup] = useState<TypeTblUserGroup | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    tblUserGroup
      .getById(id)
      .then(setUserGroup)
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spinner />;

  if (!userGroup) return null;

  return <Tabs label={breadcrumb} userGroup={userGroup} />;
};

export default UserGroupDetail;
