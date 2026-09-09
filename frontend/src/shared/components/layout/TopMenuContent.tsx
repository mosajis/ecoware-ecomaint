import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import MenuRounded from "@mui/icons-material/MenuRounded";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useRouter, useRouterState } from "@tanstack/react-router";
import { menuContentItems, MenuItem as MenuItemType } from "./MenuContentItems";
import { useEffect, useState } from "react";

export default function TopMenuContent() {
  const router = useRouter();
  const { location } = useRouterState();
  const currentPath = location.pathname;

  const isMobile = useMediaQuery("(max-width:700px)");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(
    null,
  );

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [openMobileSections, setOpenMobileSections] = useState<
    Record<string, boolean>
  >({});

  const isExactMatch = (path?: string) => (path ? currentPath === path : false);

  const isNestedMatch = (path?: string) =>
    path ? currentPath.startsWith(path + "/") : false;

  useEffect(() => {
    const newOpenItems: Record<string, boolean> = {};
    const newOpenMobileSections: Record<string, boolean> = {};

    menuContentItems.forEach((section) => {
      section.items?.forEach((item) => {
        const matchChild = item.children?.some(
          (child) => isExactMatch(child.path) || isNestedMatch(child.path),
        );

        if (matchChild) {
          newOpenItems[item.id || item.text] = true;
          newOpenMobileSections[section.title] = true;
        }

        if (
          !section.noActiveHighlight &&
          (isExactMatch(item.path) || isNestedMatch(item.path) || matchChild)
        ) {
          newOpenMobileSections[section.title] = true;
        }
      });

      if (isExactMatch(section.path) || isNestedMatch(section.path)) {
        newOpenMobileSections[section.title] = true;
      }
    });

    setOpenItems(newOpenItems);
    setOpenMobileSections(newOpenMobileSections);
  }, [currentPath]);

  const handleSectionOpen = (
    event: React.MouseEvent<HTMLElement>,
    sectionTitle: string,
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenSection(sectionTitle);
  };

  const handleSectionClose = () => {
    setAnchorEl(null);
    setOpenSection(null);
  };

  const handleMobileOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchorEl(event.currentTarget);
  };

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
  };

  const handleMobileSectionToggle = (sectionTitle: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleItemToggle = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path?: string,
  ) => {
    if (!path) return;

    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) {
      return;
    }

    e.preventDefault();

    handleSectionClose();
    handleMobileClose();

    router.navigate({
      to: path,
    });
  };

  const renderItem = (
    item: MenuItemType,
    noActive?: boolean,
    mobile?: boolean,
  ): React.ReactNode => {
    if (!item.permit) return null;

    const hasChildren = !!item.children?.length;
    const itemKey = item.id || item.text;

    const isActive = noActive
      ? false
      : isExactMatch(item.path) || isNestedMatch(item.path);

    const itemOpen = !!openItems[itemKey];

    return (
      <div
        key={itemKey}
        style={{
          width: mobile ? "100%" : undefined,
        }}
      >
        <MenuItem
          selected={isActive}
          component={hasChildren ? "div" : "a"}
          href={!hasChildren ? item.path : undefined}
          onClick={
            hasChildren
              ? () => handleItemToggle(itemKey)
              : (e: React.MouseEvent<HTMLAnchorElement>) =>
                  handleLinkClick(e, item.path)
          }
          sx={{
            minWidth: mobile ? 0 : 210,
            width: mobile ? "100%" : "auto",
            minHeight: 34,
            py: 0.5,
            px: 1.25,
            gap: 0.75,
            fontSize: "0.8rem",
            boxSizing: "border-box",
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: 26,
                "& svg": {
                  fontSize: 17,
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}

          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontSize: "0.8rem",
              noWrap: true,
            }}
            sx={{
              my: 0,
              minWidth: 0,
            }}
          />

          {hasChildren &&
            (itemOpen ? (
              <ExpandLess sx={{ fontSize: 17 }} />
            ) : (
              <ExpandMore sx={{ fontSize: 17 }} />
            ))}
        </MenuItem>

        {hasChildren && itemOpen && (
          <Stack
            sx={{
              pl: 1,
              width: mobile ? "100%" : "auto",
              boxSizing: "border-box",
            }}
          >
            {item.children!.map((child) => renderItem(child, noActive, mobile))}
          </Stack>
        )}
      </div>
    );
  };

  /*
   * MOBILE
   */
  if (isMobile) {
    return (
      <>
        <ListItemButton
          component="button"
          onClick={handleMobileOpen}
          sx={{
            borderRadius: 1,
            minHeight: 36,
            width: 40,
            minWidth: 40,
            px: 1,
            py: 0.5,
            justifyContent: "center",

            "& .MuiSvgIcon-root": {
              fontSize: 22,
            },
          }}
        >
          <MenuRounded />
        </ListItemButton>

        <Menu
          anchorEl={mobileAnchorEl}
          open={Boolean(mobileAnchorEl)}
          onClose={handleMobileClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                width: "calc(100vw - 20px)",
                minWidth: "calc(100vw - 20px)",
                maxWidth: "calc(100vw - 20px)",
                maxHeight: "calc(100vh - 70px)",
                overflowY: "auto",
                overflowX: "hidden",
                py: 0.5,
                boxSizing: "border-box",

                "& .MuiList-root": {
                  width: "100%",
                  p: 0.5,
                  boxSizing: "border-box",
                },
              },
            },
          }}
        >
          {menuContentItems.map((section) => {
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

            const isMobileSectionOpen = !!openMobileSections[section.title];

            return (
              <div
                key={section.title}
                style={{
                  width: "100%",
                }}
              >
                <ListItemButton
                  component={!hasItems ? "a" : "button"}
                  selected={isActiveParent}
                  href={!hasItems ? section.path : undefined}
                  onClick={
                    hasItems
                      ? () => handleMobileSectionToggle(section.title)
                      : (e) => handleLinkClick(e, section.path)
                  }
                  sx={{
                    borderRadius: 1,
                    minHeight: 42,
                    width: "100%",
                    px: 1.25,
                    py: 0.75,
                    gap: 0.75,
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",

                    "& .MuiListItemIcon-root": {
                      minWidth: 28,
                    },

                    "& .MuiListItemIcon-root svg": {
                      fontSize: 18,
                    },

                    "& .MuiListItemText-root": {
                      margin: 0,
                      minWidth: 0,
                    },

                    "& .MuiListItemText-primary": {
                      fontSize: "0.82rem",
                      fontWeight: isActiveParent ? 600 : 500,
                    },

                    "& .MuiSvgIcon-root": {
                      fontSize: 17,
                      flexShrink: 0,
                    },
                  }}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>

                  <ListItemText primary={section.title} />

                  {hasItems &&
                    (isMobileSectionOpen ? (
                      <ExpandLess sx={{ fontSize: 17 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 17 }} />
                    ))}
                </ListItemButton>

                {hasItems && isMobileSectionOpen && (
                  <Stack
                    sx={{
                      width: "100%",
                      px: 0.5,
                      boxSizing: "border-box",
                    }}
                  >
                    {section.items.map((item) =>
                      renderItem(item, section.noActiveHighlight, true),
                    )}
                  </Stack>
                )}
              </div>
            );
          })}
        </Menu>
      </>
    );
  }

  /*
   * DESKTOP
   */
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        gap: 0.25,
        width: "max-content",
        flexShrink: 0,
      }}
    >
      {menuContentItems.map((section) => {
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

        const isCurrentSectionOpen =
          openSection === section.title && Boolean(anchorEl);

        return (
          <div key={section.title}>
            <ListItemButton
              component={!hasItems ? "a" : "button"}
              selected={isActiveParent}
              href={!hasItems ? section.path : undefined}
              onClick={
                hasItems
                  ? (e) => handleSectionOpen(e, section.title)
                  : (e) => handleLinkClick(e, section.path)
              }
              sx={{
                borderRadius: 1,
                minHeight: 36,
                px: 1,
                py: 0.5,
                gap: 0.5,
                whiteSpace: "nowrap",

                "& .MuiListItemIcon-root": {
                  minWidth: 22,
                },

                "& .MuiListItemIcon-root svg": {
                  fontSize: 18,
                },

                "& .MuiListItemText-root": {
                  margin: 0,
                },

                "& .MuiListItemText-primary": {
                  fontSize: "0.78rem",
                  fontWeight: isActiveParent ? 600 : 500,
                },

                "& .MuiSvgIcon-root": {
                  fontSize: 16,
                },
              }}
            >
              <ListItemIcon>{section.icon}</ListItemIcon>

              <ListItemText primary={section.title} />

              {hasItems &&
                (isCurrentSectionOpen ? (
                  <ExpandLess sx={{ fontSize: 16 }} />
                ) : (
                  <ExpandMore sx={{ fontSize: 16 }} />
                ))}
            </ListItemButton>

            {hasItems && (
              <Menu
                anchorEl={isCurrentSectionOpen ? anchorEl : null}
                open={isCurrentSectionOpen}
                onClose={handleSectionClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 0.5,
                      minWidth: 210,
                      py: 0.5,
                    },
                  },
                }}
              >
                {section.items.map((item) =>
                  renderItem(item, section.noActiveHighlight),
                )}
              </Menu>
            )}
          </div>
        );
      })}
    </Stack>
  );
}
