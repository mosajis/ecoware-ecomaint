import React, { useEffect, useMemo, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { ExpandMore, ChevronRight, Save } from "@mui/icons-material";
import {
  tblElement,
  tblUserGroupElement,
  TypeTblElement,
  TypeTblUserGroup,
} from "@/core/api/generated/api";
import { useTheme } from "@mui/material";
import { toast } from "sonner";

/* ─── Types ───────────────── */

type Permission =
  | "canView"
  | "canCreate"
  | "canUpdate"
  | "canDelete"
  | "canExport";

const PERMISSIONS: Permission[] = [
  "canView",
  "canCreate",
  "canUpdate",
  "canDelete",
  "canExport",
];

type PermMap = Record<Permission, boolean>;

type StateMap = Record<
  number,
  {
    recordId?: number;
    perms: PermMap;
    original: PermMap;
  }
>;

const EMPTY: PermMap = {
  canView: false,
  canCreate: false,
  canUpdate: false,
  canDelete: false,
  canExport: false,
};

/* ─── Helpers ───────────────── */

function buildTree(flat: TypeTblElement[]) {
  const map = new Map<number, any>();
  flat.forEach((e) => map.set(e.elementId, { ...e, children: [] }));

  const roots: any[] = [];

  map.forEach((n) => {
    if (!n.parentId) roots.push(n);
    else map.get(n.parentId)?.children.push(n);
  });

  return roots;
}

type CheckState = "all" | "none" | "indeterminate";

function getCheckState(values: boolean[]): CheckState {
  if (values.every(Boolean)) return "all";
  if (values.every((v) => !v)) return "none";
  return "indeterminate";
}

function getPermissionLabel(permission: Permission): string {
  return permission.replace("can", "");
}

/* ─── Row Component ───────────────── */

interface RowProps {
  node: any;
  depth: number;
  stateMap: StateMap;
  onChange: (id: number, permission: Permission, value: boolean) => void;
  onRowToggle: (node: any, value: boolean, isParent: boolean) => void;
  borderColor: string;
}

const Row = React.memo(function Row({
  node,
  depth,
  stateMap,
  onChange,
  onRowToggle,
  borderColor,
}: RowProps) {
  const [open, setOpen] = useState(true);
  const isParent = node.children.length > 0;
  const state = stateMap[node.elementId];
  const perms = state?.perms ?? EMPTY;

  const rowValues = isParent
    ? [perms.canView]
    : PERMISSIONS.map((p) => perms[p]);

  const rowState = getCheckState(rowValues);

  const cellBorder = `1px solid ${borderColor}`;

  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            pl: 1 + depth * 3 + (isParent ? 0 : 2 * depth),
            borderRight: cellBorder,
            borderBottom: cellBorder,
          }}
        >
          <Box display="flex" alignItems="center">
            {node.children.length > 0 && (
              <IconButton
                sx={{ mr: 1, width: 30, height: 30 }}
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            )}
            <Typography fontWeight={isParent ? 600 : 400}>
              {node.caption || node.name}
            </Typography>
          </Box>
        </TableCell>

        {/* ALL Column */}
        <TableCell
          align="center"
          sx={{ borderRight: cellBorder, borderBottom: cellBorder }}
        >
          {node.hasCrud && (
            <Checkbox
              sx={{ margin: 0 }}
              size="small"
              checked={rowState === "all"}
              indeterminate={rowState === "indeterminate"}
              onChange={(_, val) => onRowToggle(node, val, isParent)}
            />
          )}
        </TableCell>

        {/* Permission Columns */}
        {PERMISSIONS.map((p) => (
          <TableCell
            key={p}
            align="center"
            sx={{
              borderRight: cellBorder,
              borderBottom: cellBorder,
            }}
          >
            {node.hasCrud ? (
              <Checkbox
                size="small"
                sx={{ margin: 0 }}
                checked={perms[p]}
                onChange={(_, val) => onChange(node.elementId, p, val)}
              />
            ) : (
              p === "canView" && (
                <Checkbox
                  sx={{ margin: 0 }}
                  size="small"
                  checked={perms[p]}
                  onChange={(_, val) => onChange(node.elementId, p, val)}
                />
              )
            )}
          </TableCell>
        ))}
      </TableRow>

      {open &&
        node.children.map((child: any) => (
          <Row
            key={child.elementId}
            node={child}
            depth={depth + 1}
            stateMap={stateMap}
            onChange={onChange}
            onRowToggle={onRowToggle}
            borderColor={borderColor}
          />
        ))}
    </>
  );
});

