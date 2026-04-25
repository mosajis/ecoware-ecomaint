import { Box, Typography } from "@mui/material";

const TabAccessInstalltion = (props: any) => {
  const { elements, permissions, setPermissions, mode, recordId } = props;

  return (
    <Box>
      InstallationAccess
      {/* <PermissionsEditor
        elements={elements}
        selectedPermissions={permissions}
        onChange={setPermissions}
      /> */}
    </Box>
  );
};

export default TabAccessInstalltion;
