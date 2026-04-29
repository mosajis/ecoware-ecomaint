import AccountTree from "@mui/icons-material/AccountTree";
import TabsContainer, {
  ReusableTabItem,
} from "@/shared/components/TabsContainer";
import { lazy, memo } from "react";
import { TypeTblUserGroup } from "@/core/api/generated/api";

const TabAccessElement = lazy(() => import("./tabs/TabAccessElement"));

type Props = {
  userGroup: TypeTblUserGroup;
  label?: string;
};
const TabsComponent = (props: Props) => {
  const tabs: ReusableTabItem[] = [
    {
      label: "Element Access",
      icon: <AccountTree />,
      component: TabAccessElement,
    },
  ];

  return <TabsContainer tabs={tabs} persistInUrl={false} tabProps={props} />;
};

export default memo(TabsComponent);