/* ─── Main Component ───────────────── */

type Props = {
  userGroup: TypeTblUserGroup;
};

export default function TabAccessElement(props: Props) {
  const userGroupId = props?.userGroup?.userGroupId;
  const theme = useTheme();

  const [elements, setElements] = useState<TypeTblElement[]>([]);
  const [stateMap, setStateMap] = useState<StateMap>({});
  const [loading, setLoading] = useState(false);

  /* ─── Data Fetching ───────────────── */

  useEffect(() => {
    if (!userGroupId) return;

    (async () => {
      try {
        const [elementsData, userGroupElementsData] = await Promise.all([
          tblElement.getAll(),
          tblUserGroupElement.getAll({ filter: { userGroupId } }),
        ]);

        setElements(elementsData.items);

        const map: StateMap = {};

        // Initialize all elements with empty permissions
        elementsData.items.forEach((element) => {
          map[element.elementId] = {
            perms: { ...EMPTY },
            original: { ...EMPTY },
          };
        });

        // Update with existing permissions
        userGroupElementsData.items.forEach((userGroupElement) => {
          const permissions: PermMap = {
            canView: userGroupElement.canView,
            canCreate: userGroupElement.canCreate,
            canUpdate: userGroupElement.canUpdate,
            canDelete: userGroupElement.canDelete,
            canExport: userGroupElement.canExport,
          };

          map[userGroupElement.elementId] = {
            recordId: userGroupElement.userGroupElementId,
            perms: permissions,
            original: permissions,
          };
        });

        setStateMap(map);
      } catch (error) {
        toast.error("Error loading data");
        console.error("Error fetching data:", error);
      }
    })();
  }, [userGroupId]);

  /* ─── Computed Values ───────────────── */

  const tree = useMemo(() => buildTree(elements), [elements]);

  const colState = useMemo(() => {
    const result: Record<string, CheckState> = {};

    PERMISSIONS.forEach((permission) => {
      const values = Object.values(stateMap).map((s) => s.perms[permission]);
      result[permission] = getCheckState(values);
    });

    return result;
  }, [stateMap]);

  const allPermState = useMemo(() => {
    const allValues = Object.values(stateMap).flatMap((s) =>
      PERMISSIONS.map((p) => s.perms[p]),
    );
    return getCheckState(allValues);
  }, [stateMap]);

  const dirtyCount = useMemo(() => {
    return Object.values(stateMap).filter((s) =>
      PERMISSIONS.some((p) => s.perms[p] !== s.original[p]),
    ).length;
  }, [stateMap]);

  /* ─── Event Handlers ───────────────── */

  const handleChange = useCallback(
    (id: number, permission: Permission, value: boolean) => {
      setStateMap((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          perms: { ...prev[id].perms, [permission]: value },
        },
      }));
    },
    [],
  );

  const handleRowToggle = useCallback(
    (node: any, value: boolean, isParent: boolean) => {
      setStateMap((prev) => {
        const next = { ...prev };
        const permissionsToUpdate = isParent ? ["canView"] : PERMISSIONS;

        next[node.elementId] = {
          ...next[node.elementId],
          perms: Object.fromEntries(
            permissionsToUpdate.map((p) => [p, value]),
          ) as PermMap,
        };

        return next;
      });
    },
    [],
  );

  const handleColumnToggle = useCallback(
    (permission: Permission, value: boolean) => {
      setStateMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          next[+id] = {
            ...next[+id],
            perms: {
              ...next[+id].perms,
              [permission]: value,
            },
          };
        });
        return next;
      });
    },
    [],
  );

  const handleToggleAll = useCallback((value: boolean) => {
    setStateMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[+id] = {
          ...next[+id],
          perms: {
            ...next[+id].perms,
            ...Object.fromEntries(PERMISSIONS.map((p) => [p, value])),
          },
        };
      });
      return next;
    });
  }, []);

  /* ─── Save Handler ───────────────── */

  const handleSave = async () => {
    setLoading(true);
    try {
      await Promise.all(
        Object.entries(stateMap).map(async ([elementId, state]) => {
          const hasAnyPermission = Object.values(state.perms).some(Boolean);

          if (state.recordId) {
            if (hasAnyPermission) {
              await tblUserGroupElement.update(state.recordId, state.perms);
            } else {
              await tblUserGroupElement.deleteById(state.recordId);
            }
          } else if (hasAnyPermission) {
            await tblUserGroupElement.create({
              ...state.perms,
              tblElement: { connect: { elementId: +elementId } },
              tblUserGroup: { connect: { userGroupId } },
            });
          }
        }),
      );

      toast.success("Changes saved successfully");

      // Update original state after successful save
      setStateMap((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          next[+id] = {
            ...next[+id],
            original: { ...next[+id].perms },
          };
        });
        return next;
      });
    } catch (error) {
      toast.error("خطا در ذخیره تغییرات");
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ─── Theme Colors ───────────────── */

  const borderColor = (theme.vars || theme).palette.divider;

  /* ─── Render ───────────────── */

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
        sx={{
          borderBottom: `1px solid ${borderColor}`,
          flexShrink: 0,
        }}
      >
        <Typography fontWeight={600}>
          Unsaved changes ({dirtyCount} changes)
        </Typography>
        <Button
          startIcon={<Save />}
          variant={!dirtyCount ? "outlined" : "contained"}
          size="small"
          disabled={!dirtyCount}
          loading={loading}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      {/* Table Container */}
      <Box overflow="auto" flex={1}>
        <Table size="small" stickyHeader sx={{ borderCollapse: "collapse" }}>
          <TableHead>
            <TableRow>
              {/* Name Column */}
              <TableCell
                sx={{
                  borderRight: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                  
                  fontWeight: 600,
                  minWidth: 200,
                }}
              >
                Name
              </TableCell>

              {/* All Column */}
              <TableCell
                align="center"
                sx={{
                  borderRight: `1px solid ${borderColor}`,
                  borderBottom: `1px solid ${borderColor}`,
                  
                  fontWeight: 600,
                  minWidth: 60,
                }}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  gap={0.5}
                >
                  <Checkbox
                    sx={{ margin: 0 }}
                    size="small"
                    checked={allPermState === "all"}
                    indeterminate={allPermState === "indeterminate"}
                    onChange={(_, val) => handleToggleAll(val)}
                  />
                  <Typography variant="caption">All</Typography>
                </Box>
              </TableCell>

              {/* Permission Columns */}
              {PERMISSIONS.map((permission) => (
                <TableCell
                  key={permission}
                  align="center"
                  sx={{
                    borderRight: `1px solid ${borderColor}`,
                    borderBottom: `1px solid ${borderColor}`,
                    fontWeight: 600,
                    minWidth: 80,
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={0.5}
                  >
                    <Checkbox
                      sx={{ margin: 0 }}
                      size="small"
                      checked={colState[permission] === "all"}
                      indeterminate={colState[permission] === "indeterminate"}
                      onChange={(_, val) => handleColumnToggle(permission, val)}
                    />
                    <Typography variant="caption">
                      {getPermissionLabel(permission)}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tree.length > 0 ? (
              tree.map((node) => (
                <Row
                  key={node.elementId}
                  node={node}
                  depth={0}
                  stateMap={stateMap}
                  onChange={handleChange}
                  onRowToggle={handleRowToggle}
                  borderColor={borderColor}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={PERMISSIONS.length + 2}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography color="textSecondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
