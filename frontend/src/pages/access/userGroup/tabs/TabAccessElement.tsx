import { Box, Typography } from "@mui/material";

const TabAccessElements = (props: any) => {
  const { elements, permissions, setPermissions, mode, recordId } = props;

  return (
    <Box>
      elements
      {/* <PermissionsEditor
        elements={elements}
        selectedPermissions={permissions}
        onChange={setPermissions}
      /> */}
    </Box>
  );
};

export default TabAccessElements;
