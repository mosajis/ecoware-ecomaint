import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { menuContentItems, MenuItem } from "./MenuContentItems";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { useEffect, useState, Fragment } from "react";

export default function MenuContent() {
  const router = useRouter();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // ================= ACTIVE HELPERS =================
  const isExactMatch = (path?: string) => (path ? currentPath === path : false);
  const isNestedMatch = (path?: string) =>
    path ? currentPath.startsWith(path + "/") : false;

  // ================= AUTO EXPAND =================
  useEffect(() => {
    const newOpen: Record<string, boolean> = {};

    menuContentItems.forEach((section) => {
      section.items?.forEach((item) => {
        const matchItem = isExactMatch(item.path) || isNestedMatch(item.path);
        const matchChild = item.children?.some(
          (child) => isExactMatch(child.path) || isNestedMatch(child.path),
        );

        if (!section.noActiveHighlight && (matchItem || matchChild)) {
          newOpen[section.title] = true;
        }

        if (matchChild) {
          newOpen[item.id || item.text] = true;
        }
      });
    });

    setOpenSections(newOpen);
  }, [currentPath]);

  const handleToggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ================= SPA LINK HANDLER =================
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path?: string,
  ) => {
    if (!path) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    router.navigate({ to: path });
  };

  // ================= RECURSIVE ITEM =================
  const renderItem = (
    item: MenuItem,
    level: number = 2,
    noActive?: boolean,
  ) => {
    const hasChildren = !!item.children?.length;
    const isActive = noActive
      ? false
      : isExactMatch(item.path) || isNestedMatch(item.path);

    if (!item.permit) return;
    return (
      <Fragment key={item.id || item.text}>
        <ListItem disablePadding>
          <ListItemButton
            component={hasChildren ? "div" : "a"}
            href={!hasChildren ? item.path : undefined}
            onClick={
              hasChildren
                ? () => handleToggle(item.id || item.text)
                : (e: any) => handleLinkClick(e, item.path)
            }
            selected={isActive}
            sx={{ pl: level, gap: 1 }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText primary={item.text} />
            {hasChildren &&
              (openSections[item.id || item.text] ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              ))}
          </ListItemButton>
        </ListItem>

        {hasChildren && (
          <Collapse
            in={openSections[item.id || item.text]}
            timeout="auto"
            unmountOnExit
          >
            <List dense disablePadding>
              {item.children!.map((child) =>
                renderItem(child, level + 2, noActive),
              )}
            </List>
          </Collapse>
        )}
      </Fragment>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      {menuContentItems.map((section, index) => {
        const hasItems = !!section.items?.length;

        const isActiveParent =
          !section.noActiveHighlight &&
          (isExactMatch(section.path) ||
            isNestedMatch(section.path) ||
            section.items?.some((item) =>
              item.children
                ? item.children.some(
                    (child) =>
                      isExactMatch(child.path) || isNestedMatch(child.path),
                  )
                : isExactMatch(item.path) || isNestedMatch(item.path),
            ));

        return (
          <Fragment key={section.title}>
            {/* ===== SECTION LEVEL ===== */}
            <ListItem disablePadding>
              <ListItemButton
                component={!hasItems ? "a" : "div"}
                href={!hasItems ? section.path : undefined}
                onClick={
                  hasItems
                    ? () => handleToggle(section.title)
                    : (e: any) => handleLinkClick(e, section.path)
                }
                selected={isActiveParent}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>{section.icon}</ListItemIcon>
                <ListItemText primary={section.title} />
                {hasItems &&
                  (openSections[section.title] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>
            </ListItem>

            {/* ===== CHILDREN ===== */}
            {hasItems && (
              <Collapse
                in={openSections[section.title]}
                timeout="auto"
                unmountOnExit
              >
                <List dense disablePadding>
                  {section.items.map((item) =>
                    renderItem(item, 2, section.noActiveHighlight),
                  )}
                </List>
              </Collapse>
            )}

            {index < menuContentItems.length - 1 && (
              <Divider sx={{ my: 0.5 }} />
            )}
          </Fragment>
        );
      })}
    </Stack>
  );
}
