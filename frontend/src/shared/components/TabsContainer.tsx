import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { cloneElement, JSX, Suspense, useEffect, useState } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";

import Spinner from "@/shared/components/Spinner";
import TabContainer from "./TabContainer";

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

  const initialTab =
    persistInUrl && typeof searchTab === "string" ? searchTab : tabs[0]?.label;

  const [activeTab, setActiveTab] = useState(initialTab);

  // Tabهایی که حداقل یک بار باز شده‌اند
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(
    () => new Set(initialTab ? [initialTab] : []),
  );

  // هماهنگی با URL
  useEffect(() => {
    if (
      persistInUrl &&
      typeof searchTab === "string" &&
      searchTab !== activeTab
    ) {
      setActiveTab(searchTab);

      setMountedTabs((prev) => {
        if (prev.has(searchTab)) {
          return prev;
        }

        const next = new Set(prev);
        next.add(searchTab);
        return next;
      });
    }
  }, [searchTab, persistInUrl, activeTab]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);

    // فقط اگر برای اولین بار است، به mountedTabs اضافه شود
    setMountedTabs((prev) => {
      if (prev.has(newValue)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(newValue);
      return next;
    });

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
            key={tab.label}
            value={tab.label}
            disabled={tab.disabled}
            icon={cloneElement(tab.icon, {
              sx: { fontSize: 17 },
            })}
            label={tab.label}
            iconPosition="start"
          />
        ))}
      </Tabs>

      {tabs.map((tab) => {
        const isActive = tab.label === activeTab;
        const isMounted = mountedTabs.has(tab.label);
        const TabComponent = tab.component;

        // هنوز یک بار هم باز نشده → اصلاً render نشود
        if (!isMounted || !TabComponent) {
          return null;
        }

        return (
          <TabContainer
            key={tab.label}
            {...tab.containerProps}
            style={{
              ...tab.containerProps?.style,
              display: isActive ? undefined : "none",
            }}
          >
            <Suspense fallback={<Spinner />}>
              <TabComponent {...tabProps} />
            </Suspense>
          </TabContainer>
        );
      })}
    </div>
  );
};

export default TabsContainer;
