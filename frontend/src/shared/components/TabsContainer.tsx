import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Spinner from "@/shared/components/Spinner";
import TabContainer from "./TabContainer";
import { cloneElement, JSX, Suspense, useEffect, useState } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";

export type ReusableTabItem<T = any> = {
  label: string;
  icon: JSX.Element;
  component?: React.LazyExoticComponent<React.FC<T>>;
  containerProps?: React.ComponentProps<typeof TabContainer>;
  disabled?: boolean;
};

type Props = {
  tabs: ReusableTabItem[];
  queryParamKey?: string;
  fillHeight?: boolean;
  tabProps?: Record<string, any>;
  persistInUrl?: boolean;
};

const TabsContainer = ({
  tabs,
  queryParamKey = "tab",
  fillHeight = true,
  tabProps,
  persistInUrl = true,
}: Props) => {
  const router = useRouter();
  const current = router.state.location.pathname;
  const navigate = useNavigate({ from: current });

  const allSearch = useSearch({ strict: false });
  const searchTab = useSearch({
    strict: false,
    select: (search) => search[queryParamKey],
  });

  const [activeTab, setActiveTab] = useState<string>(
    persistInUrl && searchTab ? searchTab : tabs[0].label,
  );

  // ✅ تب‌هایی که حداقل یه بار باز شدن رو track میکنیم
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(
    new Set([activeTab]),
  );

  useEffect(() => {
    if (persistInUrl && searchTab && searchTab !== activeTab) {
      setActiveTab(searchTab);
      setMountedTabs((prev) => new Set(prev).add(searchTab));
    }
  }, [searchTab, persistInUrl, activeTab]);

  const handleChange = (_: any, newValue: string) => {
    setActiveTab(newValue);
    // ✅ تب جدید رو به mounted اضافه کن
    setMountedTabs((prev) => new Set(prev).add(newValue));

    if (persistInUrl) {
      navigate({
        search: {
          ...allSearch,
          [queryParamKey]: newValue,
        } as any,
      });
    }
  };

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
            disabled={tab.disabled}
            key={tab.label}
            value={tab.label}
            icon={cloneElement(tab.icon, { sx: { fontSize: 17 } })}
            label={tab.label}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {tabs.map((tab) => {
        const isActive = tab.label === activeTab;
        const isMounted = mountedTabs.has(tab.label);
        const TabComponent = tab.component;

        return (
          <TabContainer
            key={tab.label}
            {...tab.containerProps}
            style={{ display: isActive ? undefined : "none" }}
          >
            {isMounted && TabComponent && (
              <Suspense fallback={<Spinner />}>
                <TabComponent {...tabProps} />
              </Suspense>
            )}
          </TabContainer>
        );
      })}
    </div>
  );
};

export default TabsContainer;
