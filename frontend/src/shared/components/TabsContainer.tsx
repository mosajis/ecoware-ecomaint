import { cloneElement, JSX, Suspense, useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import Spinner from "@/shared/components/Spinner";
import TabContainer from "./TabContainer";

export type ReusableTabItem<T = any> = {
  label: string;
  icon: JSX.Element;
  component?: React.LazyExoticComponent<React.FC<T>>;
  containerProps?: React.ComponentProps<typeof TabContainer>;
};

type Props = {
  tabs: ReusableTabItem[];
  queryParamKey?: string;
  fillHeight?: boolean;
  tabProps?: Record<string, any>; // ← prop اضافه شد
};

const TabsContainer = ({
  tabs,
  queryParamKey = "tab",
  fillHeight = true,
  tabProps,
}: Props) => {
  const router = useRouter();
  const current = router.state.location.pathname;
  const navigate = useNavigate({ from: current });

  const searchTab = useSearch({
    strict: false,
    select: (search) => search[queryParamKey],
  });

  const [activeTab, setActiveTab] = useState<string>(
    searchTab || tabs[0].label
  );

  useEffect(() => {
    if (searchTab && searchTab !== activeTab) {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  const handleChange = (_: any, newValue: string) => {
    setActiveTab(newValue);
    navigate({ search: { [queryParamKey]: newValue } as any });
  };

  const ActiveComponent = tabs.find((t) => t.label === activeTab)?.component;

  return (
    <div
      style={{
        height: fillHeight ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tabs
        sx={{ px: 1 }}
        value={activeTab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            value={tab.label}
            icon={cloneElement(tab.icon, { sx: { fontSize: 17 } })}
            label={tab.label}
            iconPosition="start"
          />
        ))}
      </Tabs>

      <TabContainer
        {...tabs.find((t) => t.label === activeTab)?.containerProps}
      >
        {ActiveComponent && (
          <Suspense fallback={<Spinner />}>
            <ActiveComponent {...tabProps} />
          </Suspense>
        )}
      </TabContainer>
    </div>
  );
};

export default TabsContainer;
