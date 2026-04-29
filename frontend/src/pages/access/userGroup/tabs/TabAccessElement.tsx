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
import { alpha, useTheme } from "@mui/material";
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

/* ─── Row ───────────────── */

const Row = React.memo(function Row({
  node,
  depth,
  stateMap,
  onChange,
  onRowToggle,
}: any) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const isParent = node.children.length > 0;
  const state = stateMap[node.elementId];
  const perms = state?.perms ?? EMPTY;

  const rowValues = isParent
    ? [perms.canView]
    : PERMISSIONS.map((p) => perms[p]);

  const rowState = getCheckState(rowValues);

  return (
    <>
      <TableRow
        sx={{
          bgcolor: isParent ? "background.paper" : "",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.03),
          },
        }}
      >
        <TableCell sx={{ pl: 1 + depth * 3 + (isParent ? 0 : 2 * depth) }}>
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

        {/* ALL */}
        <TableCell align="left">
          <Checkbox
            size="small"
            checked={rowState === "all"}
            indeterminate={rowState === "indeterminate"}
            onChange={(_, val) => onRowToggle(node, val, isParent)}
          />
        </TableCell>

        {PERMISSIONS.map((p) => {
          const disabled = isParent && p !== "canView";

          return (
            <TableCell key={p} align="left">
              {!disabled && (
                <Checkbox
                  size="small"
                  checked={perms[p]}
                  disabled={disabled}
                  onChange={(_, val) => onChange(node.elementId, p, val)}
                />
              )}
            </TableCell>
          );
        })}
      </TableRow>

      {open &&
        node.children.map((c: any) => (
          <Row
            key={c.elementId}
            node={c}
            depth={depth + 1}
            stateMap={stateMap}
            onChange={onChange}
            onRowToggle={onRowToggle}
          />
        ))}
    </>
  );
});

/* ─── Main ───────────────── */

type Props = {
  userGroup: TypeTblUserGroup;
};

export default function TabAccessElement(props: Props) {
  const userGroupId = props?.userGroup?.userGroupId;

  const theme = useTheme();

  const [elements, setElements] = useState<TypeTblElement[]>([]);
  const [stateMap, setStateMap] = useState<StateMap>({});
  const [loading, setLoading] = useState(false);

  /* fetch */

  useEffect(() => {
    if (!userGroupId) return;

    (async () => {
      const [el, ug] = await Promise.all([
        tblElement.getAll(),
        tblUserGroupElement.getAll({ filter: { userGroupId } }),
      ]);

      setElements(el.items);

      const map: StateMap = {};

      el.items.forEach((e) => {
        map[e.elementId] = {
          perms: { ...EMPTY },
          original: { ...EMPTY },
        };
      });

      ug.items.forEach((u) => {
        const p: PermMap = {
          canView: u.canView,
          canCreate: u.canCreate,
          canUpdate: u.canUpdate,
          canDelete: u.canDelete,
          canExport: u.canExport,
        };

        map[u.elementId] = {
          recordId: u.userGroupElementId,
          perms: p,
          original: p,
        };
      });

      setStateMap(map);
    })();
  }, [userGroupId]);

  const tree = useMemo(() => buildTree(elements), [elements]);

  /* handlers */

  const handleChange = useCallback((id: any, key: any, val: any) => {
    setStateMap((p) => ({
      ...p,
      [id]: {
        ...p[id],
        perms: { ...p[id].perms, [key]: val },
      },
    }));
  }, []);

  const handleRowToggle = useCallback(
    (node: any, val: any, isParent: boolean) => {
      setStateMap((p) => {
        const next = { ...p };

        const keys = isParent ? ["canView"] : PERMISSIONS;

        next[node.elementId] = {
          ...next[node.elementId],
          perms: Object.fromEntries(keys.map((k) => [k, val])) as PermMap,
        };

        return next;
      });
    },
    [],
  );

  /* column state */

  const colState = useMemo(() => {
    const res: any = {};

    PERMISSIONS.forEach((p) => {
      const vals = Object.values(stateMap).map((s) => s.perms[p]);
      res[p] = getCheckState(vals);
    });

    return res;
  }, [stateMap]);

  /* dirty */

  const dirtyCount = useMemo(() => {
    return Object.values(stateMap).filter((s) =>
      PERMISSIONS.some((p) => s.perms[p] !== s.original[p]),
    ).length;
  }, [stateMap]);

  /* save */

  const handleSave = async () => {
    setLoading(true);
    await Promise.all(
      Object.entries(stateMap).map(async ([id, s]) => {
        const any = Object.values(s.perms).some(Boolean);

        if (s.recordId) {
          if (any) {
            await tblUserGroupElement.update(s.recordId, s.perms);
          } else {
            await tblUserGroupElement.deleteById(s.recordId);
          }
        } else if (any) {
          await tblUserGroupElement.create({
            ...s.perms,
            tblElement: { connect: { elementId: +id } },
            tblUserGroup: { connect: { userGroupId } },
          });
        }
      }),
    )
      .then(() => {
        toast.success("Successfully Saved");
      })
      .catch(() => {
        toast.error("Faild Save");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* render */
  return (
    <Box border={`1px solid ${theme.palette.divider}`}>
      {/* toolbar */}
      <Box
        display="flex"
        alignItems={"center"}
        justifyContent="space-between"
        p={1}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          borderTop: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <Typography fontWeight={600}>
          Access Control ({dirtyCount} changes)
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

      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                bgcolor: "background.paper",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              Element
            </TableCell>

            {/* ALL */}
            <TableCell
              sx={{
                bgcolor: "background.paper",
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
              align="left"
            >
              All
            </TableCell>

            {PERMISSIONS.map((p) => (
              <TableCell
                sx={{
                  bgcolor: "background.paper",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
                key={p}
                align="left"
              >
                <Checkbox
                  size="small"
                  checked={colState[p] === "all"}
                  indeterminate={colState[p] === "indeterminate"}
                  onChange={(_, val) => {
                    setStateMap((prev) => {
                      const next = { ...prev };
                      Object.keys(next).forEach((id) => {
                        next[+id] = {
                          ...next[+id],
                          perms: {
                            ...next[+id].perms,
                            [p]: val,
                          },
                        };
                      });
                      return next;
                    });
                  }}
                />
                {p.replace("can", "")}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody sx={{ height: "20vh" }}>
          {tree.map((n) => (
            <Row
              key={n.elementId}
              node={n}
              depth={0}
              stateMap={stateMap}
              onChange={handleChange}
              onRowToggle={handleRowToggle}
            />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
