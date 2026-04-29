// src/features/userGroup/UserGroupTabs.tsx
import AccountTree from "@mui/icons-material/AccountTree";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy, memo } from "react";
import { useAtomValue } from "jotai";
import { atomUserGroupId } from "./UserGroupAtom";

const TabGeneral = lazy(() => import("./tabs/TabGeneral"));
const TabAccessElement = lazy(() => import("./tabs/TabAccessElement"));

const TabsComponent = () => {
  const userGroupId = useAtomValue(atomUserGroupId);

  const tabProps = {
    disabled: !userGroupId,
  };

  const tabs: ReusableTabItem[] = [
    { label: "General", icon: <AccountTree />, component: TabGeneral },
    {
      label: "Element Access",
      icon: <AccountTree />,
      component: TabAccessElement,
      ...tabProps,
    },
  ];

  return <TabsContainer tabs={tabs} persistInUrl={false} />;
};

export default memo(TabsComponent);
