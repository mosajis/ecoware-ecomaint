import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import { useAtom } from "jotai";
import { styled } from "@mui/material/styles";
import { atomRig } from "../atoms/general.atom";
import { tblInstallation, TypeTblInstallation } from "@/core/api/generated/api";
import Select, {
  type SelectChangeEvent,
  selectClasses,
} from "@mui/material/Select";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const [selectedRig, setSelectedRig] = useAtom(atomRig);
  const [installations, setInstallations] = React.useState<
    TypeTblInstallation[]
  >([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await tblInstallation.getAll();
        const data: TypeTblInstallation[] = Array.isArray(response)
          ? response
          : response.items;
        setInstallations(data);
      } catch (error) {
        console.error("Failed to fetch installations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (!loading && installations.length > 0) {
      const isValid =
        selectedRig &&
        installations.some((item) => item.instId === selectedRig.instId);
      if (!isValid) {
        setSelectedRig(installations[0]);
      }
    }
  }, [loading, installations, selectedRig, setSelectedRig]);

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    const selected = installations.find(
      (item) => String(item.instId) === value,
    );
    if (selected) {
      setSelectedRig(selected);
    }
  };

  return (
    <Select
      value={selectedRig ? String(selectedRig.instId) : ""}
      onChange={handleChange}
      displayEmpty
      fullWidth
      sx={{
        border: 0,
        maxHeight: 56,
        width: "95%",
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      {installations.map((item) => (
        <MenuItem key={item.instId} value={String(item.instId)}>
          <ListItemAvatar>
            <Avatar alt={item.name}>
              <DevicesRoundedIcon sx={{ fontSize: "1rem" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.name} secondary={item.caption} />
        </MenuItem>
      ))}
    </Select>
  );
}
