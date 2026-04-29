import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { ExpandMore, ChevronRight, Save } from "@mui/icons-material";
import {
  tblElement,
  tblUserGroupElement,
  TypeTblElement,
} from "@/core/api/generated/api";
import { useAtomValue } from "jotai";
import { atomUserGroupId } from "../UserGroupAtom";

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

interface Node extends TypeTblElement {
  children: Node[];
}

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

/* ─── Tree ───────────────── */

function buildTree(flat: TypeTblElement[]): Node[] {
  const map = new Map<number, Node>();
  flat.forEach((el) => map.set(el.elementId, { ...el, children: [] }));

  const roots: Node[] = [];

  map.forEach((n) => {
    if (!n.parentId) roots.push(n);
    else map.get(n.parentId)?.children.push(n);
  });

  return roots;
}

/* ─── Row ───────────────── */

const Row = React.memo(function Row({ node, depth, stateMap, onChange }: any) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const isParent = node.children.length > 0;
  const state = stateMap[node.elementId]; // ✅ درست
  const perms = state?.perms ?? EMPTY;

  return (
    <>
      <TableRow
        sx={{
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.06),
          },
        }}
      >
        <TableCell sx={{ pl: 2 + depth * 3 }}>
          <Box display="flex" alignItems="center">
            {isParent && (
              <IconButton size="small" onClick={() => setOpen(!open)}>
                {open ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            )}
            <Typography fontWeight={depth === 0 ? 600 : 400}>
              {node.caption || node.name}
            </Typography>
          </Box>
        </TableCell>

        {PERMISSIONS.map((p) => {
          const disabled = isParent && p !== "canView";

          return (
            <TableCell key={p} align="center">
              <Checkbox
                size="small"
                checked={perms[p]}
                disabled={disabled}
                onChange={(_, val) => onChange(node.elementId, p, val)}
              />
            </TableCell>
          );
        })}
      </TableRow>

      {open &&
        node.children.map((c: Node) => (
          <Row
            key={c.elementId}
            node={c}
            depth={depth + 1}
            stateMap={stateMap} // ✅ مهم
            onChange={onChange}
          />
        ))}
    </>
  );
});

/* ─── Main ───────────────── */

export default function TabAccessElements() {
  const userGroupId = useAtomValue(atomUserGroupId) as number;
  const theme = useTheme();

  const [elements, setElements] = useState<TypeTblElement[]>([]);
  const [stateMap, setStateMap] = useState<StateMap>({});

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

  const handleChange = useCallback(
    (id: number, key: Permission, val: boolean) => {
      setStateMap((p) => ({
        ...p,
        [id]: {
          ...p[id],
          perms: { ...p[id].perms, [key]: val },
        },
      }));
    },
    [],
  );

  /* save */

  const handleSave = async () => {
    const promises = Object.entries(stateMap).map(async ([id, s]) => {
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
    });

    await Promise.all(promises);
  };

  /* render */

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        p={2}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Typography variant="h6">Access Control</Typography>

        <Button startIcon={<Save />} variant="contained" onClick={handleSave}>
          Save
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Element</TableCell>
              <TableCell align="center">Create</TableCell>
              <TableCell align="center">Update</TableCell>
              <TableCell align="center">Delete</TableCell>
              <TableCell align="center">Export</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tree.map((n) => (
              <Row
                key={n.elementId}
                node={n}
                depth={0}
                stateMap={stateMap}
                onChange={handleChange}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
