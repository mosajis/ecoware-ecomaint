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

  useEffect(() => {
    const newOpen: Record<string, boolean> = {};
    menuContentItems.forEach((section) => {
      if (
        section.items?.some((item) =>
          item.children
            ? item.children.some((child) => currentPath.startsWith(child.path))
            : currentPath.startsWith(item.path),
        )
      ) {
        newOpen[section.title] = true;
        section.items?.forEach((item) => {
          if (
            item.children?.some((child) => currentPath.startsWith(child.path))
          ) {
            newOpen[item.id || item.text] = true;
          }
        });
      }
    });
    setOpenSections(newOpen);
  }, [currentPath]);

  const handleToggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigate = (path?: string) => {
    if (path) router.navigate({ to: path });
  };

  const renderItem = (item: MenuItem, level: number = 2) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = currentPath === item.path;

    return (
      <Fragment key={item.id || item.text}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              gap: "10px !important",
            }}
            onClick={() =>
              hasChildren
                ? handleToggle(item.id || item.text)
                : handleNavigate(item.path)
            }
            selected={isActive}
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
            <List
              component="div"
              disablePadding
              dense
              sx={{ p: 0.5, pl: level }}
            >
              {item.children!.map((child) => renderItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Fragment>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1 }}>
      {menuContentItems.map((section, index) => {
        const isActiveParent =
          currentPath === section.path ||
          section.items?.some((item) =>
            item.children
              ? item.children.some((child) =>
                  currentPath.startsWith(child.path),
                )
              : currentPath.startsWith(item.path),
          );

        const hasItems = section.items && section.items.length > 0;

        return (
          <Fragment key={section.title}>
            {/* سطح اول */}
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() =>
                  hasItems
                    ? handleToggle(section.title)
                    : handleNavigate(section.path)
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

            {/* سطح دوم و سوم */}
            {hasItems && (
              <Collapse
                in={openSections[section.title]}
                timeout="auto"
                unmountOnExit
              >
                <List
                  component="div"
                  disablePadding
                  dense
                  sx={{ pl: 1.5, pr: 0 }}
                >
                  {section.items.map((item) => renderItem(item, 2))}
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
